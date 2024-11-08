Page({
  data: {
    product: {},
    productId: null // 用于存储productId
  },
  onLoad: function (options) {
    const productId = options.id;
    const that = this;
    this.setData({ productId }); // 将productId存储到data中
    wx.request({
      url: `https://lzuer.mynatapp.cc/SRJC/culturalproducts/${productId}/`, // 根据ID获取具体商品详情的接口
      method: 'GET',
      success(res) {
        that.setData({
          product: res.data
        });
      },
      fail(err) {
        console.error('请求失败:', err);
      }
    });
  },
  addToCart: function () {
    const that = this;
    const app = getApp(); // 获取全局 app 实例
    const token = app.globalData.token; // 使用全局 token
    const productId = that.data.productId; // 从 data 中获取 productId

    wx.request({
      url: `https://lzuer.mynatapp.cc/SRJC/addtocart/${productId}/`, // 将 productId 拼接到 URL 中
      method: 'POST',
      data: {
        quantity: 1 // 默认添加 1 个商品
      },
      header: {
        Authorization: 'Token 7384d57763633082c097d4c6a2ee3bac13412ca0', // 使用全局 token
        'Content-Type': 'application/json' // 指定 Content-Type 为 JSON 格式
      },
      success(res) {
        console.log(res)
        if (res.statusCode === 200) {
          wx.showToast({
            title: '商品加入购物车成功',
            icon: 'success',
            duration: 2000
          });
        } else {
          wx.showToast({
            title: '加入购物车失败',
            icon: 'none',
            duration: 2000
          });
        }
      },
      fail(err) {
        wx.showToast({
          title: '请求失败',
          icon: 'none',
          duration: 2000
        });
        console.error('请求失败:', err);
      }
    });
  }
})
