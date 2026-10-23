const contentStore = require('../../utils/contentStore')
const cloudContainer = require('../../utils/cloudContainerClient')

const defaultAvatar = 'https://free.picui.cn/free/2026/06/21/6a37c4267aa75.png'

function maskPhone(phone) {
  const text = String(phone || '')
  if (!/^1\d{10}$/.test(text)) return text || '微信绑定手机号已授权'
  return text.slice(0, 3) + '****' + text.slice(7)
}

function maskCode(code) {
  const text = String(code || '')
  return text ? 'WX-' + text.slice(-6) : ''
}

function buildUserId(source) {
  const text = String(source || Date.now())
  let sum = 0
  for (let i = 0; i < text.length; i += 1) {
    sum = (sum + text.charCodeAt(i) * (i + 1)) % 1000000
  }
  return 'SR' + String(sum || Date.now()).slice(-6).padStart(6, '0')
}

Page({
  data: {
    loading: false,
    avatarUrl: defaultAvatar,
    hasCustomAvatar: false,
    avatarHint: '点击授权头像',
    nickName: '',
    phone: '',
    phoneCode: '',
    phoneAuthorized: false,
    phoneLabel: '未授权',
    phoneCheckClass: 'phone-check',
    phoneCheckText: '',
    loginStatus: '可以使用微信登录，也可以先以游客身份体验',
    loginStepText: '待授权',
    canRequestPhone: false,
    showManualPhone: false,
    manualPhone: '',
    redirectUrl: '',
    forceGuestRequired: false
  },

  onLoad(options) {
    const stored = contentStore.getProfileUser()
    const hasLoggedAvatar = !!(stored.loggedIn && !stored.isGuest && stored.avatarUrl && stored.avatarUrl !== defaultAvatar)
    const redirectUrl = options && options.redirect ? decodeURIComponent(options.redirect) : ''
    const guestRequired = options && options.mode === 'guestRequired'

    this.setData({
      redirectUrl,
      forceGuestRequired: guestRequired,
      avatarUrl: hasLoggedAvatar ? stored.avatarUrl : defaultAvatar,
      hasCustomAvatar: hasLoggedAvatar,
      nickName: stored.loggedIn && !stored.isGuest ? stored.nickName || '' : '',
      phone: stored.phone || '',
      phoneAuthorized: !!(stored.phone || stored.phoneAuthorized),
      phoneLabel: stored.phone ? maskPhone(stored.phone) : (stored.phoneAuthorized ? '微信绑定手机号已授权' : '未授权'),
      loginStatus: guestRequired
        ? '请先进行游客登录。登录后会自动进入刚才点击的功能，后续操作会保存在本机。'
        : '可以使用微信登录，也可以先以游客身份体验',
      loginStepText: guestRequired ? '请先进行游客登录' : '待授权'
    }, () => this.updateReadyState())
  },

  goBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack()
      return
    }
    wx.reLaunch({ url: '/pages/profile/profile' })
  },

  onChooseAvatar(e) {
    const avatarUrl = e.detail && e.detail.avatarUrl ? e.detail.avatarUrl : ''

    if (!avatarUrl) {
      this.setData({
        avatarUrl: defaultAvatar,
        hasCustomAvatar: false,
        loginStatus: '头像授权没有完成'
      }, () => this.updateReadyState())
      return
    }

    this.setData({
      avatarUrl,
      hasCustomAvatar: true,
      loginStatus: '头像已授权，请继续填写昵称'
    }, () => this.updateReadyState())

    wx.saveFile({
      tempFilePath: avatarUrl,
      success: res => {
        this.setData({ avatarUrl: res.savedFilePath || avatarUrl })
      }
    })
  },

  onNameInput(e) {
    this.setData({ nickName: e.detail.value }, () => this.updateReadyState())
  },

  onManualPhoneInput(e) {
    this.setData({ manualPhone: e.detail.value })
  },

  toggleManualPhone() {
    const showManualPhone = !this.data.showManualPhone
    this.setData({
      showManualPhone,
      loginStatus: showManualPhone ? '请输入要绑定的手机号' : '请使用微信绑定手机号完成授权'
    })
  },

  updateReadyState() {
    const canRequestPhone = this.data.hasCustomAvatar && !!this.data.nickName.trim()
    const phoneAuthorized = !!this.data.phoneAuthorized

    this.setData({
      canRequestPhone,
      avatarHint: this.data.hasCustomAvatar ? '头像已授权' : '点击授权头像',
      phoneCheckClass: phoneAuthorized ? 'phone-check phone-check-on' : 'phone-check',
      phoneCheckText: phoneAuthorized ? '✓' : '',
      loginStepText: this.data.forceGuestRequired && !canRequestPhone
        ? '请先进行游客登录'
        : (canRequestPhone ? (phoneAuthorized ? '可登录' : '待手机号授权') : '可游客体验')
    })
  },

  validateProfile() {
    const nickName = this.data.nickName.trim()

    if (!this.data.hasCustomAvatar || this.data.avatarUrl === defaultAvatar) {
      wx.showToast({ title: '请先授权头像', icon: 'none' })
      this.setData({
        loginStatus: '请点击头像完成授权，或使用游客登录',
        loginStepText: '待头像授权'
      })
      return false
    }

    if (!nickName) {
      wx.showToast({ title: '请填写昵称', icon: 'none' })
      this.setData({
        loginStatus: '请填写昵称后再登录，或使用游客登录',
        loginStepText: '待昵称'
      })
      return false
    }

    return true
  },

  onGetPhoneNumber(e) {
    if (this.data.loading) return
    if (!this.validateProfile()) return

    const detail = e.detail || {}
    const errMsg = detail.errMsg || ''

    if (errMsg && errMsg.indexOf('ok') === -1) {
      const phoneErrorText = this.describePhoneAuthError(errMsg)
      this.setData({
        phoneAuthorized: false,
        phoneCode: '',
        phoneLabel: '未授权',
        loginStatus: phoneErrorText,
        loginStepText: '待手机号授权'
      }, () => this.updateReadyState())
      wx.showToast({ title: '手机号授权未完成', icon: 'none' })
      return
    }

    this.setData({
      phoneAuthorized: true,
      phoneCode: detail.code || '',
      phoneLabel: detail.phoneNumber ? maskPhone(detail.phoneNumber) : '微信绑定手机号已授权',
      phone: detail.phoneNumber || this.data.phone,
      loginStatus: '手机号已授权，正在确认微信身份',
      loginStepText: '微信确认中'
    }, () => this.updateReadyState())

    this.loginWithWechat({
      phoneCode: detail.code || '',
      encryptedData: detail.encryptedData || '',
      iv: detail.iv || '',
      cloudID: detail.cloudID || '',
      phoneNumber: detail.phoneNumber || ''
    })
  },

  describePhoneAuthError(errMsg) {
    const message = String(errMsg || '')

    if (message.indexOf('deny') > -1 || message.indexOf('cancel') > -1) {
      return '你取消了手机号授权，可以重新点击绿色按钮授权'
    }

    if (message.indexOf('no permission') > -1 || message.indexOf('permission') > -1) {
      return '当前小程序还没有手机号授权能力，请检查 AppID、类目、认证和手机号能力配置'
    }

    if (message.indexOf('unsupported') > -1 || message.indexOf('not supported') > -1) {
      return '当前环境不支持手机号授权，请用微信真机预览或体验版测试'
    }

    if (message.indexOf('invalid') > -1) {
      return '手机号授权场景无效，请确认是从正确的小程序或 App 授权入口进入'
    }

    return '手机号授权没有完成：' + message
  },

  loginWithWechat(phonePayload) {
    if (this.data.loading) return
    if (!this.validateProfile()) return

    this.setData({
      loading: true,
      loginStatus: '正在获取微信登录凭证',
      loginStepText: '获取凭证'
    })

    this.getWechatLoginCode().then(loginRes => {
      this.setData({
        loginStatus: loginRes.source === 'miniProgramCode'
          ? 'App 授权凭证已获取，正在完成登录'
          : '微信凭证已获取，正在完成登录',
        loginStepText: '身份确认'
      })

      this.exchangeWechatCode(loginRes.code, {
        ...(phonePayload || {}),
        codeSource: loginRes.source
      })
    }).catch(error => {
      this.finishLoginError(error.message || '微信登录没有完成，请稍后再试')
    })
  },

  getWechatLoginCode() {
    return new Promise((resolve, reject) => {
      const onSuccess = source => res => {
        const code = res && res.code
        if (!code) {
          reject(new Error('没有获取到微信登录凭证，请重试'))
          return
        }

        resolve({ code, source })
      }

      const useWxLogin = () => {
        wx.login({
          success: onSuccess('wxLogin'),
          fail: () => reject(new Error('微信登录没有完成，请稍后再试'))
        })
      }

      if (typeof wx.getMiniProgramCode === 'function') {
        wx.getMiniProgramCode({
          success: onSuccess('miniProgramCode'),
          fail: useWxLogin
        })
        return
      }

      useWxLogin()
    })
  },

  exchangeWechatCode(code, phonePayload) {
    const app = getApp()
    const endpoint = app.globalData && app.globalData.wechatLoginEndpoint

    if (!endpoint) {
      this.useLocalLogin(code, phonePayload, '登录配置未完成，已进入体验登录')
      return
    }

    this.requestLoginExchange({
      url: endpoint,
      method: 'POST',
      timeout: 30000,
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        code,
        codeSource: phonePayload.codeSource || 'wxLogin',
        nickName: this.data.nickName.trim(),
        avatarUrl: this.data.avatarUrl,
        phone: phonePayload.phoneNumber || this.data.phone,
        phoneCode: phonePayload.phoneCode || '',
        encryptedData: phonePayload.encryptedData || '',
        iv: phonePayload.iv || '',
        cloudID: phonePayload.cloudID || ''
      },
      success: res => {
        const data = res.data || {}

        if (res.statusCode < 200 || res.statusCode >= 300 || data.error || !data.token) {
          this.useLocalLogin(code, phonePayload, this.formatWechatLoginError(data.error, data.detail))
          return
        }

        this.saveUser({
          loginType: data.codeSource === 'miniProgramCode' ? 'App 微信授权登录' : '微信登录',
          loginCodeText: maskCode(code),
          loginCode: code,
          token: data.token,
          openid: data.openid || '',
          unionid: data.unionid || '',
          userId: data.userId || '',
          nickName: data.nickName || this.data.nickName.trim(),
          avatarUrl: data.avatarUrl || this.data.avatarUrl,
          phone: data.phone || phonePayload.phoneNumber || this.data.phone,
          phoneAuthorized: true,
          statusText: '登录成功，个人资料已更新'
        })
      },
      fail: () => {
        this.useLocalLogin(code, phonePayload, '身份确认暂未完成，已进入体验登录')
      }
    })
  },

  requestLoginExchange(options) {
    if (cloudContainer.isEnabled()) {
      cloudContainer.requestJson({
        path: '/api/wechat/login',
        method: 'POST',
        data: options.data,
        header: options.header
      }).then(options.success).catch(options.fail)
      return
    }

    wx.request(options)
  },

  useLocalLogin(code, phonePayload, reason) {
    const phone = phonePayload.phoneNumber || this.data.phone || this.data.manualPhone
    const nickName = this.data.nickName.trim()
    const localSource = [nickName, phone, this.data.avatarUrl].join('|')

    this.saveUser({
      loginType: '微信授权体验登录',
      loginCodeText: maskCode(code),
      loginCode: code,
      token: 'local-' + buildUserId(localSource),
      openid: '',
      unionid: '',
      userId: buildUserId(localSource),
      nickName,
      avatarUrl: this.data.avatarUrl,
      phone,
      phoneAuthorized: !!(phone || phonePayload.phoneCode || this.data.phoneAuthorized),
      isGuest: false,
      statusText: reason || '已进入体验登录'
    })
  },

  guestLogin() {
    if (this.data.loading) return

    const id = 'GUEST-' + Date.now()
    this.saveUser({
      loginType: '游客登录',
      loginCodeText: 'GUEST',
      loginCode: id,
      token: '',
      openid: '',
      unionid: '',
      userId: id,
      nickName: '游客旅人',
      avatarUrl: defaultAvatar,
      phone: '',
      phoneAuthorized: false,
      isGuest: true,
      statusText: '已进入游客模式，风行万里路线档案会保存在本机'
    })
  },

  formatWechatLoginError(error, detail) {
    if (error === 'WECHAT_CONFIG_MISSING') return '微信登录参数未配置，已进入体验登录'
    if (error === 'WECHAT_CODE_REQUIRED') return '微信登录凭证为空，已进入体验登录'
    if (error === 'PROFILE_REQUIRED') return '请先授权头像并填写昵称'
    if (error === 'WECHAT_CODE2SESSION_FAILED') {
      const message = detail && detail.errmsg ? detail.errmsg : ''
      return message ? '微信身份确认失败：' + message : '微信身份确认失败，已进入体验登录'
    }
    if (error === 'WECHAT_OPENID_EMPTY') return '微信身份标识为空，已进入体验登录'
    return '微信登录未完成，已进入体验登录'
  },

  loginWithManualPhone() {
    if (this.data.loading) return
    if (!this.validateProfile()) return

    const phone = this.data.manualPhone.trim()
    if (!/^1\d{10}$/.test(phone)) {
      wx.showToast({ title: '请输入正确手机号', icon: 'none' })
      return
    }

    this.setData({
      phone,
      phoneAuthorized: true,
      phoneLabel: maskPhone(phone)
    }, () => this.updateReadyState())

    this.loginWithWechat({
      phoneNumber: phone
    })
  },

  saveUser(info) {
    const previous = contentStore.getProfileUser()
    const user = {
      ...previous,
      loggedIn: true,
      isGuest: !!info.isGuest,
      nickName: info.nickName,
      avatarUrl: info.avatarUrl || defaultAvatar,
      phone: info.phone || '',
      phoneAuthorized: !!(info.phoneAuthorized || info.phone),
      userId: info.userId || buildUserId(info.loginCode || info.token),
      loginType: info.loginType,
      loginCodeText: info.loginCodeText,
      token: info.token || '',
      openid: info.openid || '',
      unionid: info.unionid || '',
      lastLoginAt: '刚刚',
      footprints: info.isGuest ? 0 : Number(previous.footprints || 0),
      fans: info.isGuest ? 0 : Number(previous.fans || 0),
      follows: info.isGuest ? 0 : Number(previous.follows || 0),
      likes: info.isGuest ? 0 : Number(previous.likes || 0),
      points: info.isGuest ? 0 : Number(previous.points || 0),
      postsCount: info.isGuest ? 0 : Number(previous.postsCount || 0)
    }

    contentStore.saveProfileUser(user)

    if (!user.isGuest) {
      contentStore.saveLoginRecord({
        id: 'login-' + Date.now(),
        type: info.loginType,
        codeText: info.loginCodeText,
        nickName: user.nickName,
        avatarUrl: user.avatarUrl,
        time: '刚刚'
      })
    }

    this.setData({
      loading: false,
      avatarUrl: user.avatarUrl,
      hasCustomAvatar: !user.isGuest && user.avatarUrl !== defaultAvatar,
      nickName: user.isGuest ? '' : user.nickName,
      loginStatus: info.statusText || '登录成功，个人资料已更新',
      loginStepText: user.isGuest ? '游客模式' : '已完成',
      phone: user.phone,
      phoneAuthorized: user.phoneAuthorized,
      phoneLabel: user.phone ? maskPhone(user.phone) : (user.phoneAuthorized ? '微信绑定手机号已授权' : '未授权')
    }, () => this.updateReadyState())

    wx.showToast({ title: user.isGuest ? '游客登录成功' : '登录成功', icon: 'success' })
    setTimeout(() => {
      if (this.data.redirectUrl) {
        wx.redirectTo({ url: this.data.redirectUrl })
        return
      }
      this.goBack()
    }, 520)
  },

  finishLoginError(message) {
    this.setData({
      loading: false,
      loginStatus: message,
      loginStepText: '未完成'
    })
    wx.showToast({ title: '登录未完成', icon: 'none' })
  }
})
