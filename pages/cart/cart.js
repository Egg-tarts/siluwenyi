// cart.js
Page({
  data: {
    cartItems: [
      {
        id: 1,
        name: "默认商品",
        details: "这是一个默认商品，用于测试",
        price: "¥100",
        imageUrl: "https://via.placeholder.com/60",
        swiped: false,
        selected: false,
        specifications: "规格：蓝色，L码",
        discount: "满100减20",
        quantity: 1
      }
    ],
    cartCount: 1,
    anySelected: false,
    totalPrice: "¥0.00",
    startX: 0
  },

  onLoad: function() {
    this.fetchCartData();
  },

  fetchCartData: function() {
    // 从后端获取购物车数据的方法
  },

  selectItem: function(e) {
    const selectedItems = e.detail1.value;
    const updatedCartItems = this.data.cartItems.map(item => {
      item.selected = selectedItems.includes(String(item.id));
      return item;
    });

    this.setData({
      cartItems: updatedCartItems,
      anySelected: selectedItems.length > 0
    });

    this.updateTotalPrice();
  },

  selectAll: function(e) {
    const selectAll = e.detail1.value.length > 0;
    const updatedCartItems = this.data.cartItems.map(item => {
      item.selected = selectAll;
      return item;
    });

    this.setData({
      cartItems: updatedCartItems,
      anySelected: selectAll
    });

    this.updateTotalPrice();
  },

  increaseQuantity: function(e) {
    const itemId = e.currentTarget.dataset.id;
    const updatedCartItems = this.data.cartItems.map(item => {
      if (item.id === itemId) {
        item.quantity += 1;
      }
      return item;
    });

    this.setData({
      cartItems: updatedCartItems
    });

    this.updateTotalPrice();
  },

  decreaseQuantity: function(e) {
    const itemId = e.currentTarget.dataset.id;
    const updatedCartItems = this.data.cartItems.map(item => {
      if (item.id === itemId && item.quantity > 1) {
        item.quantity -= 1;
      }
      return item;
    });

    this.setData({
      cartItems: updatedCartItems
    });

    this.updateTotalPrice();
  },

  changeQuantity: function(e) {
    const itemId = e.currentTarget.dataset.id;
    const quantity = parseInt(e.detail1.value, 10);
    const updatedCartItems = this.data.cartItems.map(item => {
      if (item.id === itemId && quantity > 0) {
        item.quantity = quantity;
      }
      return item;
    });

    this.setData({
      cartItems: updatedCartItems
    });

    this.updateTotalPrice();
  },

  updateTotalPrice: function() {
    const totalPrice = this.data.cartItems.reduce((total, item) => {
      if (item.selected) {
        total += item.quantity * parseFloat(item.price.slice(1));
      }
      return total;
    }, 0).toFixed(2);

    this.setData({
      totalPrice: `¥${totalPrice}`
    });
  },

  touchStart: function(e) {
    this.setData({
      startX: e.touches[0].clientX
    });
  },

  touchMove: function(e) {
    const moveX = e.touches[0].clientX;
    const diffX = this.data.startX - moveX;

    if (diffX > 0) {
      const itemId = e.currentTarget.dataset.id;
      const updatedCartItems = this.data.cartItems.map(item => {
        if (item.id === itemId) {
          item.swiped = true;
        } else {
          item.swiped = false;
        }
        return item;
      });

      this.setData({
        cartItems: updatedCartItems
      });
    }
  },

  touchEnd: function(e) {
    const itemId = e.currentTarget.dataset.id;
    const updatedCartItems = this.data.cartItems.map(item => {
      if (item.id === itemId) {
        item.swiped = this.data.startX - e.changedTouches[0].clientX > 100;
      }
      return item;
    });

    this.setData({
      cartItems: updatedCartItems
    });
  },

  deleteItem: function(e) {
    const itemId = e.currentTarget.dataset.id;
    const updatedCartItems = this.data.cartItems.filter(item => item.id !== itemId);

    this.setData({
      cartItems: updatedCartItems
    });

    this.updateTotalPrice();
  },

  shareItem: function(e) {
    const itemId = e.currentTarget.dataset.id;

    wx.showToast({
      title: `分享商品 ID: ${itemId}`,
      icon: 'success'
    });
  },

  checkout: function() {
    if (this.data.anySelected) {
      wx.navigateTo({
        url: '/pages/checkout/checkout'
      });
    } else {
      wx.showToast({
        title: '请先选择商品',
        icon: 'none'
      });
    }
  }
});
