Component({
  data:{
    active: 1 // 初始选中的按钮索引
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
          iconPath:"/pages/images/community.png",
          selectedIconPath:"/pages/images/community.png",
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
  methods: {
      goToMain: function(e) {
        wx.redirectTo({
          url:'/pages/homepage/homepage',
        })
        const index = parseInt(e.currentTarget.dataset.index, 10);
    this.setData({
      active: index,
    });

        
      },
      goToTeams: function(e) {
        wx.redirectTo({
          url:'/pages/community/community',
        })
        const index = parseInt(e.currentTarget.dataset.index, 10);
        this.setData({
          active: index,
        });
        

      },
      goToPersonal: function(e) {
        wx.redirectTo({
          url:'/pages/test/test',
        })
        const index = parseInt(e.currentTarget.dataset.index, 10);
        this.setData({
          active: index,
        });
        
      }
  }
})
