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
          userInfo: null,
      })
  }
},

  // 获取昵称和电话号码接口
  getUserInfo(nickname, phone) {

      wx.request({
          url: 'https://lzuer.mynatapp.cc/SRJC/register/',
          method: 'POST',
          data: {
              nickName: nickname,
              phone: phone
          },
          success: res => {

              wx.showToast({
                  title: '信息提交成功',
                  icon: 'success'
              });
          },
          fail: err => {
    
              wx.showToast({
                  title: '信息提交失败',
                  icon: 'error'
              });
          }
      });
    },

  // 获取照片文件接口
  uploadAvatarFile(filePath, callback) {
      wx.uploadFile({
          url: 'https://lzuer.mynatapp.cc/SRJC/avatar/',
          filePath: filePath,
          name: 'avatar',
          success: res => {

              const data = JSON.parse(res.data);
              if (callback) callback(null, data.fileID);
          },
          fail: err => {

              if (callback) callback(err);
              wx.showToast({
                  title: '头像上传失败',
                  icon: 'error'
              });
          }
      });
  },

  // 打开/关闭弹框
  closeTank(e) {
      if (!this.data.userInfo_tank) {
          wx.cloud.database().collection('user')
              .get()
              .then(res => {
  
                  if (res.data.length) {
                      this.setData({
                          userInfo: res.data[0],
                          userInfo_tank: false,
                      })

                      wx.setStorageSync('user', res.data[0]);
                  } else {

                      this.setData({
                          userInfo_tank: true
                      })
                  }
              }).catch(res => {

              })
      } else {
          this.setData({
              userInfo_tank: false
          })
      }
  },

  // 获取头像
  onChooseAvatar(e) {

      this.setData({
          avatarUrl: e.detail.avatarUrl
      });
  },

  // 获取用户昵称
  getNickName(e) {

      this.setData({
          nickName: e.detail.value
      });
  },

  // 获取用户电话号码
  getPhone(e) {

      this.setData({
          phone: e.detail.value
      });
  },

  // 提交
  submit(e) {
      const { avatarUrl, nickName, phone } = this.data;
      if (!avatarUrl) {
          return wx.showToast({
              title: '请选择头像',
              icon: 'error'
          });
      }
      if (!nickName) {
          return wx.showToast({
              title: '请输入昵称',
              icon: 'error'
          });
      }
      if (!phone) {
          return wx.showToast({
              title: '请输入电话号码',
              icon: 'error'
          });
      }
      this.setData({
          userInfo_tank: false
      });
      wx.showLoading({
          title: '正在注册',
          mask: true
      });

      // 先上传头像
      this.uploadAvatarFile(avatarUrl, (err, fileID) => {
          if (err) {
              wx.hideLoading();
              return;
          }

          // 再提交昵称和电话号码
          this.getUserInfo(nickName, phone);

          wx.hideLoading();
          wx.showToast({
              title: '注册成功',
              icon: 'success'
          });

          this.setData({
              userInfo: {
                  avatarUrl: fileID,
                  nickName: nickName,
                  phone: phone
              }
          });

          wx.setStorageSync('user', {
              avatarUrl: fileID,
              nickName: nickName,
              phone: phone
          });
      });
  },
});

