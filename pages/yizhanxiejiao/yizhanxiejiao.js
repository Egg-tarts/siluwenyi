const stations = [
  {
    name: '兰州黄河慢歇站',
    type: '城市补给',
    distance: '近中山桥',
    status: '夜间友好',
    image: 'https://free.picui.cn/free/2026/06/24/6a3b8ba946a03.jpg',
    tags: ['热茶', '洗手间', '打车点', '亲子座'],
    desc: '适合夜游黄河后整理照片、补水、叫车，老人儿童可在这里先坐下缓一缓。',
    plan: '停留 25 分钟：洗手间 - 热饮 - 确认返程车 - 查看下一站。'
  },
  {
    name: '敦煌沙洲驿客厅',
    type: '沙漠恢复',
    distance: '距鸣沙山 1.8km',
    status: '防晒补给',
    image: 'https://free.picui.cn/free/2026/06/24/6a3b8ba932705.jpg',
    tags: ['防沙', '补水', '充电', '轻食'],
    desc: '沙漠游玩后优先补水、清理鞋袜和镜头，避开最热时段再继续移动。',
    plan: '停留 40 分钟：补水 - 清沙 - 充电 - 购买晚场物资。'
  },
  {
    name: '张掖丹霞小憩台',
    type: '观景休整',
    distance: '近北门游客中心',
    status: '日落高峰',
    image: 'https://free.picui.cn/free/2026/06/24/6a3b8ba931fcf.jpg',
    tags: ['遮阳', '文创', '导览', '热饮'],
    desc: '日落前后人流集中，适合提前规划观景台顺序和离场路线。',
    plan: '停留 30 分钟：看人流 - 选观景台 - 备外套 - 错峰离场。'
  },
  {
    name: '天水麦积山暖脚亭',
    type: '山门照护',
    distance: '距石窟入口 450m',
    status: '老人友好',
    image: 'https://free.picui.cn/free/2026/06/24/6a3b8ba94c4b9.jpg',
    tags: ['热茶', '寄存', '雨具', '台阶提示'],
    desc: '爬山前后适合调整节奏，确认台阶强度，给长辈安排更轻松的路线。',
    plan: '停留 35 分钟：寄存重物 - 热饮 - 查看台阶 - 分段游览。'
  }
]

function decorateStations(activeIndex) {
  return stations.map((item, index) => ({
    ...item,
    className: index === activeIndex ? 'station-chip station-chip-active' : 'station-chip'
  }))
}

function decorateChecklist(list) {
  return list.map(item => ({
    ...item,
    checkedText: item.checked ? '✓' : '',
    className: item.checked ? 'todo done' : 'todo'
  }))
}

Page({
  data: {
    activeStation: 0,
    currentStation: stations[0],
    stations: decorateStations(0),
    planReady: false,
    restMinutes: 25,
    serviceFlow: [
      { step: '01', title: '先坐下', desc: '到站先找座位，老人儿童优先，5 分钟内不急着继续赶路。' },
      { step: '02', title: '补水充电', desc: '水杯、手机、相机、充电宝一起检查，避免下一段路临时掉线。' },
      { step: '03', title: '整理装备', desc: '沙土、雨具、外套、证件、票码全部归位，减少遗失。' },
      { step: '04', title: '确认下一程', desc: '把目的地、车程、打车点、集合点一次确认清楚。' }
    ],
    nannyServices: [
      { title: '老人照护', desc: '自动建议短休节奏、少台阶路线、热饮点和靠近卫生间的位置。' },
      { title: '亲子照护', desc: '提供集合口令、亲子座位、洗手间、轻食和防走失提醒。' },
      { title: '行李照护', desc: '把寄存、充电、补给、雨具、镜头清理做成到站检查表。' },
      { title: '返程照护', desc: '每个驿站给出“继续玩/先返回/换路线”的保守建议。' }
    ],
    comfort: [
      { label: '休整建议', value: '25分钟' },
      { label: '补给强度', value: '高' },
      { label: '照护等级', value: '保姆级' }
    ],
    checklist: decorateChecklist([
      { id: 'seat', text: '先找座位并清点同行人数', checked: true },
      { id: 'water', text: '每人补水 200-300ml', checked: false },
      { id: 'power', text: '手机电量高于 40%', checked: false },
      { id: 'ticket', text: '下一站票码和集合点确认', checked: false }
    ])
  },

  selectStation(e) {
    const index = Number(e.currentTarget.dataset.index)
    const currentStation = this.data.stations[index]
    const restMinutes = index === 1 ? 40 : index === 3 ? 35 : 25
    this.setData({
      activeStation: index,
      currentStation,
      stations: decorateStations(index),
      restMinutes,
      planReady: false,
      comfort: [
        { label: '休整建议', value: restMinutes + '分钟' },
        { label: '补给强度', value: index === 1 ? '很高' : '高' },
        { label: '照护等级', value: '保姆级' }
      ]
    })
  },

  toggleTodo(e) {
    const id = e.currentTarget.dataset.id
    const checklist = decorateChecklist(this.data.checklist.map(item => {
      const checked = item.id === id ? !item.checked : item.checked
      return {
        ...item,
        checked
      }
    }))
    this.setData({ checklist })
  },

  makePlan() {
    this.setData({ planReady: true })
    wx.showToast({ title: '歇脚计划已生成', icon: 'success' })
  },

  goBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack()
      return
    }
    wx.reLaunch({ url: '/pages/touring/touring' })
  }
})
