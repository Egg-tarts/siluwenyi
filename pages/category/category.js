const demoStore = require('../../utils/demoStore')

Page({
  data: {
    cartItems: [],
    isSelectAll: false,
    hasItems: false,
    totalText: '¥0'
  },

  onShow() {
    this.fetchCartData()
  },

  fetchCartData() {
    const cartItems = demoStore.getCartItems().map(item => ({
      ...item,
      selected: !!item.selected
    }))
    this.setData({
      cartItems,
      hasItems: cartItems.length > 0,
      isSelectAll: cartItems.length > 0 && cartItems.every(item => item.selected)
    }, () => this.updateTotal())
  },

  toggleSelectItem(e) {
    const index = Number(e.currentTarget.dataset.index)
    const cartItems = this.data.cartItems.slice()
    cartItems[index].selected = e.detail.value.length > 0
    this.setData({
      cartItems,
      isSelectAll: cartItems.length > 0 && cartItems.every(item => item.selected)
    }, () => this.updateTotal())
  },

  toggleSelectAll() {
    const isSelectAll = !this.data.isSelectAll
    const cartItems = this.data.cartItems.map(item => ({
      ...item,
      selected: isSelectAll
    }))
    this.setData({ cartItems, isSelectAll }, () => this.updateTotal())
  },

  updateTotal() {
    const total = this.data.cartItems.reduce((sum, item) => {
      if (!item.selected) return sum
      return sum + Number(item.cultural_product.money || 0) * Number(item.quantity || 1)
    }, 0)
    this.setData({
      totalText: '¥' + total
    })
    demoStore.saveCartItems(this.data.cartItems)
  },

  payNow() {
    const selectedItems = this.data.cartItems.filter(item => item.selected)

    if (!selectedItems.length) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none'
      })
      return
    }

    demoStore.makeOrder(selectedItems)
    const remainItems = this.data.cartItems.filter(item => !item.selected)
    demoStore.saveCartItems(remainItems)

    this.setData({
      cartItems: remainItems,
      hasItems: remainItems.length > 0,
      isSelectAll: false
    }, () => this.updateTotal())

    wx.showToast({
      title: '购买成功',
      icon: 'success'
    })

    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/orders/orders'
      })
    }, 700)
  }
})
