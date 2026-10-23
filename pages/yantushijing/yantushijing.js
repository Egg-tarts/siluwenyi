const allSpots = [
  {
    id: 'maiji',
    name: '麦积山石窟',
    city: '天水',
    tag: '石窟',
    image: 'https://free.picui.cn/free/2026/06/24/6a3b89ad87768.jpg',
    desc: '栈道悬空，泥塑造像在山壁间沉静微笑，适合上午光线柔和时进入。',
    best: '09:00-11:00',
    tip: '带长焦拍局部造像，台阶较多，轻装更舒服。',
    shot: '仰拍栈道、侧拍山壁层次、近景记录泥塑神态。'
  },
  {
    id: 'jiayu',
    name: '嘉峪关关城',
    city: '嘉峪关',
    tag: '关隘',
    image: 'https://free.picui.cn/free/2026/06/24/6a3b89aaefa7d.jpg',
    desc: '城楼、戈壁与长城共同构成西行边塞记忆，风声很有画面感。',
    best: '16:30-18:30',
    tip: '傍晚从城墙侧面取景，层次比正面更丰富。',
    shot: '城门纵深、墙体斜线、夕阳下的戈壁边界。'
  },
  {
    id: 'zhangye',
    name: '张掖七彩丹霞',
    city: '张掖',
    tag: '丹霞',
    image: 'https://free.picui.cn/free/2026/06/24/6a3b89ab2f317.jpg',
    desc: '彩丘层叠，雨后或黄昏时色带最饱满，是大地纹理的高光片段。',
    best: '日落前一小时',
    tip: '优先选择 4 号观景台，等待光线横扫山体。',
    shot: '长焦压缩色带、广角交代观景台、日落前后连拍。'
  },
  {
    id: 'dunhuang',
    name: '鸣沙山月牙泉',
    city: '敦煌',
    tag: '沙漠',
    image: 'https://free.picui.cn/free/2026/06/24/6a3b89adb9c1f.jpg',
    desc: '沙山环抱清泉，驼铃声把旅人引向绿洲，夜色降临后更像故事开场。',
    best: '18:00-21:00',
    tip: '注意防沙，手机镜头提前贴好保护膜。',
    shot: '沙脊曲线、泉水倒影、驼队剪影。'
  },
  {
    id: 'baiyin',
    name: '黄河石林',
    city: '白银',
    tag: '峡谷',
    image: 'https://free.picui.cn/free/2026/06/24/6a3b89aae53bf.jpg',
    desc: '峡谷、古渡与黄河水势交错，适合放进行程的野性风景段。',
    best: '10:00-15:00',
    tip: '坐羊皮筏子前确认天气和水位，鞋底要防滑。',
    shot: '峡谷夹景、筏子入画、黄河水面反光。'
  },
  {
    id: 'wuwei',
    name: '武威雷台汉墓',
    city: '武威',
    tag: '文博',
    image: 'https://free.picui.cn/free/2026/06/24/6a3b89addba4a.jpg',
    desc: '从铜奔马开始读懂河西走廊，适合安排为城市文化慢游。',
    best: '14:00-16:00',
    tip: '室内展陈适合午后避暑，提前了解铜奔马故事。',
    shot: '展陈细节、门楼对称、文物说明与人物同框。'
  },
  {
    id: 'lanzhou',
    name: '兰州黄河风情线',
    city: '兰州',
    tag: '黄河',
    image: 'https://free.picui.cn/free/2026/06/24/6a3b89ab37e38.jpg',
    desc: '从中山桥到白塔山，城市烟火和黄河风光贴得很近。',
    best: '19:00-21:00',
    tip: '夜游前确认返程车，桥上人多时注意随身物品。',
    shot: '桥面人流、河面灯影、白塔山夜色。'
  },
  {
    id: 'longnan',
    name: '陇南官鹅沟',
    city: '陇南',
    tag: '山水',
    image: 'https://free.picui.cn/free/2026/06/24/6a3b89aa718b5.jpg',
    desc: '峡谷、湖水和森林让甘肃多了一段清润气质，适合慢慢走。',
    best: '08:30-12:00',
    tip: '山地天气变化快，雨衣和薄外套都带上。',
    shot: '湖水倒影、栈道转弯、森林透光。'
  }
]

const filterNames = ['全部', '石窟', '关隘', '丹霞', '沙漠', '峡谷', '文博', '黄河', '山水']

function buildFilters(activeFilter) {
  return filterNames.map((name, index) => ({
    name,
    index,
    className: index === activeFilter ? 'filter filter-active' : 'filter'
  }))
}

function withSavedState(spots, savedIds) {
  return spots.map(item => ({
    ...item,
    saved: savedIds.indexOf(item.id) > -1,
    saveText: savedIds.indexOf(item.id) > -1 ? '已加入清单' : '加入拾景清单',
    saveClass: savedIds.indexOf(item.id) > -1 ? 'save-button saved' : 'save-button'
  }))
}

Page({
  data: {
    filters: buildFilters(0),
    activeFilter: 0,
    spots: withSavedState(allSpots, []),
    featured: allSpots[0],
    savedIds: [],
    savedCount: 0,
    themes: [
      { title: '日落追光线', desc: '张掖丹霞接嘉峪关，适合摄影爱好者，重点看光线变化。' },
      { title: '石窟听讲线', desc: '麦积山与敦煌组合，文化密度高，适合慢游和讲解。' },
      { title: '黄河风物线', desc: '兰州、白银、临夏串联河谷、市集与古渡。' },
      { title: '山水换气线', desc: '天水、陇南更清润，适合亲子和避暑节奏。' }
    ],
    photoRules: [
      '先拍全景交代地点，再拍局部纹理，最后拍同行人的背影或手部细节。',
      '沙漠、丹霞、长城段尽量用侧光，正午少拍大景，多拍线条和影子。',
      '文博场馆不使用闪光灯，说明牌和展品分开拍，后期更好整理。'
    ]
  },

  onLoad() {
    const savedIds = wx.getStorageSync('yantushijingSaved') || []
    this.applyFilter(0, savedIds)
  },

  setFilter(e) {
    const activeFilter = Number(e.currentTarget.dataset.index)
    this.applyFilter(activeFilter, this.data.savedIds)
  },

  applyFilter(activeFilter, savedIds) {
    const filter = filterNames[activeFilter]
    const source = filter === '全部' ? allSpots : allSpots.filter(item => item.tag === filter)
    this.setData({
      activeFilter,
      filters: buildFilters(activeFilter),
      spots: withSavedState(source, savedIds),
      featured: source[0] || allSpots[0],
      savedIds,
      savedCount: savedIds.length
    })
  },

  toggleSave(e) {
    const id = e.currentTarget.dataset.id
    const savedIds = this.data.savedIds.indexOf(id) > -1
      ? this.data.savedIds.filter(item => item !== id)
      : this.data.savedIds.concat(id)
    wx.setStorageSync('yantushijingSaved', savedIds)
    this.applyFilter(this.data.activeFilter, savedIds)
  },

  goBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack()
      return
    }
    wx.reLaunch({ url: '/pages/touring/touring' })
  }
})
