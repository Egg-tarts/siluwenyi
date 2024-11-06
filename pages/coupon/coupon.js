// pages/index/index.js
Page({
  data: {
    coupons: [],
    loading: false,
    filterType: 'all'
  },
  onLoad: function() {
    this.fetchCoupons();
  },
  fetchCoupons: function() {
    this.setData({ loading: true });
    // 模拟异步请求获取优惠券数据
    setTimeout(() => {
      this.setData({
        coupons: [
          {
            id: '1',
            title: '敦煌莫高窟门票优惠',
            description: '探索千年艺术宝库，享受文化之旅',
            conditions: '满200减50',
            expiry: '2024-12-31',
            image: 'https://img.picui.cn/free/2024/11/05/672a400795bd1.png',
            type: 'sightseeing' // 分类：观光
          },
          {
            id: '2',
            title: '张掖丹霞地貌门票折扣',
            description: '领略自然奇观，感受地质魅力',
            conditions: '满150减30',
            expiry: '2024-11-30',
            image: 'https://img.picui.cn/free/2024/11/05/672a4007a1ef6.png',
            type: 'sightseeing' // 分类：观光
          },
          {
            id: '3',
            title: '兰州牛肉面免费升级',
            description: '品尝地道兰州牛肉面，享受免费升级',
            conditions: '消费满30元免费升级',
            expiry: '2024-10-31',
            image: 'https://img.picui.cn/free/2024/11/05/672a400cc2587.png',
            type: 'food' // 分类：美食
          },
          {
            id: '4',
            title: '嘉峪关长城门票减免',
            description: '登临长城，感受历史的厚重',
            conditions: '满100减20',
            expiry: '2024-09-30',
            image: 'https://img.picui.cn/free/2024/11/05/672a400c7e015.png',
            type: 'sightseeing' // 分类：观光
          },
          {
            id: '5',
            title: '天水麦积山石窟半价',
            description: '探访佛教艺术宝地，享受半价优惠',
            conditions: '半价优惠',
            expiry: '2024-08-31',
            image: 'https://img.picui.cn/free/2024/11/05/672a400b6b0e7.png',
            type: 'culture' // 分类：文化
          },
          {
            id: '6',
            title: '兰州黄河风情线游船体验',
            description: '乘船游览黄河，体验兰州风情',
            conditions: '买一送一',
            expiry: '2024-07-31',
            image: 'https://img.picui.cn/free/2024/11/06/672a44d43aaa0.png',
            type: 'sightseeing' // 分类：观光
          },
          {
            id: '7',
            title: '甘南藏族自治州民俗体验',
            description: '深入了解藏族文化，体验民俗活动',
            conditions: '满100减20',
            expiry: '2024-06-30',
            image: 'https://img.picui.cn/free/2024/11/06/672a44d4e6143.png',
            type: 'culture' // 分类：文化
          },
          {
            id: '8',
            title: '武威雷台汉墓门票优惠',
            description: '探索古代汉墓，感受历史的沉淀',
            conditions: '满80减15',
            expiry: '2024-05-31',
            image: 'https://img.picui.cn/free/2024/11/06/672a44d4b61a9.png',
            type: 'culture' // 分类：文化
          },
          {
            id: '9',
            title: '平凉崆峒山门票半价',
            description: '登山望远，体验道教文化',
            conditions: '半价优惠',
            expiry: '2024-04-30',
            image: 'https://img.picui.cn/free/2024/11/06/672a44d43b485.png',
            type: 'sightseeing' // 分类：观光
          },
          {
            id: '10',
            title: '白银景泰黄河石林门票折扣',
            description: '观赏奇特的石林地貌，感受自然的力量',
            conditions: '满120减25',
            expiry: '2024-03-31',
            image: 'https://img.picui.cn/free/2024/11/06/672a44d4d8003.png',
            type: 'sightseeing' // 分类：观光
          }
          // ... 更多优惠券数据
        ],
        loading: false
      });
    }, 1000);
  },
  filterCoupons: function(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ filterType: type });
    // 根据类型过滤优惠券
    const filteredCoupons = this.data.coupons.filter(coupon => {
      return type === 'all' || coupon.type === type;
    });
    this.setData({ coupons: filteredCoupons });
  },
  viewDetails: function(e) {
    const id = e.currentTarget.dataset.id;
    // 跳转到优惠券详情页面
    wx.navigateTo({
      url: `/details/details?id=${id}`
    });
  },
  claimCoupon: function(e) {
    const id = e.currentTarget.dataset.id;
    // 领取优惠券的逻辑
    wx.showToast({
      title: '领取成功',
      icon: 'success',
      duration: 2000
    });
    // 更新优惠券列表
    const updatedCoupons = this.data.coupons.map(coupon => {
      if (coupon.id === id) {
        return { ...coupon, claimed: true };
      }
      return coupon;
    });
    this.setData({ coupons: updatedCoupons });
  }
});