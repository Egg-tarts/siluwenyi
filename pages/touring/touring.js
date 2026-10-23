const aiButlerClient = require('../../utils/aiButlerClient')

const CENTER_INDEX = 3
const IMPORTANT_MENU_IDS = ['siluwenyi', 'fengxingwanli', 'tuolingyuxiang']

const baseTourMenus = [
  {
    id: 'yizhanxiejiao',
    title: '驿站歇脚',
    image: 'https://free.picui.cn/free/2026/06/20/6a3574e799105.png',
    url: '/pages/yizhanxiejiao/yizhanxiejiao'
  },
  {
    id: 'yantushijing',
    title: '沿途拾景',
    image: 'https://free.picui.cn/free/2026/06/20/6a3574e7b6566.png',
    url: '/pages/yantushijing/yantushijing'
  },
  {
    id: 'fengxingwanli',
    title: '风行万里',
    image: 'https://free.picui.cn/free/2026/06/21/6a37cda4c37aa.png',
    url: '/pages/fengxingwanli/fengxingwanli'
  },
  {
    id: 'siluwenyi',
    title: '丝路问驿',
    image: 'https://free.picui.cn/free/2026/06/21/6a37cda4ddf3c.png',
    url: '/pages/siluwenyi/siluwenyi'
  },
  {
    id: 'tuolingyuxiang',
    title: '驼铃余响',
    image: 'https://free.picui.cn/free/2026/06/21/6a37cda4d8d53.png',
    url: '/pages/tuolingyuxiang/tuolingyuxiang'
  },
  {
    id: 'longshangxunwei',
    title: '陇上寻味',
    image: 'https://free.picui.cn/free/2026/06/20/6a3574e7b28c3.png',
    url: '/pages/longshangxunwei/longshangxunwei'
  },
  {
    id: 'anxingwuyou',
    title: '安行无忧',
    image: 'https://free.picui.cn/free/2026/06/20/6a3574e7b3af3.png',
    url: '/pages/anxingwuyou/anxingwuyou'
  }
]

function buildTourMenus(activeIndex) {
  return baseTourMenus.map((menu, index) => {
    const isImportant = IMPORTANT_MENU_IDS.indexOf(menu.id) !== -1
    const isActive = index === activeIndex
    const itemClass = ['menu-item']
    const dotClass = ['menu-dot']

    if (isImportant) itemClass.push('menu-item--major')
    if (isActive) {
      itemClass.push('menu-item--active')
      dotClass.push('menu-dot--active')
    }

    return {
      ...menu,
      itemClass: itemClass.join(' '),
      dotClass: dotClass.join(' ')
    }
  })
}

const gansuCities = [
  { name: '兰州', desc: '黄河穿城而过，水车与石窟共同展开陇原序章。', image: 'https://free.picui.cn/free/2026/06/21/6a376637d8919.png' },
  { name: '酒泉', desc: '大漠、绿洲与航天城，共同写下西行的辽阔。', image: 'https://free.picui.cn/free/2026/06/21/6a376637eee0a.png' },
  { name: '敦煌', desc: '鸣沙山月牙泉与莫高窟壁画，在沙海边缘点亮丝路想象。', image: 'https://free.picui.cn/free/2026/06/21/6a376644b3b26.png' },
  { name: '嘉峪关', desc: '关城雄踞戈壁，长城的尽头仍有风声回荡。', image: 'https://free.picui.cn/free/2026/06/21/6a37664492008.png' },
  { name: '定西', desc: '梯田与药香交错，陇中风物安静而坚韧。', image: 'https://free.picui.cn/free/2026/06/21/6a37782948bfa.png' },
  { name: '庆阳', desc: '黄土塬上窑洞星布，农耕文明在纹样里生长。', image: 'https://free.picui.cn/free/2026/06/21/6a3766412689c.png' },
  { name: '天水', desc: '麦积烟雨与伏羲古韵，山水之间留住东方微笑。', image: 'https://free.picui.cn/free/2026/06/21/6a37664115350.png' },
  { name: '张掖', desc: '七彩丹霞铺陈大地，马蹄寺铃声落入山谷。', image: 'https://free.picui.cn/free/2026/06/21/6a376641229b8.png' },
  { name: '白银', desc: '黄河石林与古渡相望，峡谷深处藏着苍茫纹理。', image: 'https://free.picui.cn/free/2026/06/21/6a376641167e5.png' },
  { name: '武威', desc: '铜奔马踏起汉风，凉州古城连着丝路诗意。', image: 'https://free.picui.cn/free/2026/06/21/6a3766409c3b4.png' },
  { name: '平凉', desc: '崆峒山云气舒卷，道源文化在山阶间延伸。', image: 'https://free.picui.cn/free/2026/06/21/6a376637e90df.png' },
  { name: '陇南', desc: '秦巴山水温润，古道、茶香与羌韵在此相逢。', image: 'https://free.picui.cn/free/2026/06/21/6a3778292a9a5.png' },
  { name: '金昌', desc: '花海与矿脉相遇，镍都的工业记忆铺成新的景观。', image: 'https://free.picui.cn/free/2026/06/21/6a376637d6ad3.png' }
].map((city, index) => ({
  ...city,
  index,
  chars: city.name.split('')
}))

const butlerImages = [
  'https://free.picui.cn/free/2026/06/21/6a37bf5acd3f7.png',
  'https://free.picui.cn/free/2026/06/21/6a37bf5acc1e2.png',
  'https://free.picui.cn/free/2026/06/21/6a37bf5ad9f91.png'
]

const butlerSayings = [
  '我在这里，路线、景点、提醒都可以问。',
  '要不要我帮你把甘肃行程理一理？',
  '我会结合城市、时间和偏好给你建议。',
  '出发前，我可以帮你查漏补缺。',
  '丝路小管家上线，随时问我。'
]

const butlerQuickQuestions = [
  { text: '帮我规划路线' },
  { text: '介绍这个景点' },
  { text: '推荐附近玩法' },
  { text: '查看出行提醒' },
  { text: '三天怎么玩' },
  { text: '推荐陇上美食' }
]

const butlerCapabilities = [
  { label: '路线推理', value: '按天数拆分城市顺序' },
  { label: '文博导览', value: '讲清景点故事与看点' },
  { label: '行旅提醒', value: '结合时间给出准备清单' }
]

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function hasAny(text, words) {
  return words.some(word => text.indexOf(word) !== -1)
}

Page({
  data: {
    tourMenus: buildTourMenus(CENTER_INDEX),
    gansuCities,
    activeCity: gansuCities[0],
    activeIndex: CENTER_INDEX,
    cityIndex: 0,
    pageIndex: 0,
    butlerImage: butlerImages[0],
    butlerSaying: butlerSayings[0],
    butlerQuickQuestions,
    butlerCapabilities,
    butlerStatusText: '智能联网问答 · 甘肃文旅专属助手',
    showButlerDialog: false,
    butlerInput: '',
    butlerIsThinking: false,
    butlerScrollIntoView: 'msg-welcome',
    butlerMessages: [
      {
        id: 'msg-welcome',
        roleClass: 'chat-row chat-row--assistant',
        bubbleClass: 'chat-message chat-message--assistant',
        text: '你好，我是丝路小管家。我会先理解你的天数、城市、兴趣和同行人，再给出路线、导览、提醒和美食建议。'
      }
    ]
  },

  onLoad() {
    this.randomizeButler()
  },

  onPageChange(e) {
    const pageIndex = e.detail.current
    this.setData({
      pageIndex
    })

    if (pageIndex === 2 && !this.data.showButlerDialog) {
      this.randomizeButler()
    }
  },

  onMenuChange(e) {
    const activeIndex = e.detail.current
    this.setData({
      activeIndex,
      tourMenus: buildTourMenus(activeIndex)
    })
  },

  onMenuTap(e) {
    const index = Number(e.currentTarget.dataset.index)
    const id = e.currentTarget.dataset.id
    const item = baseTourMenus.find(menu => menu.id === id)

    if (index !== this.data.activeIndex) {
      this.setData({
        activeIndex: index,
        tourMenus: buildTourMenus(index)
      })
      return
    }

    if (item && item.url) {
      this.navigateWithLogin(item.url)
      return
    }

    wx.showToast({
      title: (item ? item.title : '功能') + '即将上线',
      icon: 'none'
    })
  },

  openTravelTranslate() {
    this.navigateWithLogin('/pages/travelTranslate/travelTranslate')
  },

  onCityChange(e) {
    this.setActiveCity(e.detail.current)
  },

  onCityTap(e) {
    this.setActiveCity(Number(e.currentTarget.dataset.index))
  },

  openCityIntro(e) {
    const index = e && e.currentTarget && e.currentTarget.dataset.index !== undefined
      ? Number(e.currentTarget.dataset.index)
      : this.data.cityIndex
    const city = gansuCities[index] || this.data.activeCity || gansuCities[0]

    wx.navigateTo({
      url: `/pages/cityIntro/cityIntro?name=${encodeURIComponent(city.name)}`
    })
  },

  setActiveCity(index) {
    const cityIndex = Math.max(0, Math.min(gansuCities.length - 1, index))
    this.setData({
      cityIndex,
      activeCity: gansuCities[cityIndex]
    })
  },

  randomizeButler() {
    this.setData({
      butlerImage: pickRandom(butlerImages),
      butlerSaying: pickRandom(butlerSayings)
    })
  },

  openButler() {
    if (!this.ensureLoggedIn('/pages/touring/touring')) return
    this.setData({
      showButlerDialog: true
    })
  },

  closeButler() {
    this.setData({
      showButlerDialog: false
    })
    this.randomizeButler()
  },

  noop() {},

  onButlerInput(e) {
    this.setData({
      butlerInput: e.detail.value
    })
  },

  askQuickQuestion(e) {
    this.sendButlerQuestion(e.currentTarget.dataset.question)
  },

  submitButlerInput() {
    this.sendButlerQuestion(this.data.butlerInput)
  },

  sendButlerQuestion(rawQuestion) {
    const question = (rawQuestion || '').trim()

    if (!question) {
      wx.showToast({
        title: '先告诉我你想问什么',
        icon: 'none'
      })
      return
    }

    if (this.data.butlerIsThinking) {
      wx.showToast({
        title: '我正在整理上一条内容',
        icon: 'none'
      })
      return
    }

    const messages = this.data.butlerMessages.slice()
    const userId = 'msg-' + Date.now()
    const thinkingId = userId + '-thinking'

    messages.push({
      id: userId,
      roleClass: 'chat-row chat-row--user',
      bubbleClass: 'chat-message chat-message--user',
      text: question
    })
    messages.push({
      id: thinkingId,
      roleClass: 'chat-row chat-row--assistant',
      bubbleClass: 'chat-message chat-message--assistant chat-message--thinking',
      text: '正在梳理甘肃行旅线索...'
    })

    this.setData({
      butlerInput: '',
      butlerIsThinking: true,
      butlerMessages: messages,
      butlerScrollIntoView: thinkingId
    })

    this.askRemoteButler(question, thinkingId)
  },

  askRemoteButler(question, thinkingId) {
    const history = this.data.butlerMessages
      .filter(item => item.id !== thinkingId)
      .map(item => ({
        role: item.roleClass.indexOf('--user') > -1 ? 'user' : 'assistant',
        text: item.text
      }))
    const context = {
      city: this.data.activeCity && this.data.activeCity.name,
      cityDesc: this.data.activeCity && this.data.activeCity.desc
    }

    aiButlerClient.askAiButler({
      question,
      history,
      context,
      onDelta: (delta, answer) => {
        this.updateThinkingMessage(thinkingId, answer || delta)
      }
    }).then(answer => {
      this.finishButlerAnswer(thinkingId, answer || this.buildButlerAnswer(question), false)
    }).catch(error => {
      console.warn('AI butler request failed:', error && (error.code || error.message), error && error.statusCode, error && error.responseData)

      let title = 'AI暂时未响应'
      let statusText = '基础问答模式 · AI暂时未响应'

      if (error && error.code === 'AI_BUTLER_NOT_CONFIGURED') {
        title = '请先配置AI Key'
        statusText = '基础问答模式 · 请先配置AI Key'
      } else if (error && error.code === 'AI_BUTLER_NETWORK_FAILED') {
        title = '云端AI暂未响应'
        statusText = '基础问答模式 · 云端AI暂未响应'
      } else if (error && error.statusCode) {
        title = 'AI返回异常 ' + error.statusCode
        statusText = '基础问答模式 · AI返回异常 ' + error.statusCode
      }

      if (error && error.code === 'AI_BUTLER_NOT_CONFIGURED') {
        wx.showToast({
          title,
          icon: 'none'
        })
      } else {
        wx.showToast({
          title,
          icon: 'none'
        })
      }

      setTimeout(() => {
        this.finishButlerAnswer(thinkingId, this.buildButlerAnswer(question), true, statusText)
      }, 350)
    })
  },

  updateThinkingMessage(thinkingId, text) {
    const messages = this.data.butlerMessages.map(item => {
      if (item.id !== thinkingId) return item

      return {
        ...item,
        text: text || '正在整理回答...'
      }
    })

    this.setData({
      butlerMessages: messages,
      butlerScrollIntoView: thinkingId
    })
  },

  finishButlerAnswer(thinkingId, answer, usedLocalAnswer, statusText) {
    const replyId = 'msg-' + Date.now() + '-reply'
    const cleanText = this.cleanButlerText(answer)
    const messages = this.data.butlerMessages.map(item => {
      if (item.id !== thinkingId) return item

      return {
        id: replyId,
        roleClass: 'chat-row chat-row--assistant',
        bubbleClass: 'chat-message chat-message--assistant',
        text: cleanText
      }
    })

    this.setData({
      butlerIsThinking: false,
      butlerMessages: messages,
      butlerStatusText: statusText || (usedLocalAnswer ? '基础问答模式 · 可继续咨询甘肃行程' : '智能联网问答 · 已生成个性化建议'),
      butlerScrollIntoView: replyId
    })
  },

  cleanButlerText(text) {
    return String(text || '')
      .replace(/\*\*/g, '')
      .replace(/#{1,6}\s?/g, '')
      .replace(/`{1,3}/g, '')
      .replace(/^\s*[-*]\s+/gm, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  },

  buildButlerAnswer(question) {
    const text = question.toLowerCase()

    if (hasAny(text, ['路线', '规划', '几天', '安排', '怎么玩', '行程', '家人', '石窟', '丹霞'])) {
      return '可以这样排：第1天兰州慢逛黄河风情线和甘肃省博物馆；第2天去张掖看七彩丹霞；第3天向西到嘉峪关，傍晚留给关城和戈壁落日；时间更宽裕就继续到敦煌，把莫高窟、鸣沙山月牙泉和沙洲夜市放进两天。你再告诉我天数、出发地和偏好，我能继续压缩成更贴合你的路线。'
    }

    if (hasAny(text, ['景点', '历史', '故事', '导览', '介绍', '莫高窟', '嘉峪关', '张掖', '天水', '敦煌'])) {
      return '甘肃的看点很适合按“丝路节点”理解：兰州是黄河与陇原门户，张掖像彩色地层写成的地理长卷，嘉峪关守着长城西端的苍茫气势，敦煌把石窟艺术、商旅往来和大漠想象连在一起。进入具体城市页时，你也可以直接问我“这里先看哪里”。'
    }

    if (hasAny(text, ['附近', '周边', '推荐', '玩法', '打卡', '拍照'])) {
      return '如果你想轻松一点，可以选“主景点 + 城市散步 + 夜间小吃”的节奏：白天看博物馆、石窟、关城或丹霞，傍晚留给河边、古城街巷和市集。拍照建议优先抓日出、日落和侧光，丹霞、沙丘、关城都更出片。'
    }

    if (hasAny(text, ['提醒', '安全', '注意', '天气', '行李', '防晒', '高反', '夜间'])) {
      return '出行提醒：河西走廊昼夜温差明显，防晒、补水和薄外套都要带；沙漠和戈壁区域尽量穿防滑鞋，夜间不要单独进入偏僻区域；热门景区建议提前确认预约和开放安排，临近出发再核对一次最稳。'
    }

    if (hasAny(text, ['美食', '吃', '寻味', '牛肉面', '小吃', '文创'])) {
      return '陇上寻味可以从兰州牛肉面、手抓羊肉、灰豆子、甜醅子开始；到敦煌可以逛沙洲夜市，张掖适合尝搓鱼子和地方面食。文创优先看飞天、铜奔马、简牍、丹霞色彩这些元素，和丝路主题最搭。'
    }

    if (hasAny(text, ['交通', '高铁', '火车', '自驾', '兰州到', '怎么去'])) {
      return '甘肃长线更适合“兰州入、河西走廊向西”的方式：兰州到张掖、嘉峪关、敦煌可以按铁路或自驾分段走。自驾要预留补给和休息时间，火车线则更省心，适合把体力留给景点本身。'
    }

    return '这个问题我可以从路线、景点导览、周边玩法、出行提醒和陇上美食几个方向帮你拆。你可以试着告诉我“几天、从哪里出发、想看什么、同行人是谁”，我会给你更清楚的建议。'
  },

  goToPage1() {
    this.navigateWithLogin('/pages/siluwenyi/siluwenyi')
  },

  goToPage2() {
    this.navigateWithLogin('/pages/fengxingwanli/fengxingwanli')
  },

  goToPage3() {
    this.navigateWithLogin('/pages/tuolingyuxiang/tuolingyuxiang')
  },

  navigateWithLogin(url) {
    if (!this.ensureLoggedIn(url)) return
    wx.navigateTo({ url })
  },

  ensureLoggedIn(redirectUrl) {
    const profile = wx.getStorageSync('profileUser') || {}
    if (profile.loggedIn) return true

    this.goGuestLogin(redirectUrl)
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
