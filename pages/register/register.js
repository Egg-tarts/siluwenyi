Page({
  data: {
    avatar: '',
    nickname: '',
    phone: ''
  },

  onInputNickname(e) {
    this.setData({ nickname: e.detail.value });
  },

  onInputPhone(e) {
    this.setData({ phone: e.detail.value });
  },

  chooseAvatar() {
    wx.chooseImage({
      count: 1,
      success: res => {
        this.setData({
          avatar: res.tempFilePaths[0]
        });
      }
    });
  },

  handleSubmit() {
    const { avatar, nickname, phone } = this.data;

    if (!avatar || !nickname || !phone) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    wx.uploadFile({
      url: 'https://your-server.com/upload-avatar', // 替换为你的头像上传接口
      filePath: avatar,
      name: 'file',
      success: res => {
        const avatarUrl = JSON.parse(res.data).url; // 假设服务器返回的是头像URL
        this.registerUser(nickname, phone, avatarUrl);
      }
    });
  },

  registerUser(nickname, phone, avatarUrl) {
    wx.request({
      url: 'https://your-server.com/register', // 替换为你的注册接口
      method: 'POST',
      data: {
        nickname,
        phone,
        avatar: avatarUrl
      },
      success: res => {
        if (res.statusCode === 200) {
          wx.showToast({
            title: '注册成功',
            icon: 'success'
          });
          wx.navigateBack(); // 注册成功后返回上一页
        } else {
          wx.showToast({
            title: '注册失败',
            icon: 'none'
          });
        }
      }
    });
  }
});
