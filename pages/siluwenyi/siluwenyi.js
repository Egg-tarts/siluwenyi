const aiButlerClient = require('../../utils/aiButlerClient')
const routeStore = require('../../utils/routeStore')

const preferenceOptions = [
  { label: '博物馆/艺术馆', value: '博物馆/艺术馆' },
  { label: '人文景观', value: '人文景观' },
  { label: '自然景观', value: '自然景观' },
  { label: '特色美食', value: '特色美食' },
  { label: '石窟壁画', value: '石窟壁画' },
  { label: '亲子研学', value: '亲子研学' }
]

const transportOptions = [
  { label: '高铁', value: '高铁' },
  { label: '火车', value: '火车' },
  { label: '自驾/包车', value: '自驾/包车' },
  { label: '公交', value: '公交' },
  { label: '步行', value: '步行' },
  { label: '飞机', value: '飞机' }
]

const dayOptions = ['一天', '两天', '三天', '四天', '五天', '六天', '七天', '八天']
const budgetOptions = ['低', '中', '高'].map(value => ({ value, active: false }))
const dayOptionValues = ['一天', '两天', '三天', '四天', '五天', '六天', '七天', '八天']
const dayCountMap = {
  '一天': 1,
  '两天': 2,
  '三天': 3,
  '四天': 4,
  '五天': 5,
  '六天': 6,
  '七天': 7,
  '八天': 8
}

function withChoiceClass(options, selectedValues) {
  return options.map(item => {
    const active = selectedValues.includes(item.value)
    return {
      ...item,
      active,
      className: active ? 'choice choice--active' : 'choice'
    }
  })
}

const stepsIdle = [
  { title: '等待输入标准', desc: '请先填写预算、天数、年龄和偏好。', state: 'active' },
  { title: '理解需求', desc: '点击生成后，系统会整理你的旅行标准。', state: '' },
  { title: '路线返回', desc: '根据你的输入生成一份稳定可用的路线。', state: '' }
]

const stepsGenerating = [
  { title: '校验旅行标准', desc: '正在检查预算、天数、偏好和同行人信息。', state: 'done' },
  { title: 'AI 理解需求', desc: '正在根据你的真实输入生成路线。', state: 'active' },
  { title: '整理路线结果', desc: '正在补齐景点、交通、餐饮和注意事项。', state: '' }
]

const stepsDone = [
  { title: '校验旅行标准', desc: '已按你的输入完成参数校验。', state: 'done' },
  { title: 'AI 理解需求', desc: 'AI 已完成本次路线规划。', state: 'done' },
  { title: '整理路线结果', desc: '路线已生成，可在下方查看完整报告。', state: 'done' }
]

const stepsLocalDone = [
  { title: '校验旅行标准', desc: '已按你的输入完成参数校验。', state: 'done' },
  { title: 'AI 理解需求', desc: '已完成路线生成准备。', state: 'done' },
  { title: '整理路线结果', desc: '路线已生成，可在下方查看完整报告。', state: 'done' }
]

const localCityPlans = [
  {
    city: '兰州',
    attraction: '甘肃省博物馆、黄河风情线',
    coordinate: '36.0672° N, 103.7489° E',
    restaurant: '马子禄牛肉面 / 正宁路小吃夜市',
    food: '兰州牛肉面、灰豆子',
    note: '适合旅程首日落地缓冲，先建立甘肃文博背景，晚上沿黄河慢走。'
  },
  {
    city: '武威',
    attraction: '武威雷台汉墓、鸠摩罗什寺',
    coordinate: '37.9282° N, 102.6380° E',
    restaurant: '武威三套车老店',
    food: '武威三套车',
    note: '适合作为河西走廊中段停靠点，节奏比直接长距离拉车更舒服。'
  },
  {
    city: '张掖',
    attraction: '张掖七彩丹霞、张掖大佛寺',
    coordinate: '38.9473° N, 100.0641° E',
    restaurant: '甘州特色小吃街',
    food: '搓鱼子',
    note: '建议把观景时间放在日落前，色彩层次更好。'
  },
  {
    city: '嘉峪关',
    attraction: '嘉峪关关城、悬壁长城',
    coordinate: '39.8026° N, 98.2160° E',
    restaurant: '大唐美食街',
    food: '烤羊肉',
    note: '关城和戈壁风大，建议准备外套。'
  },
  {
    city: '敦煌',
    attraction: '莫高窟、鸣沙山月牙泉',
    coordinate: '40.0372° N, 94.8092° E',
    restaurant: '沙洲夜市',
    food: '驴肉黄面',
    note: '莫高窟需提前预约，鸣沙山适合傍晚安排。'
  },
  {
    city: '天水',
    attraction: '麦积山石窟、伏羲庙',
    coordinate: '34.3539° N, 106.0038° E',
    restaurant: '伏羲城小吃街',
    food: '天水呱呱',
    note: '台阶较多，适合轻装慢行。'
  },
  {
    city: '定西',
    attraction: '陇西李家龙宫、渭河源片区',
    coordinate: '35.5806° N, 104.6263° E',
    restaurant: '定西洋芋风味馆',
    food: '定西宽粉、洋芋搅团',
    note: '适合连接兰州与天水，作为东线过渡日。'
  },
  {
    city: '平凉',
    attraction: '崆峒山',
    coordinate: '35.5428° N, 106.6653° E',
    restaurant: '平凉暖锅店',
    food: '平凉暖锅',
    note: '山地游览建议穿防滑鞋，老人儿童可选择索道减轻体力压力。'
  },
  {
    city: '庆阳',
    attraction: '周祖陵、庆阳民俗馆',
    coordinate: '35.7098° N, 107.6429° E',
    restaurant: '庆阳臊子面馆',
    food: '庆阳臊子面',
    note: '适合补充陇东民俗与农耕文化内容，不建议和河西线强行同日拼接。'
  },
  {
    city: '白银',
    attraction: '黄河石林',
    coordinate: '36.5448° N, 104.1377° E',
    restaurant: '景泰黄河鱼庄',
    food: '黄河鱼、臊子面',
    note: '峡谷地貌日照强，建议避开正午长时间暴晒。'
  },
  {
    city: '金昌',
    attraction: '金川国家矿山公园、紫金花城',
    coordinate: '38.5214° N, 102.1880° E',
    restaurant: '金昌羊肉馆',
    food: '羊肉垫卷子',
    note: '适合与武威、张掖串联，不建议单独绕行太久。'
  },
  {
    city: '酒泉',
    attraction: '酒泉鼓楼、酒泉卫星发射中心研学点',
    coordinate: '39.7328° N, 98.4939° E',
    restaurant: '酒泉糊锅店',
    food: '酒泉糊锅',
    note: '适合放在嘉峪关与敦煌之间，作为轻量补给和研学停靠。'
  },
  {
    city: '陇南',
    attraction: '官鹅沟、万象洞',
    coordinate: '33.4007° N, 104.9217° E',
    restaurant: '陇南洋芋搅团店',
    food: '洋芋搅团',
    note: '山水线和河西走廊距离较远，适合单独做南线深度游。'
  }
]

const localCityMap = localCityPlans.reduce((map, item) => {
  map[item.city] = item
  return map
}, {})
const gansuCityNames = localCityPlans.map(item => item.city)
const localRouteCorridors = [
  {
    keywords: ['敦煌', '莫高窟', '鸣沙山', '河西', '嘉峪关', '酒泉', '张掖', '丹霞', '武威'],
    cities: ['兰州', '武威', '张掖', '嘉峪关', '酒泉', '敦煌']
  },
  {
    keywords: ['天水', '麦积山', '伏羲', '平凉', '崆峒', '庆阳', '陇东'],
    cities: ['兰州', '定西', '天水', '平凉', '庆阳']
  },
  {
    keywords: ['陇南', '官鹅沟', '万象洞', '南线'],
    cities: ['兰州', '定西', '天水', '陇南']
  },
  {
    keywords: ['白银', '黄河石林', '金昌', '紫金花城'],
    cities: ['兰州', '白银', '武威', '金昌', '张掖']
  }
]

Page({
  data: {
    preferenceOptions: withChoiceClass(preferenceOptions, []),
    transportOptions: withChoiceClass(transportOptions, []),
    dayOptions: dayOptionValues.map(value => ({ value, active: false, className: 'choice' })),
    budgetOptions: withChoiceClass(budgetOptions, []),
    form: {
      useHistory: false,
      budget: '',
      days: '',
      ages: '',
      startCity: '',
      destination: '',
      note: ''
    },
    selectedPrefs: [],
    selectedTransports: [],
    generationSteps: stepsIdle,
    isGenerating: false,
    hasResult: false,
    resultText: '',
    displayReport: {
      title: '丝路问驿路线报告',
      chips: [],
      days: [],
      tips: []
    },
    tripInfo: {
      title: '丝路行程单',
      subtitle: '生成路线后整理城市推进、交通、门票与路径',
      dayTabs: [],
      activeDayIndex: 0,
      activeDay: null,
      summaryCards: []
    },
    resultSummary: '尚未生成',
    statusMark: '待',
    statusText: '输入中',
    submitText: '根据以上标准生成',
    submitClass: 'submit-button',
    errorText: ''
  },

  goBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack()
      return
    }
    wx.reLaunch({ url: '/pages/touring/touring' })
  },

  toggleHistory(e) {
    this.setData({
      'form.useHistory': e.detail.value.length > 0
    })
  },

  chooseBudget(e) {
    const budget = e.detail.value
    this.setData({
      'form.budget': budget,
      budgetOptions: withChoiceClass(budgetOptions, [budget])
    })
  },

  chooseDays(e) {
    const days = e.detail.value
    this.setData({
      'form.days': days,
      dayOptions: dayOptionValues.map(value => ({
        value,
        active: value === days,
        className: value === days ? 'choice choice--active' : 'choice'
      }))
    })
  },

  onFieldInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({
      [`form.${field}`]: e.detail.value
    })
  },

  onPreferenceChange(e) {
    const selectedPrefs = e.detail.value
    this.setData({
      selectedPrefs,
      preferenceOptions: withChoiceClass(preferenceOptions, selectedPrefs)
    })
  },

  onTransportChange(e) {
    const selectedTransports = e.detail.value
    this.setData({
      selectedTransports,
      transportOptions: withChoiceClass(transportOptions, selectedTransports)
    })
  },

  validateForm() {
    const { form, selectedPrefs } = this.data

    if (!form.budget) return '请选择整体预算'
    if (!form.days) return '请选择出行天数'
    if (!form.ages.trim()) return '请填写成员年龄'
    if (!selectedPrefs.length) return '请至少选择一个景点偏好'
    return ''
  },

  buildPrompt() {
    const { form, selectedPrefs, selectedTransports } = this.data
    const transports = selectedTransports.length ? selectedTransports.join('、') : '不限'
    const startCity = form.startCity.trim() || '未指定'
    const destination = form.destination.trim() || '甘肃省内'
    const note = form.note.trim() || '无额外要求'

    return [
      `根据之前的行程进行推荐: ${form.useHistory ? '是' : '否'}`,
      `出发地: ${startCity}`,
      `目的地/范围: ${destination}`,
      `我要去游玩的天数是: ${form.days}`,
      `我偏好的旅游整体预算是: ${form.budget}`,
      `我偏好的交通方式是: ${transports}`,
      `我喜欢以下类型的景点: ${selectedPrefs.join('、')}`,
      `出行人员的年龄有: ${form.ages.trim()}`,
      `额外要求: ${note}`,
      '请严格根据以上真实输入生成路线。',
      '必须严格按照我选择的出行天数输出，不要擅自增加天数。',
      '如果是两天及以上，必须做成真实旅行路线推进：每天至少有城市或片区变化，优先按兰州-武威-张掖-嘉峪关-敦煌、兰州-定西-天水-平凉、兰州-白银-武威-张掖等合理交通走廊安排。',
      '如果用户只输入某一个城市或景点，不要把“这个城市有什么”拆成好几天重复游玩；应围绕该目的地自动补充邻近城市或上下游节点，形成可出行的多日线路。',
      '除非用户明确要求深度慢游同一城市，否则三天及以上不要每天都停留在同一个城市；每一天都要写清楚“当日城市/片区”和“从上一站如何抵达”。',
      '每天都要包含：景点名称、经纬度、推荐游玩时间、交通方式、餐馆推荐、价格参考、注意事项。',
      '输出要像导游朋友在对话中给我方案，不要使用 Markdown，不要使用 ** 加粗，不要使用表格。',
      '为了方便地图页提取，请保留“第1天、景点名称、经纬度、餐馆推荐、注意事项”这些文字。'
    ].join('，')
  },

  generateRoute() {
    if (this.data.isGenerating) return

    if (!this.ensureLoggedInForRoute()) return

    const errorText = this.validateForm()
    if (errorText) {
      this.setData({ errorText })
      wx.showToast({ title: errorText, icon: 'none' })
      return
    }

    this.setData({
      isGenerating: true,
      hasResult: false,
      resultText: '',
      displayReport: {
        title: '丝路问驿路线报告',
        chips: [],
        days: [],
        tips: []
      },
      tripInfo: {
        title: '丝路行程单',
        subtitle: '生成路线后整理城市推进、交通、门票与路径',
        dayTabs: [],
        activeDayIndex: 0,
        activeDay: null,
        summaryCards: []
      },
      resultSummary: '正在生成',
      statusMark: '…',
      statusText: '生成中',
      submitText: 'AI 正在生成路线',
      submitClass: 'submit-button submit-button--loading',
      errorText: '',
      generationSteps: stepsGenerating
    })

    this.requestAIRoute()
  },

  ensureLoggedInForRoute() {
    const profile = wx.getStorageSync('profileUser') || {}
    if (profile.loggedIn) return true

    const loginUrl = '/pages/profileLogin/profileLogin?mode=guestRequired&redirect=' + encodeURIComponent('/pages/siluwenyi/siluwenyi')
    wx.showToast({ title: '请先进行游客登录', icon: 'none' })
    setTimeout(() => {
      wx.navigateTo({
        url: loginUrl,
        fail: () => wx.redirectTo({ url: loginUrl })
      })
    }, 420)
    return false
  },

  requestAIRoute() {
    const question = this.buildPrompt()
    const { form, selectedPrefs, selectedTransports } = this.data

    aiButlerClient.askAiButler({
      question,
      history: [],
      context: {
        city: form.destination.trim() || form.startCity.trim() || '甘肃',
        cityDesc: [
          `出发地: ${form.startCity.trim() || '未指定'}`,
          `目的地/范围: ${form.destination.trim() || '甘肃省内'}`,
          `天数: ${form.days}`,
          `预算: ${form.budget}`,
          `成员年龄: ${form.ages.trim()}`,
          `偏好: ${selectedPrefs.join('、')}`,
          `交通: ${selectedTransports.length ? selectedTransports.join('、') : '不限'}`
        ].join('；')
      }
    }).then(answer => {
      this.useAIRoute(answer)
    }).catch(error => {
      console.warn('Route AI request failed:', error && (error.code || error.message), error && error.statusCode, error && error.responseData)
      this.useLocalRoute(this.getRouteFallbackReason(error))
    })
  },

  useAIRoute(answer) {
    const routeText = this.cleanRouteText(answer)
    if (!this.isReasonableMultiDayRoute(routeText)) {
      this.useLocalRoute('AI路线缺少城市推进，已自动重排为可出行线路')
      return
    }

    const report = this.buildDisplayReport(routeText)
    const app = getApp()
    app.globalData.answer = routeText
    this.saveGeneratedRoute(routeText, '路线记录')

    this.setData({
      isGenerating: false,
      hasResult: true,
      resultText: routeText,
      displayReport: report,
      tripInfo: report.tripInfo,
      resultSummary: report.title,
      statusMark: '✓',
      statusText: '已生成',
      submitText: '根据以上标准重新生成',
      submitClass: 'submit-button',
      errorText: '',
      generationSteps: stepsDone
    })

    wx.showToast({
      title: '路线已生成',
      icon: 'success'
    })
  },

  useLocalRoute(reason) {
    const answer = this.buildLocalAnswer(reason)
    const report = this.buildDisplayReport(answer)
    const app = getApp()
    app.globalData.answer = answer
    this.saveGeneratedRoute(answer, '路线记录')

    this.setData({
      isGenerating: false,
      hasResult: true,
      resultText: answer,
      displayReport: report,
      tripInfo: report.tripInfo,
      resultSummary: report.title,
      statusMark: '✓',
      statusText: '已生成',
      submitText: '根据以上标准重新生成',
      submitClass: 'submit-button',
      errorText: '',
      generationSteps: stepsLocalDone
    })

    wx.showToast({
      title: '路线已生成',
      icon: 'success'
    })
  },

  getRouteFallbackReason(error) {
    if (error && error.code === 'AI_BUTLER_NETWORK_FAILED') {
      return '智能服务暂未连上，已用备用路线生成'
    }

    if (error && error.statusCode) {
      return `AI 返回异常 ${error.statusCode}，已用备用路线生成`
    }

    if (error && error.code === 'AI_BUTLER_NOT_CONFIGURED') {
      return 'AI 服务尚未配置，已用备用路线生成'
    }

    return 'AI 暂时未响应，已用备用路线生成'
  },

  cleanRouteText(text) {
    return String(text || '')
      .replace(/\*\*/g, '')
      .replace(/#{1,6}\s?/g, '')
      .replace(/`{1,3}/g, '')
      .replace(/^\s*[-*]\s+/gm, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  },

  buildDisplayReport(answer) {
    const { form, selectedPrefs, selectedTransports } = this.data
    const cleanText = this.hideCoordinates(answer)
    const dayBlocks = this.splitDayBlocks(cleanText)
    const chips = [
      form.days || '未选天数',
      `${form.budget || '未选'}预算`,
      selectedTransports.length ? selectedTransports.join(' / ') : '交通不限',
      selectedPrefs.length ? selectedPrefs.slice(0, 2).join(' / ') : '综合偏好'
    ]
    const parsedDays = dayBlocks.map((block, index) => this.parseDayBlock(block, index))
    const days = parsedDays.length ? parsedDays : [this.parseDayBlock(cleanText, 0)]
    const tips = this.extractGlobalTips(cleanText)

    return {
      title: `${form.startCity.trim() || '甘肃'}到${form.destination.trim() || '目的地'} · ${form.days || '路线'}方案`,
      chips,
      days,
      tips,
      tripInfo: this.buildTripInfo(days, chips)
    }
  },

  buildTripInfo(days, chips) {
    const dayList = (days || []).map((day, index) => this.buildTripDay(day, index))
    const activeDay = dayList[0] || null
    const dayCount = dayList.length
    const scenicCount = dayList.reduce((sum, day) => sum + day.timeline.length, 0)
    const firstCity = this.extractCityLabel(dayList)

    return {
      title: '丝路行程单',
      subtitle: '按天查看城市推进、游览节点、交通票务与出行提醒',
      dayTabs: dayList.map((day, index) => ({
        index,
        label: day.dayShort,
        title: day.routeTitle,
        className: index === 0 ? 'trip-day-tab trip-day-tab--active' : 'trip-day-tab'
      })),
      activeDayIndex: 0,
      activeDay,
      summaryCards: [
        { label: '行程天数', value: dayCount + '天' },
        { label: '路径节点', value: scenicCount + '处' },
        { label: '主要范围', value: firstCity }
      ],
      chips
    }
  },

  buildTripDay(day, index) {
    const scenicList = this.splitScenicList(day.scenic)
    const firstScenic = scenicList[0] || day.scenic || '丝路文旅体验'
    const timeline = scenicList.map((name, nodeIndex) => this.buildTripNode(name, day, nodeIndex, scenicList.length))
    const dayShort = '第' + (index + 1) + '天'

    return {
      ...day,
      dayShort,
      routeTitle: day.routeTitle || firstScenic,
      ticketText: this.extractTicketText(day.budget),
      transportText: day.traffic || '结合所选交通方式',
      transportBrief: this.compactByLength(day.traffic || '结合所选交通方式', 32),
      ticketBrief: this.compactByLength(this.extractTicketText(day.budget), 28),
      timeline: timeline.length ? timeline : [this.buildTripNode(firstScenic, day, 0, 1)],
      mealCards: this.buildMealCards(day.food),
      noticeList: this.buildNoticeList(day.note),
      mapSummary: this.compactText(`${dayShort} · ${firstScenic} · ${day.time || '按当日节奏安排'}`)
    }
  },

  extractCityLabel(dayList) {
    const source = (dayList || [])
      .map(day => [day.routeTitle, day.scenic, day.mapSummary].join(' '))
      .join(' ')
    const cities = ['兰州', '敦煌', '张掖', '嘉峪关', '酒泉', '武威', '天水', '平凉', '庆阳', '定西', '白银', '陇南', '金昌']
    const city = cities.find(item => source.indexOf(item) > -1)
    return city || '甘肃'
  },

  splitScenicList(text) {
    const value = this.compactText(text || '')
    if (!value) return []

    return value
      .split(/[、，,\/→\-]+/)
      .map(item => item.replace(/^(景点|目的地|路线)[:：]?/, '').trim())
      .filter(Boolean)
      .slice(0, 5)
  },

  buildTripNode(name, day, index, total) {
    const traffic = index === 0 ? '从出发点前往' : '继续前往下一站'
    const timeParts = String(day.time || '').split(/[\/,，、]/).map(item => item.trim()).filter(Boolean)
    const time = timeParts[index] || timeParts[0] || (index === 0 ? '上午' : '顺路安排')
    const distance = total > 1
      ? (index === total - 1 ? '当日收尾' : '约30-60分钟衔接')
      : '当日核心游览'

    return {
      name: this.compactText(name),
      time,
      traffic,
      distance,
      ticket: this.extractTicketText(day.budget),
      className: index === total - 1 ? 'timeline-node timeline-node--last' : 'timeline-node'
    }
  },

  extractTicketText(text) {
    const value = this.compactText(text || '')
    if (!value || value === '以现场与官方信息为准') return '门票以官方发布为准'
    return value
  },

  buildMealCards(text) {
    const value = this.compactText(text || '')
    const parts = value
      .split(/\d+[.、]\s*/)
      .map(item => item.trim())
      .filter(Boolean)

    const source = parts.length ? parts : [value || '沿途选择当地特色餐食']
    return source.slice(0, 2).map((item, index) => ({
      title: index === 0 ? '推荐餐馆' : '备选餐馆',
      text: item
    }))
  },

  buildNoticeList(text) {
    const value = this.compactText(text || '')
    const list = value
      .split(/[；;。]/)
      .map(item => item.trim())
      .filter(Boolean)

    return (list.length ? list : ['出发前确认开放时间、预约与交通班次']).slice(0, 3)
  },

  chooseTripDay(e) {
    const index = Number(e.currentTarget.dataset.index || 0)
    const days = (this.data.displayReport && this.data.displayReport.days) || []
    const tripInfo = this.data.tripInfo || {}
    const dayTabs = (tripInfo.dayTabs || []).map(item => ({
      ...item,
      className: item.index === index ? 'trip-day-tab trip-day-tab--active' : 'trip-day-tab'
    }))

    this.setData({
      'tripInfo.activeDayIndex': index,
      'tripInfo.activeDay': days.map((day, dayIndex) => this.buildTripDay(day, dayIndex))[index] || tripInfo.activeDay,
      'tripInfo.dayTabs': dayTabs
    })
  },

  hideCoordinates(text) {
    return String(text || '')
      .replace(/经纬度[：:]\s*\d{1,3}\.\d+\s*[,，]\s*\d{1,3}\.\d+/g, '')
      .replace(/经纬度[：:]\s*\d{1,3}\.\d+\s?°\s?[NS],\s*\d{1,3}\.\d+\s?°\s?[EW]/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  },

  splitDayBlocks(text) {
    const lines = String(text || '').split('\n')
    const blocks = []
    let current = []

    lines.forEach(line => {
      const trimmed = line.trim()
      if (/^第[一二三四五六七八九十\d]+天/.test(trimmed) && current.length) {
        blocks.push(current.join('\n'))
        current = [trimmed]
        return
      }

      if (trimmed) current.push(trimmed)
    })

    if (current.length) blocks.push(current.join('\n'))
    return blocks.filter(block => /第[一二三四五六七八九十\d]+天/.test(block))
  },

  parseDayBlock(block, index) {
    const titleMatch = block.match(/第[一二三四五六七八九十\d]+天[：:\s]*(.*)?/)
    const cityMatch = block.match(/当日城市\/片区[：:]\s*([^\n]+)/)
    const scenicMatch = block.match(/景点名称[：:]\s*([^\n]+)/)
    const timeMatch = block.match(/推荐游玩时间[：:]\s*([^\n]+)/)
    const trafficMatch = block.match(/交通方式[：:]\s*([^\n]+)/)
    const foodMatch = block.match(/餐馆推荐[：:]?\s*([\s\S]*?)(?=\n(?:价格参考|注意事项|第[一二三四五六七八九十\d]+天)|$)/)
    const budgetMatch = block.match(/价格参考[：:]\s*([^\n]+)/)
    const noteMatch = block.match(/注意事项[：:]\s*([\s\S]*)/)

    return {
      dayTitle: titleMatch ? titleMatch[0].replace(/[：:]\s*$/, '') : `第${index + 1}天`,
      routeTitle: titleMatch && titleMatch[1] ? titleMatch[1].trim() : (cityMatch ? cityMatch[1].trim() : (scenicMatch ? scenicMatch[1].trim() : '丝路行程')),
      scenic: scenicMatch ? scenicMatch[1].trim() : this.pickFirstMeaningfulLine(block),
      time: timeMatch ? timeMatch[1].trim() : '按当日节奏安排',
      traffic: trafficMatch ? trafficMatch[1].trim() : '结合所选交通方式',
      food: foodMatch ? this.compactText(foodMatch[1]) : '沿途选择当地特色餐食',
      budget: budgetMatch ? budgetMatch[1].trim() : '以现场与官方信息为准',
      note: noteMatch ? this.compactText(noteMatch[1]) : '出发前再次确认开放时间、预约与交通班次。',
      raw: this.compactText(block)
    }
  },

  pickFirstMeaningfulLine(text) {
    const line = String(text || '').split('\n').find(item => item.trim() && !/^第[一二三四五六七八九十\d]+天/.test(item.trim()))
    return line ? this.compactText(line) : '丝路文旅体验'
  },

  compactText(text) {
    return String(text || '')
      .replace(/经纬度[：:][^\n]+/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  },

  compactByLength(text, limit) {
    const value = this.compactText(text)
    return value.length > limit ? value.slice(0, limit) + '...' : value
  },

  extractGlobalTips(text) {
    const tips = []
    const source = String(text || '')

    if (source.includes('预约')) tips.push('热门景点建议提前预约，临近出发再核对开放安排。')
    if (source.includes('防晒') || source.includes('干燥')) tips.push('河西走廊日照强、气候干燥，防晒和补水要提前准备。')
    if (source.includes('官方')) tips.push('票价、班次和开放时间以官方最新发布为准。')

    return tips.length ? tips.slice(0, 3) : ['出发前确认天气、交通和景区开放安排。']
  },

  buildLocalAnswer(reason) {
    const { form, selectedPrefs, selectedTransports } = this.data
    const dayCount = this.getSelectedDayCount()
    const destination = form.destination.trim()
    const plans = this.buildLocalRoutePlans(dayCount, destination, form.startCity.trim())
    const transports = selectedTransports.length ? selectedTransports.join('、') : '高铁/包车/步行结合'
    const prefs = selectedPrefs.length ? selectedPrefs.join('、') : '综合体验'
    const startCity = form.startCity.trim() || '兰州'
    const note = form.note.trim() || '节奏适中，保留休息时间'

    const lines = [
      `丝路问驿路线方案（${form.days}）`,
      `生成说明: ${reason}`,
      `出发地: ${startCity}`,
      `目的地/范围: ${destination || '甘肃省内'}`,
      `预算: ${form.budget}`,
      `成员年龄: ${form.ages.trim()}`,
      `偏好: ${prefs}`,
      `交通方式: ${transports}`,
      `额外要求: ${note}`,
      ''
    ]

    for (let i = 0; i < dayCount; i += 1) {
      const plan = plans[i]
      const prevPlan = plans[i - 1]
      const transferText = this.buildTransferText(prevPlan, plan, transports, i)
      lines.push(`第${i + 1}天`)
      lines.push(`当日城市/片区: ${plan.city}`)
      lines.push(`景点名称: ${plan.attraction}`)
      lines.push(`经纬度: ${plan.coordinate}`)
      lines.push(`推荐游玩时间: 09:30-12:00 / 15:30-18:00`)
      lines.push(`交通方式: ${transferText}`)
      lines.push(`餐馆推荐:`)
      lines.push(`1. ${plan.restaurant} 地址：${plan.city}核心游览区附近，价格参考：人均30-80元，推荐：${plan.food}`)
      lines.push(`价格参考: 门票、讲解与区间交通以官方最新发布为准，餐饮人均约30-80元。`)
      lines.push(`注意事项: ${plan.note}`)
      lines.push('')
    }

    return lines.join('\n')
  },

  getSelectedDayCount() {
    return dayCountMap[this.data.form.days] || 3
  },

  buildLocalRoutePlans(dayCount, destination, startCity) {
    const text = `${destination || ''}${startCity || ''}`
    const matchedCorridor = localRouteCorridors.find(corridor => {
      return corridor.keywords.some(keyword => text.indexOf(keyword) > -1)
    }) || localRouteCorridors[0]
    let cities = matchedCorridor.cities.slice()
    const normalizedStart = gansuCityNames.find(city => startCity && startCity.indexOf(city) > -1)
    const normalizedDestination = gansuCityNames.find(city => destination && destination.indexOf(city) > -1)

    if (normalizedStart && cities.indexOf(normalizedStart) === -1) {
      cities.unshift(normalizedStart)
    }

    if (normalizedDestination) {
      if (cities.indexOf(normalizedDestination) === -1) cities.push(normalizedDestination)
      cities = this.reorderRouteAroundDestination(cities, normalizedStart, normalizedDestination)
    }

    cities = this.uniqueList(cities)
    cities = this.selectRouteCities(cities, dayCount, normalizedDestination)

    while (cities.length < dayCount) {
      const nextCity = gansuCityNames.find(city => cities.indexOf(city) === -1) || cities[cities.length - 1] || '兰州'
      cities.push(nextCity)
    }

    return cities.slice(0, dayCount).map(city => localCityMap[city] || localCityPlans[0])
  },

  selectRouteCities(cities, dayCount, destinationCity) {
    const route = (cities && cities.length ? cities : ['兰州']).slice()

    if (dayCount <= 1) return [destinationCity || route[0] || '兰州']
    if (!destinationCity || route.indexOf(destinationCity) === -1) return route.slice(0, dayCount)

    const destinationIndex = route.indexOf(destinationCity)
    const mainRoute = route.slice(0, destinationIndex + 1)
    if (mainRoute.length <= dayCount) return mainRoute

    const selected = []
    for (let index = 0; index < dayCount; index += 1) {
      const sourceIndex = Math.round(index * (mainRoute.length - 1) / (dayCount - 1))
      selected.push(mainRoute[sourceIndex])
    }

    return this.uniqueList(selected).length === dayCount
      ? selected
      : this.completeRouteSelection(selected, mainRoute, dayCount, destinationCity)
  },

  completeRouteSelection(selected, mainRoute, dayCount, destinationCity) {
    const result = this.uniqueList(selected)

    if (result.indexOf(destinationCity) === -1) {
      result[result.length - 1] = destinationCity
    }

    for (let index = mainRoute.length - 2; result.length < dayCount && index > 0; index -= 1) {
      if (result.indexOf(mainRoute[index]) === -1) result.splice(result.length - 1, 0, mainRoute[index])
    }

    return result.slice(0, dayCount)
  },

  reorderRouteAroundDestination(cities, startCity, destinationCity) {
    if (!destinationCity || cities.indexOf(destinationCity) === -1) return cities

    const endIndex = cities.indexOf(destinationCity)
    let route = cities.slice(0, endIndex + 1)

    if (startCity && route.indexOf(startCity) > -1) {
      route = route.slice(route.indexOf(startCity))
    }

    if (route.length < cities.length) {
      route = route.concat(cities.slice(endIndex + 1))
    }

    return route
  },

  uniqueList(list) {
    const seen = {}
    return (list || []).filter(item => {
      if (!item || seen[item]) return false
      seen[item] = true
      return true
    })
  },

  buildTransferText(prevPlan, plan, transports, index) {
    if (!plan) return transports
    if (index === 0 || !prevPlan) {
      return `从出发地抵达${plan.city}，市内以公交/打车/步行为主；偏好交通：${transports}`
    }
    return `从${prevPlan.city}前往${plan.city}，优先选择高铁、动车或包车衔接，抵达后市内短途游览；偏好交通：${transports}`
  },

  isReasonableMultiDayRoute(routeText) {
    const dayCount = this.getSelectedDayCount()
    if (dayCount <= 2) return true

    const text = String(routeText || '')
    const cityHits = gansuCityNames.filter(city => text.indexOf(city) > -1)
    const uniqueCities = this.uniqueList(cityHits)

    if (uniqueCities.length >= 2) return true

    const dayBlocks = this.splitDayBlocks(this.hideCoordinates(text))
    if (dayBlocks.length < dayCount) return false

    const destinations = dayBlocks.map(block => {
      return this.extractFieldFromText(block, '景点名称') || this.pickFirstMeaningfulLine(block)
    }).filter(Boolean)

    return this.uniqueList(destinations).length >= Math.min(2, dayCount)
  },

  extractFieldFromText(text, label) {
    const match = String(text || '').match(new RegExp(label + '[：:]\\s*([^\\n]+)'))
    return match && match[1] ? this.compactText(match[1]) : ''
  },

  saveGeneratedRoute(answer, source) {
    const profile = wx.getStorageSync('profileUser') || {}
    const route = {
      id: `local-${Date.now()}`,
      answer,
      source,
      author: {
        username: profile.nickName || source,
        avatar: profile.avatarUrl || ''
      },
      ownerId: profile.openid || profile.unionid || profile.userId || profile.phone || '',
      created_at: this.formatNow()
    }
    const saved = routeStore.saveRoute(route)
    if (!saved || !saved.saved) {
      wx.showToast({ title: '请先进行游客登录', icon: 'none' })
    }
  },

  formatNow() {
    const now = new Date()
    const pad = value => (value < 10 ? '0' + value : String(value))
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
  },

  handleGenerateFail(message) {
    this.setData({
      isGenerating: false,
      hasResult: false,
      resultSummary: '生成失败',
      statusMark: '!',
      statusText: '失败',
      submitText: '重新生成路线',
      submitClass: 'submit-button',
      errorText: message,
      generationSteps: [
        { title: '校验旅行标准', desc: '输入已校验通过。', state: 'done' },
        { title: 'AI 理解需求', desc: message, state: 'error' },
        { title: '路线返回', desc: '请重新生成一次。', state: '' }
      ]
    })

    wx.showToast({
      title: message,
      icon: 'none'
    })
  },

  extractSummary(answer) {
    const firstLine = String(answer).split('\n').find(line => line.trim())
    return firstLine ? firstLine.replace(/^#+\s*/, '').slice(0, 36) : '路线已生成'
  },

  goMap() {
    if (!this.data.hasResult) {
      wx.showToast({ title: '请先生成路线', icon: 'none' })
      return
    }

    const routeText = this.data.resultText || ''
    const app = getApp()
    app.globalData.answer = routeText
    wx.setStorageSync('currentRouteAnswer', routeText)

    wx.navigateTo({
      url: '/pages/map/map'
    })
  },

  copyResult() {
    if (!this.data.hasResult) {
      wx.showToast({ title: '暂无可复制内容', icon: 'none' })
      return
    }

    wx.setClipboardData({
      data: this.buildCopyReport()
    })
  },

  buildCopyReport() {
    const report = this.data.displayReport || {}
    const lines = [report.title || '丝路问驿路线报告', '']

    ;(report.days || []).forEach(day => {
      lines.push(day.dayTitle)
      lines.push(`景点: ${day.scenic}`)
      lines.push(`时间: ${day.time}`)
      lines.push(`交通: ${day.traffic}`)
      lines.push(`餐馆推荐: ${day.food}`)
      lines.push(`预算参考: ${day.budget}`)
      lines.push(`注意事项: ${day.note}`)
      lines.push('')
    })

    if (report.tips && report.tips.length) {
      lines.push('出行提醒')
      report.tips.forEach(item => lines.push(item))
    }

    return lines.join('\n').trim()
  }
})
