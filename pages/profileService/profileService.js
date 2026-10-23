const contentStore = require('../../utils/contentStore')

const serviceMap = {
  address: {
    title: '地址管理',
    mark: '址',
    desc: '管理常用联系人、收件地址和出行集合点，方便文创邮寄与行程联系。',
    theme: 'teal',
    primaryText: '保存常用地址',
    cards: [
      { title: '默认联系人', desc: '游客旅人  138****2026', tag: '可编辑' },
      { title: '常用集合点', desc: '兰州中山桥游客服务点', tag: '行程常用' },
      { title: '文创收件地', desc: '点击保存后会写入本机服务记录', tag: '本机保存' }
    ]
  },
  share: {
    title: '分享好友',
    mark: '邀',
    desc: '生成丝路问驿体验邀请卡，适合把路线、社区和文旅工具分享给同伴。',
    theme: 'gold',
    primaryText: '复制邀请口令',
    cards: [
      { title: '同行邀请码', desc: 'SLWY-2026-GANSU', tag: '点击复制' },
      { title: '推荐理由', desc: '路线生成、随行翻译、风行万里记录一站式体验', tag: '已生成' },
      { title: '分享记录', desc: '邀请内容会保存在本机，便于再次查看', tag: '本机保存' }
    ]
  },
  activity: {
    title: '平台活动',
    mark: '礼',
    desc: '查看近期文博活动、路线挑战和积分兑换任务，游客模式也可报名本机活动。',
    theme: 'clay',
    primaryText: '报名本期活动',
    cards: [
      { title: '敦煌夜游影像挑战', desc: '上传一张旅途照片，生成丝路风格短片。', tag: '进行中' },
      { title: '黄河慢游打卡', desc: '收藏兰州黄河风情线并完成一次路线记录。', tag: '+10积分' },
      { title: '陇上寻味清单', desc: '记录三种甘肃美食，生成个人寻味卡。', tag: '本周推荐' }
    ]
  },
  service: {
    title: '售后客服',
    mark: '客',
    desc: '集中处理订单、卡券、路线和影像生成问题，先保存问题再统一查看。',
    theme: 'teal',
    primaryText: '保存咨询工单',
    cards: [
      { title: '订单与退款', desc: '门票、文创、活动报名相关问题。', tag: '常用' },
      { title: '路线生成', desc: '路线不合理、地图不显示、记录未保存。', tag: '可反馈' },
      { title: '影像生成', desc: '生成失败、下载失败、画面不连贯。', tag: '可反馈' }
    ]
  },
  message: {
    title: '我的消息',
    mark: '信',
    desc: '查看系统提醒、路线进度和社区互动，消息状态会保存在本机。',
    theme: 'gold',
    primaryText: '全部标为已读',
    cards: [
      { title: '路线提醒', desc: '风行万里会保存游客模式下生成的路线档案。', tag: '未读' },
      { title: '社区互动', desc: '有人收藏了你的旅行笔记。', tag: '未读' },
      { title: '服务通知', desc: '随行翻译词库已更新更多甘肃方言。', tag: '已读' }
    ]
  },
  setting: {
    title: '我的设置',
    mark: '设',
    desc: '管理本机数据、游客身份、隐私提醒和页面偏好。',
    theme: 'clay',
    primaryText: '保存设置',
    cards: [
      { title: '游客数据保存', desc: '路线、发布、收藏、翻译记录保存在本机。', tag: '开启' },
      { title: '隐私提醒', desc: '生成路线报告不会展示经纬度给用户。', tag: '开启' },
      { title: '页面偏好', desc: '保留旅行偏好标签，用于内容排序。', tag: '可调整' }
    ]
  }
}

Page({
  data: {
    service: serviceMap.address,
    records: [],
    inputText: ''
  },

  onLoad(options) {
    const type = options && options.type ? options.type : 'address'
    const service = serviceMap[type] || serviceMap.address
    this.type = type
    this.setData({
      service,
      records: this.getRecords(type),
      inputText: ''
    })
  },

  goBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack()
      return
    }
    wx.reLaunch({ url: '/pages/profile/profile' })
  },

  onInput(e) {
    this.setData({ inputText: e.detail.value })
  },

  handlePrimary() {
    const service = this.data.service
    const profile = contentStore.getProfileUser()
    const text = this.data.inputText.trim() || service.cards[0].desc
    const record = {
      id: 'service-' + Date.now(),
      title: service.primaryText,
      desc: text,
      user: profile.nickName || '游客旅人',
      time: '刚刚'
    }
    const records = [record].concat(this.getRecords(this.type)).slice(0, 8)
    wx.setStorageSync(this.getStorageKey(this.type), records)

    if (this.type === 'share') {
      wx.setClipboardData({ data: 'SLWY-2026-GANSU' })
    }

    this.setData({ records, inputText: '' })
    wx.showToast({ title: '已保存', icon: 'success' })
  },

  tapCard(e) {
    const index = Number(e.currentTarget.dataset.index)
    const card = this.data.service.cards[index]
    if (!card) return
    this.setData({ inputText: card.desc })
  },

  getStorageKey(type) {
    return 'profileServiceRecords:' + type
  },

  getRecords(type) {
    return wx.getStorageSync(this.getStorageKey(type)) || []
  }
})
