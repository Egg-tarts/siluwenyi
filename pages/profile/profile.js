Page({
  goToLoginPage() {
    // 这里是点击头像后的逻辑，比如跳转到登录页面
    wx.navigateTo({
      url: '/pages/login/login' // 替换成你的登录页面路径
    });
  },
  showRegisterModal() {
    this.selectComponent('#register').showModal();
  }
});
