const cityRules = [
  { name: '兰州', lat: 36.061, lng: 103.834, note: '黄河风情线夜游注意保暖，打车点建议提前收藏。' },
  { name: '敦煌', lat: 40.142, lng: 94.661, note: '沙漠段风沙和日照强，13:00-16:00 尽量减少暴晒。' },
  { name: '张掖', lat: 38.925, lng: 100.449, note: '丹霞日落后降温明显，返程车次和外套都要提前准备。' },
  { name: '嘉峪关', lat: 39.772, lng: 98.29, note: '关城风口较多，登城墙时看好老人儿童和随身物品。' },
  { name: '天水', lat: 34.58, lng: 105.724, note: '麦积山台阶较多，雨后注意防滑并放慢游览节奏。' }
]

const baseChecks = [
  { id: 'idcard', title: '证件票务', desc: '身份证、预约码、学生/老人优惠证件和门票截图。', done: true },
  { id: 'water', title: '补水防晒', desc: '每人至少一瓶水，沙漠和丹霞段加防晒、墨镜、帽子。', done: true },
  { id: 'route', title: '交通接驳', desc: '确认去程、返程、打车点和备选公交/高铁时间。', done: false },
  { id: 'medicine', title: '应急药包', desc: '晕车药、创可贴、肠胃药、过敏药和常用处方药。', done: false },
  { id: 'family', title: '同行报备', desc: '把今日路线、酒店和预计返程时间同步给家人。', done: false }
]

function decorateChecks(checks) {
  return checks.map(item => ({
    ...item,
    doneText: item.done ? '✓' : '',
    statusText: item.done ? '已完成' : '待确认',
    className: item.done ? 'check-card done' : 'check-card'
  }))
}

function pad(value) {
  return value < 10 ? '0' + value : String(value)
}

function distance(a, b) {
  const lat = a.latitude - b.lat
  const lng = a.longitude - b.lng
  return Math.sqrt(lat * lat + lng * lng)
}

Page({
  timer: null,

  data: {
    score: 88,
    scoreLevel: '稳妥出行',
    scoreClass: 'score-good',
    liveTime: '',
    refreshText: '',
    locationLabel: '甘肃省内',
    locationDetail: '正在读取本机定位；拒绝授权也可使用默认安全方案。',
    locationStatus: '本地实时',
    cityNote: '先确认当天路线和返程方式，长距离移动预留缓冲时间。',
    summary: '根据本机时间、定位授权状态、清单完成度和甘肃出游规则实时计算，稳定守护出行。',
    checks: decorateChecks(baseChecks),
    liveSignals: [],
    alerts: [],
    contacts: [
      { name: '旅游咨询', value: '12345', tip: '政策、投诉、景区咨询' },
      { name: '医疗急救', value: '120', tip: '突发身体不适' },
      { name: '报警求助', value: '110', tip: '走失、纠纷、危险' },
      { name: '交通事故', value: '122', tip: '道路事故处理' }
    ],
    familyCards: [
      { title: '老人同行', desc: '安排 40 分钟一次短休，优先选择有座椅、洗手间、热水的停靠点。' },
      { title: '儿童同行', desc: '把集合点、家长电话写在小卡片上，进入人流密集区前拍照留存衣着。' },
      { title: '自驾同行', desc: '出发前拍下停车位置，山地和戈壁段提前确认油量、电量和轮胎状态。' }
    ]
  },

  onLoad() {
    this.refreshRealtime()
    this.requestLocation()
    this.timer = setInterval(() => {
      this.refreshRealtime()
    }, 60000)
  },

  onUnload() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  },

  refreshRealtime() {
    const now = new Date()
    const hour = now.getHours()
    const minute = now.getMinutes()
    const doneCount = this.data.checks.filter(item => item.done).length
    const total = this.data.checks.length
    const noonRisk = hour >= 12 && hour <= 16
    const nightRisk = hour >= 21 || hour <= 6
    let score = 72 + doneCount * 5

    if (noonRisk) score -= 5
    if (nightRisk) score -= 7
    if (this.data.locationStatus === '定位已授权') score += 3
    if (score > 98) score = 98
    if (score < 58) score = 58

    let scoreLevel = '稳妥出行'
    let scoreClass = 'score-good'
    if (score < 72) {
      scoreLevel = '需要补强'
      scoreClass = 'score-warn'
    } else if (score > 90) {
      scoreLevel = '安心出发'
      scoreClass = 'score-safe'
    }

    const liveSignals = [
      { label: '本机时间', value: pad(hour) + ':' + pad(minute), state: nightRisk ? '夜间谨慎' : '白天适宜' },
      { label: '清单完成', value: doneCount + '/' + total, state: doneCount >= 4 ? '准备充分' : '继续补齐' },
      { label: '守护状态', value: '运行中', state: '稳定可用' }
    ]

    const alerts = [
      { title: noonRisk ? '避开强日照时段' : '保持常规节奏', desc: noonRisk ? '当前接近午后高热时段，沙漠、丹霞、长城段建议找阴凉处休整。' : '当前时段适合移动和参观，仍需按 60-90 分钟节奏补水。', level: noonRisk ? '重点' : '提示' },
      { title: nightRisk ? '夜间返程优先' : '返程预留缓冲', desc: nightRisk ? '夜间景区外交通等待时间更长，建议优先使用正规车辆并共享行程。' : '热门景区闭园前 40 分钟确认返程点，避免人流集中。', level: nightRisk ? '重点' : '提示' },
      { title: '城市安全方案', desc: this.data.cityNote, level: '城市' }
    ]

    this.setData({
      score,
      scoreLevel,
      scoreClass,
      liveTime: now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()) + ' ' + pad(hour) + ':' + pad(minute),
      refreshText: '刚刚根据本机状态刷新',
      liveSignals,
      alerts
    })
  },

  requestLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        const nearest = cityRules.slice().sort((a, b) => distance(res, a) - distance(res, b))[0]
        this.setData({
          locationLabel: nearest.name + '附近',
          locationDetail: '纬度 ' + res.latitude.toFixed(2) + '，经度 ' + res.longitude.toFixed(2),
          locationStatus: '定位已授权',
          cityNote: nearest.note
        }, () => {
          this.refreshRealtime()
        })
      },
      fail: () => {
        this.setData({
          locationLabel: '甘肃默认路线',
          locationDetail: '未授权定位，已启用通用安全评估。',
          locationStatus: '通用方案',
          cityNote: '未读取定位时，按甘肃热门线路通用风险进行提醒：防晒、补水、返程、证件优先。'
        }, () => {
          this.refreshRealtime()
        })
      }
    })
  },

  toggleCheck(e) {
    const id = e.currentTarget.dataset.id
    const checks = decorateChecks(this.data.checks.map(item => ({
      ...item,
      done: item.id === id ? !item.done : item.done
    })))
    this.setData({ checks }, () => {
      this.refreshRealtime()
    })
  },

  callContact(e) {
    const phoneNumber = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber,
      fail: () => {
        wx.showToast({ title: '已保留号码', icon: 'none' })
      }
    })
  },

  manualRefresh() {
    this.refreshRealtime()
    wx.showToast({ title: '已刷新', icon: 'success' })
  },

  goBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack()
      return
    }
    wx.reLaunch({ url: '/pages/touring/touring' })
  }
})
