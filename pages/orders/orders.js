Page({
  data: {
    orderItems: []
  },

  onLoad() {
    this.fetchOrderData();
  },

  fetchOrderData() {
    // 假设从后端获取订单数据
    wx.request({
      url: 'https://lzuer.mynatapp.cc/SRJC/myorder/',
      method: 'GET',
      success: (res) => {
        this.setData({ orderItems: res.data });
      }
    });
  }
});
