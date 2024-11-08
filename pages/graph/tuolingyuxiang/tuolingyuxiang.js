Page({
  data: {
    products: [],
    filteredProducts: []
  },
  onLoad: function () {
    const that = this;
    wx.request({
      url: 'https://lzuer.mynatapp.cc/SRJC/culturalproducts/', // 替换为你的服务器接口
      method: 'GET',
      success(res) {
        that.setData({
          products: res.data,
          filteredProducts: res.data // 初始化时显示全部商品
        });
      },
      fail(err) {
        console.error('请求失败:', err);
      }
    });
  },
  onSearchInput: function (event) {
    const searchValue = event.detail1.value.toLowerCase();
    const filtered = this.data.products.filter(product => 
      product.name.toLowerCase().includes(searchValue)
    );
    this.setData({
      filteredProducts: filtered
    });
  },
  onProductTap: function (event) {
    const productId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail1/detail1?id=${productId}`
    });
  }
});
