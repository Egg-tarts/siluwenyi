Page({
  data: {
    userInfo: null
  },

  onLoad() {
    wx.cloud.init({
      env: 'houtai-1ghgpfr0872d2854',
    });

    this.loadUserInfo();
  },

  loadUserInfo() {
    const userInfo = wx.getStorageSync('user');
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      });
    }
  },

  goToRegisterPage() {
    wx.navigateTo({
      url: '/pages/register/register',
      success: () => {
        // 监听返回事件
        wx.onAppRouteChange(() => {
          this.loadUserInfo();
        });
      }
    });
  }
});

