const demoStore = require('../../utils/demoStore')

Page({
  data: {
    product: {},
    productId: ''
  },

  onLoad(options) {
    const productId = options.id || 'local-camel-bell'
    this.setData({
      productId,
      product: demoStore.getProduct(productId)
    })
  },

  addToCart() {
    demoStore.addToCart(this.data.productId, 1)
    wx.showToast({
      title: '已加入购物车',
      icon: 'success'
    })
  },

  goCart() {
    wx.navigateTo({
      url: '/pages/category/category'
    })
  }
})
