Page({
  data: {
    text: '',
    images: [], // 存储用户选择的图片路径
    head_txt: '',
    avatarUrl: ''
  },

  bindTextInput: function(e) {
    this.setData({
      text: e.detail.value
    }, () => { console.log(this.data.text) });
  },

  bindTitleInput: function(e) {
    this.setData({
      head_txt: e.detail.value
    }, () => { console.log(this.data.head_txt) });
  },

  choosepicture() {
    wx.chooseImage({
      count: 1, // 允许选择一张图片
      success: (res) => {
        const tempFilePaths = res.tempFilePaths;
        this.setData({
          images: [...this.data.images, ...tempFilePaths] // 将新选择的图片路径添加到 images 数组中
        }, () => {
          console.log(this.data.images); // 输出选择的图片路径
        });
      }
    });
  },
  publish: function() {
    const app = getApp();
    const images = this.data.images;
    const text = this.data.text;
    const head_txt = this.data.head_txt;

    // 上传图片的函数
    const uploadImage = (index) => {
        if (index >= images.length) {
            // 所有图片上传完毕后，提交文本数据
            wx.request({
                url: 'https://lzuer.mynatapp.cc/SRJC/recommendations/', // 替换为你的发布接口
                method: 'POST',
                header: {
                    Authorization: 'Token ' + app.globalData.token,
                },
                data: {
                    text: text,
                    head_txt: head_txt
                },
                success: function(res) {
                    console.log(res);
                    wx.showToast({
                        title: '发布成功',
                        icon: 'success'
                    });
                    wx.navigateBack({
                        delta: 1
                    });
                },
                fail: function(err) {
                    console.error('请求失败:', err);
                    wx.showToast({
                        title: '发布失败',
                        icon: 'none'
                    });
                }
            });
            return;
        }

        const imagePath = images[index];
        wx.uploadFile({
            url: 'https://lzuer.mynatapp.cc/SRJC/recommendations/', // 替换为你的图片上传接口
            filePath: imagePath,
            name: `images${index + 1}`,
            formData: {
                text: text,
                head_txt: head_txt
            },
            header: {
                Authorization: 'Token ' + app.globalData.token,
            },
            success: function(res) {
                console.log(`图片${index + 1}上传成功`, res);
                uploadImage(index + 1); // 上传下一张图片
            },
            fail: function(err) {
                console.error(`图片${index + 1}上传失败`, err);
                wx.showToast({
                    title: '图片上传失败',
                    icon: 'none'
                });
            }
        });
    };

    uploadImage(0); // 从第一张图片开始上传
}


});
