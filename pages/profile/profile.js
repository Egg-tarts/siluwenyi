const contentStore = require('../../utils/contentStore')
const routeStore = require('../../utils/routeStore')

const defaultAvatar = 'https://free.picui.cn/free/2026/06/21/6a37c4267aa75.png'

const defaultUser = {
  loggedIn: false,
  avatarUrl: defaultAvatar,
  nickName: '点击登录',
  userId: '未登录',
  loginTip: '授权后同步订单、收藏与积分',
  footprints: 0,
  fans: 0,
  follows: 0,
  likes: 0,
  points: 0,
  level: 1,
  nextLevel: 2,
  nextLevelPoints: 100,
  remainingPoints: 100,
  progressPercent: 0
}

const preferenceSource = [
  { key: 'museum', label: '文博研学' },
  { key: 'grotto', label: '石窟壁画' },
  { key: 'river', label: '黄河慢游' },
  { key: 'danxia', label: '丹霞摄影' },
  { key: 'food', label: '陇上寻味' },
  { key: 'folk', label: '非遗民俗' },
  { key: 'family', label: '亲子轻旅' },
  { key: 'safe', label: '安心出行' }
]

function normalizeUser(user) {
  const isLoggedIn = !!(user && user.loggedIn)
  const isGuest = !!(user && user.isGuest)
  const points = isLoggedIn && user && Number(user.points) ? Number(user.points) : 0
  const level = Math.floor(points / 100) + 1
  const nextLevelPoints = level * 100
  const progressPercent = Math.min(100, points % 100)
  const displayedUserId = isGuest ? '游客模式' : (isLoggedIn && user.userId ? user.userId : defaultUser.userId)
  const displayedName = isGuest ? '游客旅人' : (isLoggedIn && user.nickName ? user.nickName : defaultUser.nickName)
  const loginTip = isGuest
    ? '登录后同步订单、收藏、积分和路线记录'
    : (isLoggedIn ? '资料已完成' : defaultUser.loginTip)

  return {
    ...defaultUser,
    ...user,
    loggedIn: isLoggedIn,
    isGuest,
    avatarUrl: user && user.avatarUrl ? user.avatarUrl : defaultAvatar,
    nickName: displayedName,
    userId: displayedUserId,
    loginTip,
    footprints: isLoggedIn && user && Number(user.footprints) ? Number(user.footprints) : 0,
    fans: isLoggedIn && user && Number(user.fans) ? Number(user.fans) : 0,
    follows: isLoggedIn && user && Number(user.follows) ? Number(user.follows) : 0,
    likes: isLoggedIn && user && Number(user.likes) ? Number(user.likes) : 0,
    points,
    level,
    nextLevel: level + 1,
    nextLevelPoints,
    remainingPoints: Math.max(0, nextLevelPoints - points),
    progressPercent
  }
}

function buildPreferenceItems() {
  const selected = wx.getStorageSync('profilePreferences') || ['museum', 'grotto', 'river']
  return preferenceSource.map(item => ({
    ...item,
    selected: selected.indexOf(item.key) > -1,
    className: selected.indexOf(item.key) > -1 ? 'preference-chip active' : 'preference-chip'
  }))
}

Page({
  data: {
    user: defaultUser,
    topCards: [
      { title: '我的卡券', image: 'https://free.picui.cn/free/2026/06/21/6a37a7e36cd37.png', action: 'coupon' },
      { title: '我的收藏', image: 'https://free.picui.cn/free/2026/06/21/6a37a7e394252.png', action: 'likes' }
    ],
    orderCards: [
      { title: '全部订单', image: 'https://free.picui.cn/free/2026/06/21/6a37a7e682510.png', action: 'orders' },
      { title: '门票预约', image: 'https://free.picui.cn/free/2026/06/21/6a37a7e38b36a.png', action: 'ticket' },
      { title: '退款售后', image: 'https://free.picui.cn/free/2026/06/21/6a37a7e36cc9d.png', action: 'refund' },
      { title: '待评价', image: 'https://free.picui.cn/free/2026/06/21/6a37a7e391321.png', action: 'review' }
    ],
    serviceItems: [
      { icon: '址', title: '地址管理', action: 'address' },
      { icon: '邀', title: '分享好友', action: 'share' },
      { icon: '礼', title: '平台活动', action: 'activity' },
      { icon: '记', title: '我的发布', action: 'posts' },
      { icon: '程', title: '我的行程', action: 'trip' },
      { icon: '客', title: '售后客服', action: 'service' },
      { icon: '信', title: '我的消息', action: 'message' },
      { icon: '设', title: '我的设置', action: 'setting' },
      { icon: '分', title: '积分兑换', action: 'credit' },
      { icon: '译', title: '随行翻译', action: 'translate' }
    ],
    toolCards: [
      { icon: 'SOS', title: '紧急救援', desc: '联系人、位置与快捷求助', action: 'emergency' },
      { icon: '译', title: '随行翻译', desc: '方言、英语、俄语与民俗提醒', action: 'translate' },
      { icon: '问', title: '丝路问驿', desc: '按时间、预算与偏好生成路线', action: 'siluwenyi' },
      { icon: '影', title: '丝路影像', desc: '上传图片生成甘肃风格短片', action: 'ar' }
    ],
    pointTasks: [
      { title: '完善个人资料', points: '+20', status: '去完成', action: 'login' },
      { title: '生成一次丝路路线', points: '+30', status: '去生成', action: 'trip' },
      { title: '发布一篇旅行笔记', points: '+15', status: '去发布', action: 'publish' },
      { title: '收藏一个沿途景点', points: '+10', status: '去收藏', action: 'likes' },
      { title: '完成一次出行评价', points: '+15', status: '去评价', action: 'review' }
    ],
    memberRights: [
      { title: 'Lv1 初识丝路', desc: '开启基础积分累计与卡券领取。' },
      { title: 'Lv2 轻装远行', desc: '解锁更多路线收藏与兑换提醒。' },
      { title: 'Lv3 问驿达人', desc: '获得文博活动优先提醒和专属徽章。' }
    ],
    journeyCards: [
      { label: '路线记录', value: '0 条', action: 'trip' },
      { label: '我的发布', value: '0 篇', action: 'posts' },
      { label: '安全提醒', value: '实时', action: 'safe' }
    ],
    preferenceItems: buildPreferenceItems(),
    recentCards: [
      { title: '路线规划', value: '0 条', desc: '生成后会出现在风行万里', action: 'trip' },
      { title: '社区发布', value: '0 篇', desc: '记录自己的丝路旅程', action: 'posts' },
      { title: '翻译收藏', value: '0 条', desc: '常用短句可快速复用', action: 'translate' }
    ],
    guardItems: [
      { title: '出行安全卡', desc: '紧急联系人、当前位置与求助话术集中管理。', action: 'emergency' },
      { title: '行程提醒', desc: '按路线查看天气、休息、交通和风险提示。', action: 'safe' },
      { title: '驿站服务', desc: '查询休息点、补给、寄存与亲子友好服务。', action: 'yizhan' }
    ]
  },

  onShow() {
    const stored = contentStore.getProfileUser()
    const posts = contentStore.getMyPosts()
    const routes = routeStore.getRoutes()
    const visiblePostCount = posts.length
    const translateFavorites = wx.getStorageSync('translateFavorites') || []

    this.setData({
      user: normalizeUser(stored),
      journeyCards: [
        { label: '路线记录', value: routes.length + ' 条', action: 'trip' },
        { label: '我的发布', value: visiblePostCount + ' 篇', action: 'posts' },
        { label: '安全提醒', value: '实时', action: 'safe' }
      ],
      preferenceItems: buildPreferenceItems(),
      recentCards: [
        { title: '路线规划', value: routes.length + ' 条', desc: routes.length ? '点击继续查看最近路线' : '还没有路线，去生成一条', action: 'trip' },
        { title: '社区发布', value: visiblePostCount + ' 篇', desc: visiblePostCount ? '你的游记已保存' : '发布后可在个人页查看', action: 'posts' },
        { title: '翻译收藏', value: translateFavorites.length + ' 条', desc: translateFavorites.length ? '常用短句可快速复用' : '收藏常用方言与外语短句', action: 'translate' }
      ]
    })
  },

  goLogin() {
    wx.navigateTo({ url: '/pages/profileLogin/profileLogin' })
  },

  goEmergency() {
    wx.navigateTo({ url: '/pages/emergency/emergency' })
  },

  handleCardTap(e) {
    this.dispatchAction(e.currentTarget.dataset.action)
  },

  togglePreference(e) {
    const key = e.currentTarget.dataset.key
    const selected = wx.getStorageSync('profilePreferences') || ['museum', 'grotto', 'river']
    const next = selected.indexOf(key) > -1
      ? selected.filter(item => item !== key)
      : selected.concat(key)

    wx.setStorageSync('profilePreferences', next)
    this.setData({ preferenceItems: buildPreferenceItems() })
  },

  dispatchAction(action) {
    const routes = {
      coupon: '/pages/coupon/coupon',
      likes: '/pages/likes/likes',
      orders: '/pages/orders/orders?type=all',
      ticket: '/pages/orders/orders?type=ticket',
      refund: '/pages/orders/orders?type=refund',
      review: '/pages/orders/orders?type=review',
      trip: '/pages/fengxingwanli/fengxingwanli',
      safe: '/pages/anxingwuyou/anxingwuyou',
      credit: '/pages/credit/credit',
      translate: '/pages/travelTranslate/travelTranslate',
      emergency: '/pages/emergency/emergency',
      login: '/pages/profileLogin/profileLogin',
      posts: '/pages/posts/posts',
      publish: '/pages/myrecommend/myrecommend',
      siluwenyi: '/pages/siluwenyi/siluwenyi',
      ar: '/pages/arViewer/arViewer',
      yizhan: '/pages/yizhanxiejiao/yizhanxiejiao',
      address: '/pages/profileService/profileService?type=address',
      share: '/pages/profileService/profileService?type=share',
      activity: '/pages/profileService/profileService?type=activity',
      service: '/pages/profileService/profileService?type=service',
      message: '/pages/profileService/profileService?type=message',
      setting: '/pages/profileService/profileService?type=setting'
    }

    if (routes[action]) {
      if (!this.ensureLoggedInForAction(routes[action], action)) return
      wx.navigateTo({ url: routes[action] })
      return
    }
  },

  ensureLoggedInForAction(url, action) {
    const user = contentStore.getProfileUser()
    if (user && user.loggedIn) return true

    if (action === 'emergency') return true

    this.goGuestLogin(url)
    return false
  },

  goGuestLogin(redirectUrl) {
    const loginUrl = '/pages/profileLogin/profileLogin?mode=guestRequired&redirect=' + encodeURIComponent(redirectUrl)
    wx.showToast({ title: '请先进行游客登录', icon: 'none' })
    setTimeout(() => {
      wx.navigateTo({
        url: loginUrl,
        fail: () => wx.redirectTo({ url: loginUrl })
      })
    }, 420)
  }
})
