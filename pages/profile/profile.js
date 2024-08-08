Page({
  data: {
    userInfo: {
      avatarUrl: '', // 用户头像URL
      nickName: ''   // 用户昵称
    }
  },
  onLoad: function() {
    // 初始化页面
  },
  navigateToLikes: function() {
    this.checkLoginStatus('/pages/likes/likes');
  },
  navigateToPosts: function() {
    this.checkLoginStatus('/pages/posts/posts');
  },
  navigateToHistory:function(){
    this.checkLoginStatus('/pages/history/history')
  },
  navigateToMember:function(){
    this.checkLoginStatus('/pages/member/member')
  },
  navigateToHistoryBrowse:function(){
    this.checkLoginStatus('/pages/historyBrowse/historyBrowse')
  },
  checkLoginStatus: function(url) {
    const userToken = wx.getStorageSync('userToken');
    if (!userToken) {
      wx.showModal({
        title: '请登录',
        content: '您需要登录后才能查看内容。',
        showCancel: true,
        cancelText: '取消',
        confirmText: '去登录',
        success: res => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/register/register'
            });
          }
        }
      });
    } else {
      wx.navigateTo({
        url: url
      });
  }
},
  goToRegisterPage: function() {
    wx.navigateTo({
      url: '/pages/register/register'
    });
  }
})

