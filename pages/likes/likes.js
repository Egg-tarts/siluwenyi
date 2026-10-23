const savedItems = [
  {
    id: 's1',
    title: '敦煌夜色里的驼铃声',
    desc: '鸣沙山、月牙泉和沙洲夜市的轻松安排。',
    image: 'https://free.picui.cn/free/2026/06/21/6a376644b3b26.png',
    tag: '攻略'
  },
  {
    id: 's2',
    title: '张掖丹霞日落拍照点',
    desc: '适合等光线的观景台和离场节奏。',
    image: 'https://free.picui.cn/free/2026/06/21/6a376641229b8.png',
    tag: '摄影'
  },
  {
    id: 's3',
    title: '兰州黄河夜游清单',
    desc: '中山桥、白塔山、茶摊和返程提醒。',
    image: 'https://free.picui.cn/free/2026/06/21/6a376637d8919.png',
    tag: '城市'
  },
  {
    id: 's4',
    title: '麦积山亲子讲解路线',
    desc: '石窟故事、轻松台阶和休息点建议。',
    image: 'https://free.picui.cn/free/2026/06/21/6a37664115350.png',
    tag: '文博'
  }
]

Page({
  data: {
    savedItems
  },

  openItem(e) {
    wx.showToast({
      title: e.currentTarget.dataset.title,
      icon: 'none'
    })
  }
})
