Page({
  data: {
    avatarUrl: '/pages/graph/头像.jpg',
    nickName: '',
    phoneNumber: '',
    Token: '' // 保存 Token
  },

  onLoad() {
    // 从本地存储中获取 Token
    const Token = wx.getStorageSync('Token');
    if (Token) {
      this.setData({ Token });
    }
  },

  chooseAvatar() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        const tempFilePaths = res.tempFilePaths;
        this.setData({
          avatarUrl: tempFilePaths[0]
        });
      }
    });
  },

  onNickNameChange(event) {
    this.setData({
      nickName: event.detail.value
    });
  },

  onPhoneNumberChange(event) {
    this.setData({
      phoneNumber: event.detail.value
    });
  },

  submitForm() {
    const { nickName, phoneNumber } = this.data;

    if (!nickName || !phoneNumber) {
      wx.showToast({
        title: '请填写所有信息',
        icon: 'none'
      });
      return;
    }

    // 1. 先上传昵称和电话号码以获取Token
    this.uploadUserInfo();
  },

  uploadUserInfo() {
    const { nickName, phoneNumber } = this.data;

    wx.request({
      url: 'https://lzuer.mynatapp.cc/SRJC/register/', // 上传昵称和电话号码的接口
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: {
        nickName: nickName,        // 昵称 (string)
        phoneNumber: phoneNumber   // 电话号码 (string)
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data.Token) {
          const Token = res.data.Token;
          this.setData({ Token });

          // 保存Token到本地存储
          wx.setStorageSync('Token', Token);

          // 2. 获取Token后上传头像
          this.uploadAvatar();
        } else {
          wx.showToast({
            title: '保存信息失败',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '保存信息失败',
          icon: 'none'
        });
      }
    });
  },

  uploadAvatar() {
    const { avatarUrl, Token } = this.data;

    if (avatarUrl) {
      wx.uploadFile({
        url: 'https://lzuer.mynatapp.cc/SRJC/avatar/', // 上传头像的接口
        filePath: avatarUrl,  // 头像文件
        name: 'avatar',       // 文件对应的 key
        formData: {
          Token: Token  // 使用从后端获取的 Token
        },
        success: (res) => {
          console.log('头像上传成功', res);
          if (res.statusCode === 200) {
            wx.showToast({
              title: '头像上传成功',
              icon: 'success'
            });
            wx.navigateBack();
          } else {
            wx.showToast({
              title: '头像上传失败',
              icon: 'none'
            });
          }
        },
        fail: () => {
          wx.showToast({
            title: '头像上传失败',
            icon: 'none'
          });
        }
      });
    }
  }
});



