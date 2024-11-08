Page({
  data: {},

  formSubmit: function(e) {
    const app = getApp();
    const token = app.globalData.token;
    const formData = e.detail.value;
    const combinedMessage = `根据之前的行程进行推荐: ${formData.recommendation ? '是' : '否'},我要去游玩的天数是: ${formData.cities}，我偏好的旅游整体预算是: ${formData.accommodation},我喜欢以下类型的景点: ${formData.scenery ? formData.scenery.join(', ') : ''}，出行人员的年龄有: ${formData.age1}。请你根据以上的信息为我推荐一个旅游的地方,要求精确到确定的饭店，以及价格，还有景点确定的游玩时间，以及他们的经纬度。`;
 
    wx.request({
      url: 'https://lzuer.mynatapp.cc/SRJC/ai/', // 替换成你的后端API地址
      method: 'POST',
      header: {
        Authorization: 'Token 7384d57763633082c097d4c6a2ee3bac13412ca0',
      },
      data: {
        combinedMessage: combinedMessage
      },
      success: function(res) {
        console.log(res.data.answer);
        app.globalData.answer = res.data.answer;
        console.log(app.globalData.answer)
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        });
        console.log(1)
        // 提交成功后跳转到目标页面，并传递获取到的 answer 数据
        wx.navigateTo({
          url: '/pages/map/map',
          success: function() {
            console.log('成功跳转到 map 页面');
          },
          fail: function(err) {
            console.error('跳转失败:', err);
          }
        });
        
      },
      fail: function(err) {
        wx.showToast({
          title: '提交失败',
          icon: 'none',
          duration: 2000
        });
      }
    });

  },


});
