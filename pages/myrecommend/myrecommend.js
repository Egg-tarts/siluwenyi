// pages/community/community.js
Page({
  data: {
    text: '',
    images: [],
    text_big: ''
  },

  bindTextInput: function(e) {
    this.setData({
      text: e.detail.value
    });
  },

  bindTitleInput: function(e) {
    this.setData({
      text_big: e.detail.value
    });
  },

  chooseImage: function() {
    let that = this;
    wx.showActionSheet({
      itemList: ['拍摄', '从相册选择'],
      success: function(res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.takePhoto();
          } else if (res.tapIndex == 1) {
            that.chooseFromAlbum();
          }
        }
      }
    });
  },

  takePhoto: function() {
    let that = this;
    wx.chooseImage({
      sourceType: ['camera'],
      success: function(res) {
        let newImages = that.data.images.concat(res.tempFilePaths);
        that.setData({
          images: newImages
        });
      }
    });
  },

  chooseFromAlbum: function() {
    let that = this;
    wx.chooseImage({
      sourceType: ['album'],
      success: function(res) {
        let newImages = that.data.images.concat(res.tempFilePaths);
        that.setData({
          images: newImages
        });
      }
    });
  },

  publish: function() {
    let that = this;
    let images = this.data.images;
    let uploadTasks = images.map((path, index) => {
      return wx.uploadFile({
        url: 'https://lzuer.mynatapp.cc/SRJC/recommendations/',
        filePath: path,
        name: `image${index + 1}`
      });
    });

    Promise.all(uploadTasks).then(results => {
      let imageUrls = results.map(result => JSON.parse(result.data).url);
      const app = getApp();
      const token = app.globalData.token;
      wx.request({
        url: 'https://lzuer.mynatapp.cc/SRJC/recommendations/',
        method: 'POST',
        header: {
          'Authorization': `Bearer ${token}` // 使用全局 token
        },
        data: {
          text: that.data.text,
          images: imageUrls,
          text_big: that.data.text_big
        },
        success: function(res) {
          wx.showToast({
            title: '发布成功',
            icon: 'success'
          });
          wx.navigateBack({
            delta: 1
          });
        }
      });
    });
  }
});
