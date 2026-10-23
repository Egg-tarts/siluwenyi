const welcomes = [
  {
    image: 'https://free.picui.cn/free/2026/06/19/6a3527157d1d8.png',
    layout: 'left-top',
    focus: 'right',
    tone: 'amber',
    eyebrow: '敦煌初见',
    subtitle: '越过风沙与长河，在古道回声里写下你的第一站。',
    hint: '驼铃将起，风沙渐明'
  },
  {
    image: 'https://free.picui.cn/free/2026/06/19/6a353bc413c91.png',
    layout: 'left-bottom',
    focus: 'center',
    tone: 'sand',
    eyebrow: '驿门已启',
    subtitle: '从一座门楼出发，抵达风物、记忆与人间烟火。',
    hint: '推门见路，即刻出发'
  },
  {
    image: 'https://free.picui.cn/free/2026/06/19/6a353bc403bbc.png',
    layout: 'right-top',
    focus: 'center',
    tone: 'indigo',
    eyebrow: '一卷蓝热',
    subtitle: '沿着水脉与云纹，翻开丝路上的山河旧梦。',
    hint: '云烟开处，旅程入卷'
  },
  {
    image: 'https://free.picui.cn/free/2026/06/19/6a353bc440411.png',
    layout: 'right-bottom',
    focus: 'left',
    tone: 'night',
    eyebrow: '星河入窟',
    subtitle: '让壁画、星辰与驿路灯火，照见下一段远行。',
    hint: '星光落下，故事启程'
  }
]

Page({
  data: {
    welcome: welcomes[0]
  },

  onLoad() {
    const index = Math.floor(Math.random() * welcomes.length)
    this.setData({
      welcome: welcomes[index]
    })
  },

  onEnterClick() {
    wx.reLaunch({
      url: '/pages/touring/touring'
    })
  }
})
