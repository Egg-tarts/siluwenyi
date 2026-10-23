Page({
  data: {
    foods: [
      {
        name: '兰州牛肉面',
        city: '兰州',
        image: 'https://free.picui.cn/free/2026/06/24/6a3b899e0c11e.jpg',
        flavor: '清汤、萝卜、辣油，一碗打开清晨。',
        time: '早餐',
        pair: '甜胚子'
      },
      {
        name: '敦煌驴肉黄面',
        city: '敦煌',
        image: 'https://free.picui.cn/free/2026/06/24/6a3b899e1b799.jpg',
        flavor: '筋道黄面配浓香驴肉，适合大漠归来。',
        time: '午餐',
        pair: '杏皮水'
      },
      {
        name: '天水呱呱',
        city: '天水',
        image: 'https://free.picui.cn/free/2026/06/24/6a3b899e06f7e.jpg',
        flavor: '荞麦香气浓郁，辣子与醋香很醒神。',
        time: '小吃',
        pair: '浆水面'
      },
      {
        name: '武威三套车',
        city: '武威',
        image: 'https://free.picui.cn/free/2026/06/24/6a3b899e0cbc7.jpg',
        flavor: '行面、卤肉、茯茶一起上桌，像一套旅途补给。',
        time: '午后',
        pair: '茯茶'
      },
      {
        name: '张掖搓鱼子',
        city: '张掖',
        image: 'https://free.picui.cn/free/2026/06/24/6a3b899859f77.jpg',
        flavor: '小面鱼吸满汤汁，适合丹霞日落后的热乎一餐。',
        time: '晚餐',
        pair: '炒炮仗'
      },
      {
        name: '陇南洋芋搅团',
        city: '陇南',
        image: 'https://free.picui.cn/free/2026/06/24/6a3b899df213b.jpg',
        flavor: '山地风味朴实绵密，酸辣调味很开胃。',
        time: '家常',
        pair: '罐罐茶'
      }
    ],
    routes: [
      { title: '一碗面认识兰州', desc: '牛肉面、甜胚子、灰豆子，适合城市首日。' },
      { title: '河西夜市巡游', desc: '张掖、酒泉、敦煌的夜市小吃连成一条烟火线。' },
      { title: '山地暖胃路线', desc: '天水、陇南、平凉适合寻找酸辣与热汤。' }
    ],
    pairing: [
      { label: '解腻', value: '杏皮水' },
      { label: '暖身', value: '罐罐茶' },
      { label: '夜宵', value: '烤羊肉' }
    ]
  },

  goBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack()
      return
    }
    wx.reLaunch({ url: '/pages/touring/touring' })
  }
})
