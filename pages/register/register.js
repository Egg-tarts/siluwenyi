Page({
  data: {
    avatarUrl: '/pages/graph/头像.jpg',
    username: '',
    phone: '',

  },

  chooseAvatar() {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        const tempFilePaths = res.tempFilePaths;
        this.setData({
          avatarUrl: tempFilePaths[0]
        },
        ()=>{console.log(this.data.avatarUrl)}
        );
      }
    });
  },

  onNickNameChange(event) {
    this.setData({
      username: event.detail.value
    });
  },

  onPhoneNumberChange(event) {
    this.setData({
      phone: event.detail.value
    });
  },

  submitForm() {
    const { username, phone } = this.data;
    if (!username || !phone) {
      wx.showToast({
        title: '请填写所有信息',
        icon: 'none'
      });
      return;
    }
    this.uploadUserInfo();
  },
  

  uploadUserInfo() {
    const { username, phone } = this.data;
    wx.request({
      url: 'https://lzuer.mynatapp.cc/SRJC/register/', // 上传昵称和电话号码的接口
      method: 'POST',
      data: {
        username: username, // 昵称 (string)
        phone: phone // 电话号码 (string)
      },
      success: () => {
        console.log(1);
        wx.request({
          url: 'https://lzuer.mynatapp.cc/SRJC/login/', // 登录接口
          method: 'POST',
          data: {
            phone: phone // 电话号码 (string)
          },
          success: (res) => {
            console.log(res);
            const app = getApp(); 
            const Token = res.data.token;
            app.globalData.token = Token;
            console.log(app.globalData.token);
            this.uploadAvatar();
          }
        });
      }
    });
  },
  
  uploadAvatar() {
    const app = getApp(); 
    const { avatarUrl } = this.data;
    if (avatarUrl) {
      wx.uploadFile({
        url: 'https://lzuer.mynatapp.cc/SRJC/avatar/', // 上传头像的接口
        method: 'POST',
        header: {
          Authorization: 'Token ' + app.globalData.token
        },
        filePath: avatarUrl, // 传递文件路径
        name: 'file', // 文件对应的 key 值
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
        fail: (err) => {
          console.error('头像上传失败', err);
          wx.showToast({
            title: '头像上传失败',
            icon: 'none'
          });
        }
      });
    } else {
      wx.showToast({
        title: '请先选择头像',
        icon: 'none'
      });
    }
}
});



