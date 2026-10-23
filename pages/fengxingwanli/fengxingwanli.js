const routeStore = require('../../utils/routeStore')

const cityNames = ['兰州', '敦煌', '酒泉', '嘉峪关', '张掖', '武威', '天水', '平凉', '庆阳', '定西', '白银', '陇南', '金昌']
const cardColors = ['teal', 'gold', 'clay']

function compactText(text, limit) {
  const value = String(text || '')
    .replace(/\*\*/g, '')
    .replace(/#{1,6}\s?/g, '')
    .replace(/`{1,3}/g, '')
    .replace(/经纬度[：:\s]*[^\n]+/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (!limit || value.length <= limit) return value
  return value.slice(0, limit) + '...'
}

function firstMeaningfulLine(text) {
  return String(text || '')
    .split('\n')
    .map(line => compactText(line))
    .find(line => line && !/^第[一二三四五六七八九十\d]+天/.test(line) && line.indexOf('经纬度') === -1) || ''
}

Page({
  data: {
    routes: [],
    activeRoute: null,
    routeCount: 0,
    hasRoutes: false,
    noRoutes: true,
    hasActiveRoute: false,
    noActiveRoute: true,
    totalDistance: '0天',
    totalDays: '0天',
    completedCities: 0,
    loadingRemote: false,
    emptyText: '正在整理你的行程档案',
    emptyDesc: '在丝路问驿生成路线后，这里会自动整理成档案。',
    emptyMark: '...',
    emptyClass: 'empty-state',
    hasError: false
  },

  goBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack()
      return
    }
    wx.reLaunch({ url: '/pages/touring/touring' })
  },

  onLoad() {
    this.getRoutes()
  },

  onPullDownRefresh() {
    this.getRoutes(() => wx.stopPullDownRefresh())
  },

  getRoutes(done) {
    const canUseHistory = routeStore.canUseRouteHistory()
    const localRoutes = canUseHistory ? this.getLocalRoutes() : []
    const profile = wx.getStorageSync('profileUser') || {}
    const isLoggedIn = !!profile.loggedIn
    const isGuest = !!profile.isGuest

    this.setData({
      loadingRemote: true,
      hasError: false,
      emptyMark: '...',
      emptyClass: 'empty-state',
      emptyText: '正在整理你的行程档案',
      emptyDesc: !isLoggedIn ? '请先游客登录，生成路线后这里会保存你的风行万里档案。' : (isGuest ? '正在读取本机游客路线记录。' : '正在读取当前账号的专属路线记录。')
    })

    setTimeout(() => {
      const emptyText = !isLoggedIn ? '请先登录后查看' : '暂无行程记录'
      const emptyDesc = !isLoggedIn
        ? '点击丝路问驿等功能时会引导你游客登录；登录后生成的路线会保存在本机。'
        : isGuest
        ? '游客模式也会在本机保存风行万里路线档案，先去丝路问驿生成一次路线。'
        : '先在丝路问驿生成一次路线，这里会自动整理成行程档案。'

      this.applyRoutes(localRoutes, emptyText, !isLoggedIn ? '登' : (isGuest ? '游' : '空'), emptyDesc)
      this.setData({ loadingRemote: false })
      if (done) done()
    }, 260)
  },

  getLocalRoutes() {
    const routes = routeStore.getRoutes()
    return routes.map((record, index) => this.normalizeRoute(record, index))
  },

  applyRoutes(routes, emptyText, emptyMark, emptyDesc) {
    const activeRoute = routes[0] || null
    const totalDayCount = routes.reduce((sum, route) => sum + route.dayCount, 0)

    this.setData({
      routes: this.withActive(routes, activeRoute),
      activeRoute,
      routeCount: routes.length,
      hasRoutes: routes.length > 0,
      noRoutes: routes.length === 0,
      hasActiveRoute: !!activeRoute,
      noActiveRoute: !activeRoute,
      completedCities: this.countCities(routes),
      totalDistance: routes.length ? totalDayCount + '天' : '0天',
      totalDays: routes.length ? totalDayCount + '天' : '0天',
      hasError: false,
      emptyMark: emptyMark || '空',
      emptyClass: 'empty-state',
      emptyText: routes.length ? '' : emptyText,
      emptyDesc: routes.length ? '' : emptyDesc
    })
  },

  normalizeRoute(record, index) {
    const answer = this.cleanAnswer(record.answer || '')
    const dayPlans = this.parseDayPlans(answer)
    const dayCount = dayPlans.length
    const cities = this.extractCities(answer, dayPlans)
    const title = this.extractTitle(answer, index, dayPlans, cities)
    const summary = this.buildRouteSummary(answer, dayPlans, cities)
    const tags = [`${dayCount}天`, cities[0] || '甘肃', cities.length > 1 ? `${cities.length}城联游` : '慢游档案'].filter(Boolean)

    return {
      id: record.id || `route-${index}`,
      title,
      summary,
      answer,
      author: record.author || { username: '我的行程' },
      created_at: (record.created_at || '').trim() || '刚刚生成',
      days: `${dayCount}天`,
      dayCount,
      distance: cities.length > 1 ? `${cities.length}城联游` : `${cities[0] || '甘肃'}慢游`,
      cities,
      cityText: cities.join(' / '),
      mood: '路线档案',
      progress: 100,
      color: cardColors[index % cardColors.length],
      dayPlans,
      previewDays: dayPlans.slice(0, 3),
      tags,
      highlights: this.buildHighlights(dayCount, cities, record.created_at),
      raw: record
    }
  },

  cleanAnswer(answer) {
    return String(answer || '')
      .replace(/\r/g, '')
      .replace(/\*\*/g, '')
      .replace(/#{1,6}\s?/g, '')
      .replace(/`{1,3}/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  },

  extractTitle(answer, index, dayPlans, cities) {
    const line = firstMeaningfulLine(answer)
      .replace(/^标题[：:]\s*/, '')
      .replace(/^路线方案[：:]\s*/, '')
      .trim()

    if (line && line.length <= 28) return line
    if (line && line.indexOf('路线') > -1) return compactText(line, 24)

    const city = cities[0] || '甘肃'
    const dayText = dayPlans.length ? `${dayPlans.length}天` : `行程${index + 1}`
    return `${city}${dayText}丝路行程`
  },

  buildRouteSummary(answer, dayPlans, cities) {
    if (dayPlans.length) {
      const names = dayPlans.map(item => item.title).filter(Boolean).slice(0, 3).join('、')
      const cityText = cities.slice(0, 3).join('、') || '甘肃'
      return compactText(`${cityText}线路，重点串联${names || '沿途景点'}。`, 64)
    }

    return compactText(firstMeaningfulLine(answer) || answer || '该行程暂未生成详细内容。', 64)
  },

  buildHighlights(dayCount, cities, createdAt) {
    return [
      { label: '档案类型', value: '路线记录' },
      { label: '行程天数', value: dayCount + '天' },
      { label: '覆盖城市', value: cities.length + '座' },
      { label: '记录时间', value: createdAt || '刚刚生成' }
    ]
  },

  parseDayPlans(answer) {
    const text = String(answer || '').trim()
    if (!text) {
      return [this.buildDayPlan('', 0, '全程概览')]
    }

    const regex = /(?:^|\n)(第[一二三四五六七八九十\d]+天[：:\s]*(.*)?)/g
    const matches = []
    let match = regex.exec(text)

    while (match) {
      const offset = match[0].charAt(0) === '\n' ? 1 : 0
      matches.push({
        index: match.index + offset,
        heading: match[1]
      })
      match = regex.exec(text)
    }

    if (!matches.length) {
      return [this.buildDayPlan(text, 0, '全程概览')]
    }

    return matches.map((item, index) => {
      const next = matches[index + 1]
      const block = text.slice(item.index, next ? next.index : text.length).trim()
      return this.buildDayPlan(block, index, item.heading)
    })
  },

  buildDayPlan(block, index, heading) {
    const title = this.extractField(block, ['景点名称', '景点', '目的地']) || this.extractHeadingTitle(heading) || `第${index + 1}天行程`
    const time = this.extractField(block, ['推荐游玩时间', '游玩时间', '时间']) || '按当天节奏安排'
    const traffic = this.extractField(block, ['交通方式', '交通']) || '结合所选交通方式'
    const food = this.extractSection(block, '餐馆推荐', ['价格参考', '注意事项']) || this.extractField(block, ['餐饮', '美食']) || '沿途选择当地特色餐食'
    const note = this.extractSection(block, '注意事项', ['第']) || this.extractField(block, ['提醒', '建议']) || '出发前确认天气、预约和交通班次'
    const city = cityNames.find(name => block.indexOf(name) > -1) || cityNames.find(name => title.indexOf(name) > -1) || '甘肃'

    return {
      day: heading && /^第/.test(heading) ? heading.split(/[：:]/)[0] : `第${index + 1}天`,
      title: compactText(title, 24),
      city,
      time: compactText(time, 34),
      traffic: compactText(traffic, 34),
      foodLine: compactText(food.replace(/^\d+[.、]\s*/gm, ''), 52),
      noteLine: compactText(note, 58)
    }
  },

  extractHeadingTitle(heading) {
    const parts = String(heading || '').split(/[：:]/)
    return parts.length > 1 ? compactText(parts.slice(1).join('：'), 28) : ''
  },

  extractField(block, labels) {
    for (let i = 0; i < labels.length; i += 1) {
      const pattern = new RegExp(labels[i] + '[：:\\s]*([^\\n]+)')
      const match = String(block || '').match(pattern)
      if (match && match[1]) return compactText(match[1], 80)
    }
    return ''
  },

  extractSection(block, label, stopLabels) {
    const stops = (stopLabels || []).concat(['第[一二三四五六七八九十\\d]+天']).join('|')
    const pattern = new RegExp(label + '[：:]?\\s*([\\s\\S]*?)(?=\\n(?:' + stops + ')|$)')
    const match = String(block || '').match(pattern)
    return match && match[1] ? compactText(match[1], 90) : ''
  },

  extractCities(answer, dayPlans) {
    const source = String(answer || '') + ' ' + (dayPlans || []).map(item => item.city + item.title).join(' ')
    const cities = cityNames.filter(city => source.indexOf(city) > -1)
    return cities.length ? cities : ['甘肃']
  },

  countCities(routes) {
    const set = new Set()
    routes.forEach(route => {
      route.cities.forEach(city => set.add(city))
    })
    return set.size
  },

  chooseRoute(e) {
    const id = e.currentTarget.dataset.id
    const activeRoute = this.data.routes.find(route => route.id === id)

    if (activeRoute) {
      this.setData({
        activeRoute,
        hasActiveRoute: true,
        noActiveRoute: false,
        routes: this.withActive(this.data.routes, activeRoute)
      })
    }
  },

  withActive(routes, activeRoute) {
    return routes.map(route => ({
      ...route,
      activeClass: activeRoute && route.id === activeRoute.id ? 'route-card--active' : ''
    }))
  },

  viewRouteDetail() {
    const selectedRoute = this.data.activeRoute

    if (!selectedRoute) {
      wx.showToast({
        title: this.data.emptyText || '暂无行程',
        icon: 'none'
      })
      return
    }

    wx.navigateTo({
      url: '/pages/detail2/detail2',
      success(res) {
        res.eventChannel.emit('routeData', selectedRoute)
      }
    })
  }
})
