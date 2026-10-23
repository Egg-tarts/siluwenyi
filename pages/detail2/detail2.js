Page({
  data: {
    showScheduleTab: true, // 控制显示行程安排还是美食安排
    travelPlans: [] // 存储每一天提取的数据
  },

  onLoad() {
    const applyRoute = (data) => {
      const route = data && data.answer ? data : this.getDefaultRoute()
      const travelPlans = this.parseTravelData(route.answer)
      this.setData({ travelPlans })
    }

    const eventChannel = this.getOpenerEventChannel && this.getOpenerEventChannel()
    if (eventChannel && eventChannel.on) {
      eventChannel.on('routeData', applyRoute)
      setTimeout(() => {
        if (!this.data.travelPlans.length) applyRoute()
      }, 300)
      return
    }

    applyRoute()
  },

  // 切换显示行程安排
  showSchedule() {
    this.setData({ showScheduleTab: true });
  },

  // 切换显示美食安排
  showRestaurants() {
    this.setData({ showScheduleTab: false });
  },

  // 解析行程数据
  parseTravelData(rawData) {
    const daysData = rawData.split(/第[一二三四五六七八九十\d]+天/).filter((day) => day.trim() !== "");
    return daysData.map((day, index) => {
      const attractionMatch = day.match(/景点名称:\s*(.+?)\s*(?=经纬度)/);
      const transportMatch = day.match(/交通方式:\s*([^\n]+)/);
      const restaurantsMatch = day.match(/餐馆推荐:([\s\S]*)/);
      const restaurants = [];
      if (restaurantsMatch) {
        const restaurantLines = restaurantsMatch[1].trim().split(/\d\.\s+/).filter((line) => line.trim() !== "");
        restaurantLines.forEach((line) => {
          const [name, address] = line.split(/\s+地址：/);
          if (name && address) {
            restaurants.push({ name: name.trim(), address: address.trim() });
          }
        });
      }
      return {
        attraction: attractionMatch ? attractionMatch[1].trim() : "甘肃丝路慢游",
        transport: transportMatch ? transportMatch[1].trim() : "高铁/步行结合",
        restaurants,
      };
    });
  },

  getDefaultRoute() {
    return {
      answer: [
        '丝路问驿路线方案（三天）',
        '第1天',
        '景点名称: 甘肃省博物馆',
        '经纬度: 36.0672° N, 103.7489° E',
        '交通方式: 高铁/步行结合',
        '餐馆推荐:',
        '1. 马子禄牛肉面 地址：兰州核心游览区附近',
        '第2天',
        '景点名称: 张掖七彩丹霞',
        '经纬度: 38.9473° N, 100.0641° E',
        '交通方式: 高铁/包车结合',
        '餐馆推荐:',
        '1. 甘州特色小吃街 地址：张掖核心游览区附近'
      ].join('\n')
    }
  }
});
