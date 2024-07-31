Page({
  data: {
      userInfo: null,
      avatar: null,
      nickname: '',
      phone: '',
      showModal: false,
  },

  onLoad() {
      // 云开发初始化
      wx.cloud.init({
          env: 'houtai-1ghgpfr0872d2854', // 替换成你的云开发环境ID
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
                      });

                      wx.setStorageSync('user', res.data[0]);
                  } else {
                      this.setData({
                          userInfo_tank: true
                      });
                  }
              }).catch(res => {
                  console.log('请添加user表');
              });
      } else {
          this.setData({
              userInfo_tank: false
          });
      }
  },

  // 获取头像
  onChooseAvatar(e) {
      console.log(e);
      this.setData({
          avatar: e.detail.avatarUrl
      });
  },

  // 获取用户昵称
  handleNicknameInput(e) {
      this.setData({
          nickname: e.detail.value
      });
  },

  // 获取用户电话号码
  handlePhoneInput(e) {
      this.setData({
          phone: e.detail.value
      });
  },

  // 提交
  submit(e) {
      const { avatar, nickname, phone } = this.data;
      if (!avatar) {
          return wx.showToast({
              title: '请选择头像',
              icon: 'error'
          });
      }
      if (!nickname) {
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

      wx.showLoading({
          title: '正在注册',
          mask: true
      });

      // 上传头像
      wx.uploadFile({
          url: 'https://lzuer.mynatapp.cc/SRJC/avatar/',
          filePath: avatar,
          name: 'avatar',
          success: res => {
              console.log('头像上传成功', res);
              const data = JSON.parse(res.data);
              const fileID = data.fileID;

              // 提交昵称和其他信息
              wx.request({
                  url: 'https://lzuer.mynatapp.cc/SRJC/register/',
                  method: 'POST',
                  data: {
                      nickName: nickname,
                      phone: phone
                  },
                  success: res => {
                      wx.hideLoading();
                      console.log('用户信息提交成功', res);

                      // 更新页面显示
                      this.setData({
                          userInfo: {
                              avatarUrl: fileID,
                              nickName: nickname,
                              points: 0, // 积分
                              level: 'Lv0' // 等级
                          },
                          showModal: false
                      });
                      wx.setStorageSync('user', this.data.userInfo);

                      wx.showToast({
                          title: '注册成功',
                          icon: 'success'
                      });
                  },
                  fail: err => {
                      wx.hideLoading();
                      console.log('用户信息提交失败', err);
                      wx.showToast({
                          title: '信息提交失败',
                          icon: 'error'
                      });
                  }
              });
          },
          fail: err => {
              wx.hideLoading();
              console.log('头像上传失败', err);
              wx.showToast({
                  title: '头像上传失败',
                  icon: 'error'
              });
          }
      });
  },

  // 选择头像
  chooseAvatar() {
      wx.chooseImage({
          count: 1,
          success: res => {
              const tempFilePath = res.tempFilePaths[0];
              this.setData({
                  avatar: tempFilePath
              });
          }
      });
  },

  // 隐藏模态框
  hideModal() {
      this.setData({
          showModal: false
      });
  }
});
