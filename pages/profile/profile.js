Page({
  onLoad() {
      // 云开发初始化
      wx.cloud.init({
          env: 'houtai-1ghgpfr0872d2854', // 替换成你的云开发环境ID
      })
  },
  // 退出登录
  tuichu() {
      wx.setStorageSync('user', null)
      this.setData({
          userInfo: null,
      })
  },

  // 获取昵称和电话号码接口
  getUserInfo(nickname, phone) {
      console.log('用户信息:', { nickname, phone });
      wx.request({
          url: 'https://lzuer.mynatapp.cc/SRJC/register/',
          method: 'POST',
          data: {
              nickName: nickname,
              phone: phone
          },
          success: res => {
              console.log('用户信息提交成功', res);
              wx.showToast({
                  title: '信息提交成功',
                  icon: 'success'
              });
          },
          fail: err => {
              console.log('用户信息提交失败', err);
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
              console.log('头像上传成功', res);
              const data = JSON.parse(res.data);
              if (callback) callback(null, data.fileID);
          },
          fail: err => {
              console.log('头像上传失败', err);
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
                  console.log("用户信息====", res);
                  if (res.data.length) {
                      this.setData({
                          userInfo: res.data[0],
                          userInfo_tank: false,
                      })

                      wx.setStorageSync('user', res.data[0]);
                  } else {
                      console.log("还未注册====", res)
                      this.setData({
                          userInfo_tank: true
                      })
                  }
              }).catch(res => {
                  console.log('请添加user表')
              })
      } else {
          this.setData({
              userInfo_tank: false
          })
      }
  },

  // 获取头像
  onChooseAvatar(e) {
      console.log(e);
      this.setData({
          avatarUrl: e.detail.avatarUrl
      });
  },

  // 获取用户昵称
  getNickName(e) {
      console.log(e);
      this.setData({
          nickName: e.detail.value
      });
  },

  // 获取用户电话号码
  getPhone(e) {
      console.log(e);
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

