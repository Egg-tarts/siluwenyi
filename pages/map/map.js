Page({
  data: {
    latitude: 36.0611, // 甘肃省的中心纬度
    longitude: 103.8343, // 甘肃省的中心经度
    markers: [], // 初始化标志点为空
    polylines: [] // 初始化连接线为空
  },

  onLoad: function (options) {
    const that = this;

    // 接收传递过来的数据
    const answer = decodeURIComponent("根据您的需求，我为您推荐甘肃省内的旅游目的地：兰州市。以下是一份详细的行程安排：\n\n## 第一天\n\n### 景点推荐\n\n1. **甘肃博物馆**（位于兰州市）\n - 经纬度：103.8293°E, 36.0574°N\n\n2. **兰州水车博物馆**（位于兰州市）\n - 经纬度：103.8333°E, 36.0611°N\n\n### 第二天\n\n### 景点推荐\n\n1. **白塔山公园**（位于兰州市）\n - 经纬度：103.8275°E, 36.0625°N\n\n2. **黄河风情园**（位于兰州市）\n - 经纬度：103.7350°E, 36.0600°N\n");

    // 正则表达式提取经纬度信息
    const regex = /经纬度：([\d.-]+)°[EW],\s*([\d.-]+)°[NS]/g;
    let match;
    const markers = [];
    const coordinates = []; // 用于存储经纬度坐标
    let id = 0;

    // 使用正则表达式从 answer 中提取经纬度信息
    while ((match = regex.exec(answer)) !== null) {
      const longitude = parseFloat(match[1]);
      const latitude = parseFloat(match[2]);

      // 创建标记点
      markers.push({
        id: id++,
        iconPath: "../images/1.png",
        latitude: latitude,
        longitude: longitude,
        width: 28,
        height: 32
      });

      // 存储坐标
      coordinates.push({ latitude: latitude, longitude: longitude });
    }

    // 更新地图上的标记
    that.setData({
      markers: markers,
      polylines: [{
        points: coordinates,
        color: "#FF0000DD", // 线的颜色
        width: 2, // 线的宽度
        dottedLine: false // 是否为虚线
      }]
    });

    // 获取当前位置信息
    wx.getLocation({
      type: "wgs84",
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        });
      }
    });
  },

  // 添加确认行程按钮的事件处理函数
  confirmRoute: function () {
    wx.navigateTo({
      url: `/pages/touring/touring`,
    });
    wx.showToast({
      title: '行程已确认',
      icon: 'success',
      duration: 2000
    });
  }
});
