Page({
  data: {
    currentTab: 'scenic', // 默认激活的按钮
    buttonListleft: [
      {
        text_big : '莫高窟',
        text_normal:'不是看死了一千年的标本，而是看活了一千年的生命',
        star: Array(5).fill('/pages/images/star.png'),
        popular: "热门",
        money: '￥ 成人120/学生65',
        image: '/pages/images/6.jpg',
        url: 'page1',
      },
      {
        text_big : '莫高窟',
        text_normal:'不是看死了一千年的标本，而是看活了一千年的生命',
        star: Array(5).fill('/pages/images/star.png'),
        popular: "热门",
        money: '￥ 成人120/学生65',
        image: '/pages/images/6.jpg',
        url: 'page2'
      },
      {
        text_big : '莫高窟',
        text_normal:'不是看死了一千年的标本，而是看活了一千年的生命',
        star: Array(5).fill('/pages/images/star.png'),
        popular: "热门",
        money: '￥ 成人120/学生65',
        image: '/pages/images/6.jpg',
        url: '/pages/changcheng/changcheng'
      },
      {
        text_big : '嘉峪关关城',
        text_normal:'天下第一雄关',
        star: Array(5).fill('/pages/images/star.png'),
        popular: "热门",
        money: '￥ 成人55/学生45',
        image: '/pages/images/4.jpg',
        url: '/pages/yihuyuan/yihuyuan'
      },
      {
        text_big : '嘉峪关关城',
        text_normal:'天下第一雄关',
        star: Array(5).fill('/pages/images/star.png'),
        popular: "热门",
        money: '￥ 成人55/学生45',
        image: '/pages/images/4.jpg',
        url: '/pages/yihuyuan/yihuyuan'
      }, {
        text_big : '嘉峪关关城',
        text_normal:'天下第一雄关',
        star: Array(5).fill('/pages/images/star.png'),
        popular: "热门",
        money: '￥ 成人55/学生45',
        image: '/pages/images/4.jpg',
        url: '/pages/yihuyuan/yihuyuan'
      },
    ],
    buttonListright: [
      {
        text_big : '张掖七彩丹霞旅游景区',
        text_normal:'色若渥丹，灿比明霞',
        star: Array(5).fill('/pages/images/star.png'),
        popular: "热门",
        money: '￥ 成人93/学生66',
        image: '/pages/images/2.jpg',
        url: '/pages/gugong/gugong'
      },
      {
        text_big : '莫高窟',
        text_normal:'不是看死了一千年的标本，而是看活了一千年的生命',
        star: Array(5).fill('/pages/images/star.png'),
        popular: "热门",
        money: '￥ 成人120/学生65',
        image: '/pages/images/6.jpg',
        url: '/pages/changcheng/changcheng'
      },
      {
        text_big : '莫高窟',
        text_normal:'不是看死了一千年的标本，而是看活了一千年的生命',
        star: Array(5).fill('/pages/images/star.png'),
        popular: "热门",
        money: '￥ 成人120/学生65',
        image: '/pages/images/6.jpg',
        url: '/pages/changcheng/changcheng'
      },
      {
        text_big : '嘉峪关关城',
        text_normal:'天下第一雄关',
        star: Array(5).fill('/pages/images/star.png'),
        popular: "热门",
        money: '￥ 成人55/学生45',
        image: '/pages/images/4.jpg',
        url: '/pages/yihuyuan/yihuyuan'
      },
      {
        text_big : '嘉峪关关城',
        text_normal:'天下第一雄关',
        star: Array(5).fill('/pages/images/star.png'),
        popular: "热门",
        money: '￥ 成人55/学生45',
        image: '/pages/images/4.jpg',
        url: '/pages/yihuyuan/yihuyuan'
      }, {
        text_big : '嘉峪关关城',
        text_normal:'天下第一雄关',
        star: Array(5).fill('/pages/images/star.png'),
        popular: "热门",
        money: '￥ 成人55/学生45',
        image: '/pages/images/4.jpg',
        url: '/pages/yihuyuan/yihuyuan'
      },
    ]
  },
  handleButtonClickUrl(event) {
    const url = event.currentTarget.dataset.url;
    wx.navigateTo({
      url: `/pages/detail/detail?page=${url}`
    });
  },
  handleButtonClick: function(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      currentTab: type
    }, () => {
      ; 
    });
  }
});
