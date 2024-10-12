Page({
  data: {
    avatarUrl: '',  // 用户头像URL
    name: '',       // 用户昵称
    phoneNumber: '', // 用户注册的电话号码
    location: '',   // 用户所在地
    birthday: '',   // 用户生日
    country: '',    // 用户国家
    zodiac: '',     // 用户星座
    signature: '',  // 用户个性签名
    isLoggedIn: false, // 检查用户是否登录
    showPopup: false,  // 控制弹窗显示
    isEditing: false,  // 控制是否处于编辑模式
    originalData: {},  // 用于存储原始数据
    hasUnsavedChanges: false // 检查是否有未保存的更改
  },

  onLoad() {
    const app = getApp();
    if (app.globalData.token) {
      this.setData({
        isLoggedIn: true,
        avatarUrl: app.globalData.avatarUrl,
        name: app.globalData.username,
        phoneNumber: app.globalData.phoneNumber,
        location: app.globalData.location,
        birthday: app.globalData.birthday,
        country: app.globalData.country,
        zodiac: app.globalData.zodiac,
        signature: app.globalData.signature,
        originalData: { // 保存初始数据
          phoneNumber: app.globalData.phoneNumber,
          location: app.globalData.location,
          birthday: app.globalData.birthday,
          country: app.globalData.country,
          zodiac: app.globalData.zodiac,
          signature: app.globalData.signature
        }
      });
    }
  },

  handleAvatarClick() {
    const app = getApp();
    if (!app.globalData.token) {
      wx.navigateTo({
        url: '/pages/register/register'
      });
    }
  },

  showUserInfo() {
    this.setData({
      showPopup: true
    });
  },

  handlePopupClose() {
    // 检查是否有未保存的更改
    if (this.data.isEditing && this.data.hasUnsavedChanges) {
      // 显示确认提示框
      wx.showModal({
        title: '未保存的更改',
        content: '您当前未保存，需要保存吗？',
        cancelText: '取消',
        confirmText: '保存',
        success: (res) => {
          if (res.confirm) {
            this.saveUserInfo(); // 用户选择保存时，调用保存方法
          } else if (res.cancel) {
            // 用户选择取消时，重置为原始数据
            this.setData({
              showPopup: false,
              isEditing: false,
              hasUnsavedChanges: false,
              // 还原为原始数据
              phoneNumber: this.data.originalData.phoneNumber,
              location: this.data.originalData.location,
              birthday: this.data.originalData.birthday,
              country: this.data.originalData.country,
              zodiac: this.data.originalData.zodiac,
              signature: this.data.originalData.signature
            });
          }
        }
      });
    } else {
      // 没有未保存更改时，直接关闭弹窗
      this.setData({
        showPopup: false,
        isEditing: false
      });
    }
  },
  

  handleInputChange(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [field]: e.detail.value,
      hasUnsavedChanges: true // 标记有更改
    });
  },

  editUserInfo() {
    this.setData({
      isEditing: true
    });
  },

  saveUserInfo() {
    const { phoneNumber, location, birthday, country, zodiac, signature } = this.data;


    this.setData({
      originalData: {
        phoneNumber, location, birthday, country, zodiac, signature
      },
      isEditing: false,
      hasUnsavedChanges: false,
      showPopup: false
    });

    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 2000
    });
  }
});

