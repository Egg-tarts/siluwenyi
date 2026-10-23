const demoStore = require('../../utils/demoStore')

const collections = [
  { name: '石窟纹样', count: '18件', desc: '藻井、飞天、莲花与壁画色谱' },
  { name: '河西器物', count: '12件', desc: '陶杯、书签、香插与旅行茶具' },
  { name: '城市纪念', count: '21件', desc: '用每座城市的颜色做成随身物' }
]

const workshops = [
  { title: '拓印体验', desc: '把画像砖纹样拓进自己的旅途手账。' },
  { title: '香囊配方', desc: '按城市气味选择艾草、松木、杏皮与花椒。' },
  { title: '明信片盖章', desc: '完成路线后自动解锁对应城市印章。' }
]

Page({
  data: {
    products: [],
    filteredProducts: [],
    collections,
    workshops,
    keyword: '',
    loadingProducts: false,
    notLoadingProducts: true,
    productError: '',
    emptyText: '',
    stateText: '',
    stateClass: 'market-state',
    hasProducts: false,
    noProducts: true,
    showProductState: true,
    showProductList: false
  },

  goBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack()
      return
    }
    wx.reLaunch({ url: '/pages/touring/touring' })
  },

  onLoad() {
    this.loadProducts()
  },

  loadProducts() {
    this.applyProducts(demoStore.getProducts(), '已为你展示精选文创')
  },

  applyProducts(products, stateText) {
    this.setData({
      products,
      filteredProducts: products,
      emptyText: stateText,
      stateText: products.length ? '' : stateText,
      stateClass: 'market-state',
      hasProducts: products.length > 0,
      noProducts: products.length === 0,
      showProductState: products.length === 0,
      showProductList: products.length > 0
    })
  },

  onSearchInput(event) {
    const keyword = event.detail.value.trim().toLowerCase()
    const filteredProducts = this.data.products.filter(product => {
      return [product.name, product.city, product.tag, product.desc].some(text => {
        return String(text || '').toLowerCase().includes(keyword)
      })
    })

    const nextProducts = keyword ? filteredProducts : this.data.products
    const hasProducts = nextProducts.length > 0

    this.setData({
      keyword,
      filteredProducts: nextProducts,
      hasProducts,
      noProducts: !hasProducts,
      showProductState: !hasProducts,
      showProductList: hasProducts,
      stateText: keyword && filteredProducts.length === 0 ? '没有找到匹配商品' : this.data.emptyText
    })
  },

  onProductTap(event) {
    const productId = event.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail1/detail1?id=${productId}`
    })
  }
})
