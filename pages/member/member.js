Page({
  data: {
    avatarUrl: '',  // 用户头像URL
    name: '',       // 用户昵称
    isLoggedIn: false // 检查用户是否登录
  },
  
  onLoad() {
    const app = getApp();
    // 检查用户是否已登录
    if (app.globalData.token) {
      this.setData({
        isLoggedIn: true,
        avatarUrl: app.globalData.avatarUrl,  // 假设头像和昵称保存在 globalData 中
        name: app.globalData.username
      });
    } else {
      this.setData({
        isLoggedIn: false,
        avatarUrl: '',   // 未登录时头像为空
        name: '点击登录' // 未登录时提示用户登录
      });
    }
  },

  // 点击头像事件，未登录则跳转到登录页面
  handleAvatarClick() {
    const app = getApp();
    if (!app.globalData.token) {
      // 如果用户未登录，跳转到注册/登录页面
      wx.navigateTo({
        url: '/pages/register/register'
      });
    }
  }
});
