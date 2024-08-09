Component({
  data: {
    active: 0 // 初始选中的按钮索引
  },
  properties: {
    list: {
      type: Array,
      value: [
        {
          text: 'i',
          iconPath: "/pages/images/travel.png",
          selectedIconPath: "/pages/images/travel.png",
        },
        {
          text: 'g',
          iconPath: "/pages/images/community.png",
          selectedIconPath: "/pages/images/community.png",
        },
        {
          text: 'p',
          iconPath: "/pages/images/personal.png",
          selectedIconPath: "/pages/images/personal.png",
        }
      ]
    },
    current: {
      type: Number,
      value: 0
    }
  },
  lifetimes: {
    attached: function() {
      // 在组件加载时，从全局对象中读取 active 的值
      const app = getApp();
      this.setData({
        active: app.globalData.activeIndex
      });
    }
  },
  methods: {
    goToMain: function(e) {
      const index = parseInt(e.currentTarget.dataset.index, 10);
      // 更新全局对象中的 activeIndex
      const app = getApp();
      app.globalData.activeIndex = index;
      wx.redirectTo({
        url: '/pages/touring/touring',
      });
      this.setData({
        active: index,
      });
    },
    goToTeams: function(e) {
      const index = parseInt(e.currentTarget.dataset.index, 10);
      // 更新全局对象中的 activeIndex
      const app = getApp();
      app.globalData.activeIndex = index;
      wx.redirectTo({
        url: '/pages/community/community',
      });
      this.setData({
        active: index,
      });
    },
    goToPersonal: function(e) {
      const index = parseInt(e.currentTarget.dataset.index, 10);
      // 更新全局对象中的 activeIndex
      const app = getApp();
      app.globalData.activeIndex = index;
      wx.redirectTo({
        url: '/pages/profile/profile',
      });

      this.setData({
        active: index,
      });
    }
  }
});