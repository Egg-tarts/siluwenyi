const contacts = [
  { key: 'police', title: '报警求助', phone: '110', desc: '走失、纠纷、人身危险、财物被盗' },
  { key: 'medical', title: '医疗急救', phone: '120', desc: '突发疾病、受伤、中暑、过敏' },
  { key: 'fire', title: '消防救援', phone: '119', desc: '火情、被困、危险环境救援' },
  { key: 'traffic', title: '交通事故', phone: '122', desc: '道路事故、车辆碰撞、交通阻塞' },
  { key: 'tour', title: '旅游咨询', phone: '12345', desc: '景区咨询、投诉、城市公共服务' }
]

const steps = [
  { title: '先保证自身安全', desc: '离开水边、车流、山崖、火源和拥挤人群，站到醒目的开阔位置。' },
  { title: '拨打对应电话', desc: '说清所在城市、附近标志物、人数、伤情和是否需要救护车。' },
  { title: '共享求助信息', desc: '复制本页求助信息发给同行人或家人，不要独自移动。' },
  { title: '保留体力等待', desc: '开启手机电量保护，保持电话畅通，听从现场工作人员指引。' }
]

function pad(value) {
  return value < 10 ? '0' + value : String(value)
}

function formatTime(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

Page({
  data: {
    contacts,
    steps,
    locationStatus: '正在定位',
    locationTitle: '正在读取当前位置',
    locationText: '授权定位后可复制更准确的求助信息。',
    latitude: 0,
    longitude: 0,
    hasLocation: false,
    helpText: '',
    copiedText: '复制求助信息'
  },

  onLoad() {
    this.refreshLocation()
  },

  goBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack()
      return
    }
    wx.reLaunch({ url: '/pages/profile/profile' })
  },

  refreshLocation() {
    this.setData({
      locationStatus: '正在定位',
      locationTitle: '正在读取当前位置',
      locationText: '请稍等，正在尝试获取本机定位。',
      copiedText: '复制求助信息'
    })

    wx.getLocation({
      type: 'gcj02',
      success: res => {
        const latitude = Number(res.latitude)
        const longitude = Number(res.longitude)
        this.setData({
          latitude,
          longitude,
          hasLocation: true,
          locationStatus: '定位可用',
          locationTitle: '当前位置已获取',
          locationText: `纬度 ${latitude.toFixed(5)}，经度 ${longitude.toFixed(5)}`,
          helpText: this.buildHelpText(latitude, longitude)
        })
      },
      fail: () => {
        this.setData({
          latitude: 0,
          longitude: 0,
          hasLocation: false,
          locationStatus: '通用求助',
          locationTitle: '未获取定位',
          locationText: '可在微信设置中允许位置权限；当前仍可拨号和复制通用求助信息。',
          helpText: this.buildHelpText()
        })
      }
    })
  },

  buildHelpText(latitude, longitude) {
    const profile = wx.getStorageSync('profileUser') || {}
    const name = profile.nickName || '丝路问驿用户'
    const time = formatTime(new Date())
    const locationLine = latitude && longitude
      ? `当前位置：纬度 ${latitude.toFixed(5)}，经度 ${longitude.toFixed(5)}。`
      : '当前位置：暂未获取定位，请根据我发送的附近标志物寻找。'

    return [
      '紧急求助信息',
      `求助人：${name}`,
      `时间：${time}`,
      locationLine,
      '我正在甘肃旅行途中需要帮助，请尽快联系我或协助报警/急救。',
      '如无法联系我，请优先拨打 110、120 或联系附近景区工作人员。'
    ].join('\n')
  },

  callPhone(e) {
    const phoneNumber = e.currentTarget.dataset.phone
    wx.showModal({
      title: '确认拨号',
      content: `即将拨打 ${phoneNumber}，请确认当前情况需要紧急联系。`,
      confirmText: '拨打',
      success: res => {
        if (!res.confirm) return
        wx.makePhoneCall({
          phoneNumber,
          fail: () => {
            wx.showToast({ title: '拨号未完成', icon: 'none' })
          }
        })
      }
    })
  },

  copyHelpText() {
    const helpText = this.data.helpText || this.buildHelpText(this.data.latitude, this.data.longitude)
    wx.setClipboardData({
      data: helpText,
      success: () => {
        this.setData({ copiedText: '已复制' })
      }
    })
  },

  openLocation() {
    if (!this.data.hasLocation) {
      wx.showToast({ title: '请先允许定位', icon: 'none' })
      return
    }

    wx.openLocation({
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      scale: 16,
      name: '我的当前位置',
      address: '紧急救援定位点'
    })
  },

  openSetting() {
    wx.openSetting()
  }
})
