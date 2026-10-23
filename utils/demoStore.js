const products = [
  {
    id: 'local-camel-bell',
    name: '驼铃星河香囊',
    money: '68',
    city: '敦煌',
    tag: '气味文创',
    image: 'https://free.picui.cn/free/2026/06/24/6a3b89a7cff00.jpg',
    text: '把鸣沙山夜色、艾草与甜杏香气缝进小小香囊，适合作为旅途伴手礼。',
    details: '灵感来自敦煌大漠夜色与驼铃意象，外层使用暖金织纹，内里搭配艾草、杏皮与木质香。'
  },
  {
    id: 'local-flying-horse',
    name: '铜奔马金属书签',
    money: '39',
    city: '武威',
    tag: '博物馆灵感',
    image: 'https://free.picui.cn/free/2026/06/24/6a3b89a842ac9.jpg',
    text: '用轻薄金属线条复刻奔马姿态，适合夹在旅途手账里。',
    details: '以铜奔马为视觉核心，边缘做旧金处理，适合阅读、打卡盖章和路线手账搭配。'
  },
  {
    id: 'local-danxia-cup',
    name: '丹霞渐层陶杯',
    money: '128',
    city: '张掖',
    tag: '城市限定',
    image: 'https://free.picui.cn/free/2026/06/24/6a3b89a775dd3.jpg',
    text: '把红、橙、赭、紫烧成杯壁纹理，像捧起一段日落。',
    details: '杯身色彩取自张掖丹霞地貌，釉面有细微流动感，每只纹理都不完全相同。'
  },
  {
    id: 'local-mogao-card',
    name: '莫高纹样明信片组',
    money: '56',
    city: '敦煌',
    tag: '盖章收藏',
    image: 'https://free.picui.cn/free/2026/06/24/6a3b89a82bc80.jpg',
    text: '选取藻井、飞天、莲纹元素，适合盖章与寄送。',
    details: '一组十二张，按藻井、飞天、莲纹、供养人色彩分组，适合做旅途寄语。'
  },
  {
    id: 'local-maiji-pin',
    name: '麦积烟雨徽章',
    money: '45',
    city: '天水',
    tag: '石窟记忆',
    image: 'https://free.picui.cn/free/2026/06/24/6a3b89a7e2e3e.jpg',
    text: '把麦积山石窟的烟雨层次做成随身徽章。',
    details: '徽章采用半透明釉色表现山体雾气，可别在包、帽子和旅行外套上。'
  }
]

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function getProducts() {
  return clone(products)
}

function getProduct(id) {
  return clone(products.find(item => String(item.id) === String(id)) || products[0])
}

function normalizeCartItem(product, quantity) {
  const count = Math.max(1, Number(quantity) || 1)

  return {
    id: product.id,
    cultural_product: {
      id: product.id,
      name: product.name,
      money: product.money,
      images1: product.image,
      text: count,
      city: product.city,
      tag: product.tag
    },
    selected: false,
    quantity: count
  }
}

function getCartItems() {
  return clone(wx.getStorageSync('demoCartItems') || [])
}

function saveCartItems(items) {
  wx.setStorageSync('demoCartItems', clone(items))
}

function addToCart(productId, quantity) {
  const product = getProduct(productId)
  const items = getCartItems()
  const existing = items.find(item => String(item.id) === String(product.id))

  if (existing) {
    existing.quantity = Math.max(1, Number(existing.quantity || 1) + (Number(quantity) || 1))
    existing.cultural_product.text = existing.quantity
  } else {
    items.unshift(normalizeCartItem(product, quantity))
  }

  saveCartItems(items)
  return items
}

function makeOrder(items) {
  const order = {
    id: 'order-' + Date.now(),
    created_at: formatNow(),
    status: '待体验',
    items: clone(items),
    total: items.reduce((sum, item) => {
      return sum + Number(item.cultural_product.money || 0) * Number(item.quantity || 1)
    }, 0)
  }
  const orders = wx.getStorageSync('demoOrders') || []
  wx.setStorageSync('demoOrders', [order].concat(orders).slice(0, 30))
  return order
}

function getOrders() {
  return clone(wx.getStorageSync('demoOrders') || [])
}

function formatNow() {
  const now = new Date()
  const pad = value => (value < 10 ? '0' + value : String(value))
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`
}

module.exports = {
  addToCart,
  formatNow,
  getCartItems,
  getOrders,
  getProduct,
  getProducts,
  makeOrder,
  saveCartItems
}
