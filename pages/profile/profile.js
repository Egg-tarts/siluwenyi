Page({
  data: {
    avatarUrl: '', // 用户头像URL
    name: ''   // 用户昵称
  },
  
  onShow() {
    console.log(1)
    const app = getApp();
    console.log(app.globalData.token)
    wx.request({
      url: 'https://lzuer.mynatapp.cc/SRJC/getinfo/', // 上传昵称和电话号码的接口
      method: 'GET',
      header: {
        Authorization: 'Token ' + app.globalData.token
      },
      success: (res) => {
        console.log(res)
        // 假设 res.data 是返回的数据
        this.setData({
          avatarUrl: res.data.avatar,
          name: res.data.username
        });
      },
      fail: (error) => {
        console.error("请求失败", error);
      }
    });
  },

  navigateToLikes: function() {
    this.checkLoginStatus('/pages/likes/likes');
  },
  
  navigateToPosts: function() {
    this.checkLoginStatus('/pages/posts/posts');
  },
  
  navigateToHistory: function() {
    this.checkLoginStatus('/pages/history/history');
  },
  navigateToCategory: function() {
    this.checkLoginStatus('/pages/category/category');
  },
  
  navigateToMember: function() {
    // 无论是否登录，都允许进入会员页面
    wx.navigateTo({
      url: '/pages/member/member'
    });
  },
  
  navigateToHistoryBrowse: function() {
    this.checkLoginStatus('/pages/historyBrowse/historyBrowse');
  },
  
  checkLoginStatus: function(url) {
    const app = getApp();
    if (!app.globalData.token) {
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
});

