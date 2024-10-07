Page({
  data: {
    cartItems: [
      {
        id: 1,
        photo: 'https://via.placeholder.com/80',
        name: '商品1',
        quantity: 1,
        price: 100,
        checked: false,
        translateX: 0
      },
      {
        id: 2,
        photo: 'https://via.placeholder.com/80',
        name: '商品2',
        quantity: 2,
        price: 200,
        checked: false,
        translateX: 0
      },
      {
        id: 3,
        photo: 'https://via.placeholder.com/80',
        name: '商品3',
        quantity: 1,
        price: 300,
        checked: false,
        translateX: 0
      }
    ],
    startX: 0
  },

  // 手势滑动开始
  touchStart(e) {
    this.setData({
      startX: e.touches[0].clientX
    });
  },

  // 手势滑动
  touchMove(e) {
    const index = e.currentTarget.dataset.index;
    const moveX = e.touches[0].clientX - this.data.startX;

    if (moveX < -50) {
      this.setTranslateX(index, -150); // 左滑
    } else if (moveX > 50) {
      this.setTranslateX(index, 0); // 右滑复原
    }
  },

  // 设置平移值
  setTranslateX(index, value) {
    const updatedItems = [...this.data.cartItems];
    updatedItems[index].translateX = value;
    this.setData({
      cartItems: updatedItems
    });
  },

  // 减少商品数量
  decreaseQuantity(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.cartItems[index];
    if (item.quantity > 1) {
      this.updateQuantity(index, item.quantity - 1);
    }
  },

  // 增加商品数量
  increaseQuantity(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.cartItems[index];
    this.updateQuantity(index, item.quantity + 1);
  },

  // 更新商品数量
  updateQuantity(index, quantity) {
    const updatedItems = [...this.data.cartItems];
    updatedItems[index].quantity = quantity;
    this.setData({
      cartItems: updatedItems
    });
  },

  // 选择单个商品
  selectItem(e) {
    const index = e.detail.value;
    const updatedItems = [...this.data.cartItems];
    updatedItems[index].checked = !updatedItems[index].checked;
    this.setData({
      cartItems: updatedItems
    });
  },

  // 全选或取消全选
  selectAll() {
    const allSelected = this.data.cartItems.every(item => item.checked);
    const updatedItems = this.data.cartItems.map(item => {
      return { ...item, checked: !allSelected };
    });
    this.setData({
      cartItems: updatedItems
    });
  },

  // 删除商品
  deleteItem(e) {
    const index = e.currentTarget.dataset.index;
    const updatedItems = this.data.cartItems.filter((_, i) => i !== index);
    this.setData({
      cartItems: updatedItems
    });
  },

  // 分享商品
  shareItem(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.cartItems[index];
    wx.showToast({
      title: `分享 ${item.name}`,
      icon: 'none'
    });
  },

  // 付款
  payNow() {
    const selectedItems = this.data.cartItems.filter(item => item.checked);
    if (selectedItems.length > 0) {
      wx.showToast({
        title: '付款成功',
        icon: 'success'
      });
    } else {
      wx.showToast({
        title: '请选择商品',
        icon: 'none'
      });
    }
  }
});
