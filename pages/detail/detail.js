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
    const token = wx.getStorageSync('userToken'); // 获取存储的token
    const productId = that.data.productId; // 从data中获取productId

    wx.request({
      url: `https://lzuer.mynatapp.cc/SRJC/addtocart/${productId}/`, // 将productId拼接到URL中
      method: 'POST',
      data: {
        quantity: 1 // 默认添加1个商品
      },
      header: {
        'Authorization': `Bearer ${token}`, // 将token添加到请求头中
        'Content-Type': 'application/json' // 指定Content-Type为JSON格式
      },
      success(res) {
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
});
