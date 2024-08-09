Page({
  data: {},

  formSubmit: function(e) {
    const formData = e.detail.value;
    const combinedMessage = `根据之前的行程进行推荐: ${formData.recommendation ? '是' : '否'},我要去游玩的天数是: ${formData.cities}，我偏好的旅游整体预算是: ${formData.accommodation},我喜欢以下类型的景点: ${formData.scenery ? formData.scenery.join(', ') : ''}，出行人员的年龄有: ${formData.age1}。请你根据以上的信息为我推荐一个旅游的地方,要求精确到确定的饭店，以及价格，还有景点确定的游玩时间。`;

    // 调用后端API保存数据
    wx.request({
      url: 'https://lzuer.mynatapp.cc/SRJC/test/', // 替换成你的后端API地址
      method: 'POST',
      data: {
        combinedMessage: combinedMessage
      },
      success: function(res) {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
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
  }
});
