Page({
  data: {
    cartItems: [],
    startX: 0
  },

  onLoad() {
    this.fetchCartData();
  },

  fetchCartData() {
    // 假设从后端获取购物车数据
    wx.request({
      url: 'https://lzuer.mynatapp.cc/SRJC/mycart/',
      method: 'GET',
      success: (res) => {
        this.setData({ cartItems: res.data });
      }
    });
  },

  touchStart(e) {
    this.setData({
      startX: e.touches[0].clientX
    });
  },

  touchMove(e) {
    const index = e.currentTarget.dataset.index;
    const moveX = e.touches[0].clientX - this.data.startX;

    if (moveX < -50) {
      this.setTranslateX(index, -150);
    } else if (moveX > 50) {
      this.setTranslateX(index, 0);
    }
  },

  setTranslateX(index, value) {
    const updatedItems = [...this.data.cartItems];
    updatedItems[index].translateX = value;
    this.setData({ cartItems: updatedItems });
  },

  selectItem(e) {
    const index = e.detail.value;
    const updatedItems = [...this.data.cartItems];
    updatedItems[index].checked = !updatedItems[index].checked;
    this.setData({ cartItems: updatedItems });
  },

  selectAll() {
    const allSelected = this.data.cartItems.every(item => item.checked);
    const updatedItems = this.data.cartItems.map(item => {
      return { ...item, checked: !allSelected };
    });
    this.setData({ cartItems: updatedItems });
  },

  deleteItem(e) {
    const index = e.currentTarget.dataset.index;
    const updatedItems = this.data.cartItems.filter((_, i) => i !== index);
    this.setData({ cartItems: updatedItems });
  },

  shareItem(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.cartItems[index];
    wx.showToast({
      title: `分享 ${item.name}`,
      icon: 'none'
    });
  },

  payNow() {
    const selectedItems = this.data.cartItems.filter(item => item.checked);
    if (selectedItems.length > 0) {
      this.addToOrders(selectedItems);
      this.removeFromCart(selectedItems);
      this.updateBackend(selectedItems);
      wx.showToast({ title: '付款成功', icon: 'success' });
    } else {
      wx.showToast({ title: '请选择商品', icon: 'none' });
    }
  },

  addToOrders(selectedItems) {
    // 这里可以将选中的商品添加到订单数据
  },

  removeFromCart(selectedItems) {
    const updatedCart = this.data.cartItems.filter(item => !item.checked);
    this.setData({ cartItems: updatedCart });
  },

  updateBackend(selectedItems) {
    // 更新后端的购物车和订单数据
    wx.request({
      url: 'https://api.example.com/update',
      method: 'POST',
      data: {
        cartItems: this.data.cartItems
        // 这里需要添加订单数据
      }
    });
  }
});
