const gifts = [
  { id: 'g1', name: '敦煌文创书签', points: 80, tag: '文创', desc: '适合作为旅途纪念的小礼物。', image: 'https://free.picui.cn/free/2026/06/24/6a3b8997bf26c.jpg' },
  { id: 'g2', name: '兰州夜游茶饮券', points: 120, tag: '卡券', desc: '黄河风情线夜游补给礼遇。', image: 'https://free.picui.cn/free/2026/06/24/6a3b899860212.jpg' },
  { id: 'g3', name: '丹霞拍照点手册', points: 160, tag: '攻略', desc: '张掖丹霞观景台和追光建议。', image: 'https://free.picui.cn/free/2026/06/24/6a3b8998f00a3.jpg' },
  { id: 'g4', name: '麦积山讲解折扣券', points: 200, tag: '讲解', desc: '适合亲子和文博慢游使用。', image: 'https://free.picui.cn/free/2026/06/24/6a3b8997d8a0b.jpg' }
]

function normalizeUser(user) {
  const points = user && Number(user.points) ? Number(user.points) : 0
  const level = Math.floor(points / 100) + 1
  return {
    points,
    level,
    nextLevelPoints: level * 100,
    progressPercent: Math.min(100, points % 100)
  }
}

function decorateGifts(points) {
  return gifts.map(item => ({
    ...item,
    buttonText: points >= item.points ? '立即兑换' : '积分不足',
    cardClass: points >= item.points ? 'gift-card' : 'gift-card disabled'
  }))
}

Page({
  data: {
    user: normalizeUser(null),
    gifts: decorateGifts(0),
    tasks: [
      { title: '完善资料', desc: '设置头像、昵称和手机号', points: '+20' },
      { title: '生成路线', desc: '使用丝路问驿生成一次路线', points: '+30' },
      { title: '收藏景点', desc: '把喜欢的景点加入收藏', points: '+10' },
      { title: '完成评价', desc: '对一次行程留下体验评价', points: '+15' }
    ]
  },

  onShow() {
    const profile = normalizeUser(wx.getStorageSync('profileUser'))
    this.setData({
      user: profile,
      gifts: decorateGifts(profile.points)
    })
  },

  exchange(e) {
    const id = e.currentTarget.dataset.id
    const item = gifts.find(gift => gift.id === id)
    if (!item) return

    if (this.data.user.points < item.points) {
      wx.showToast({ title: '积分不足，先去完成任务吧', icon: 'none' })
      return
    }

    wx.showToast({ title: '兑换成功', icon: 'success' })
  },

  goBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack()
      return
    }
    wx.reLaunch({ url: '/pages/profile/profile' })
  }
})
