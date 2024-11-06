Page({
  data: {
    categories: [
      { name: '生活用品', color: '#f9e79f' },
      { name: '节日用品', color: '#f5d56e' },
      { name: '其他礼品', color: '#f0c14b' },
      { name: '特色商品', color: '#e6af3c' },
      { name: '鲜花礼品', color: '#d9a12d' }
    ],
    products: [
      { id: 1, name: '工夫茶套装', needs: 88, points: 88, image: 'https://img.picui.cn/free/2024/11/05/672a348282a40.png', category: '生活用品' },
      { id: 2, name: '茶杯礼盒套装', needs: 100, points: 500, image: 'https://img.picui.cn/free/2024/11/05/672a348325011.png', category: '生活用品' },
      { id: 3, name: '电热水壶', needs: 150, points: 150, image: 'https://img.picui.cn/free/2024/11/05/672a348282a40.png', category: '生活用品' },
      { id: 4, name: '毛巾套装', needs: 120, points: 120, image: 'https://img.picui.cn/free/2024/11/05/672a3483d10fe.png', category: '生活用品' },
      { id: 5, name: '洗衣液', needs: 200, points: 200, image: 'https://img.picui.cn/free/2024/11/05/672a34824a2de.png', category: '生活用品' },
      { id: 6, name: '春节对联', needs: 50, points: 50, image: 'https://img.picui.cn/free/2024/11/05/672a399a86a9f.png', category: '节日用品' },
      { id: 7, name: '灯笼', needs: 80, points: 80, image: 'https://img.picui.cn/free/2024/11/05/672a399c11dc4.png', category: '节日用品' },
      { id: 8, name: '节日装饰', needs: 100, points: 100, image: 'https://img.picui.cn/free/2024/11/05/672a399a2f338.png', category: '节日用品' },
      { id: 9, name: '节日贺卡', needs: 30, points: 30, image: 'https://img.picui.cn/free/2024/11/05/672a399b8ff1b.png', category: '节日用品' },
      { id: 10, name: '节日花束', needs: 200, points: 200, image: 'https://img.picui.cn/free/2024/11/05/672a399b2876c.png', category: '节日用品' },
      { id: 11, name: '茶壶礼包', needs: 190, points: 190, image: 'path/to/image11', category: '其他礼品' },
      { id: 12, name: '坚果大礼包', needs: 250, points: 10, image: 'path/to/image12', category: '其他礼品' },
      { id: 13, name: '家团周大礼包', needs: 380, points: 380, image: 'image13', category: '其他礼品' },
      { id: 14, name: '阿姣', needs: 380, points: 380, image: 'path/to/image14', category: '其他礼品' },
      { id: 15, name: '鲜花兑换', needs: 150, points: 150, image: 'path/to/image15', category: '其他礼品' },
      { id: 16, name: '甘肃特色杯具', needs: 200, points: 200, image: 'path/to/image16', category: '特色商品' },
      { id: 17, name: '兰与茶代金券', needs: 50, points: 50, image: 'path/to/image17', category: '特色商品' },
      { id: 18, name: '敦煌壁画复制品', needs: 300, points: 300, image: 'path/to/image18', category: '特色商品' },
      { id: 19, name: '兰州牛肉面体验券', needs: 100, points: 100, image: 'path/to/image19', category: '特色商品' },
      { id: 20, name: '甘肃特色手工艺品', needs: 150, points: 150, image: 'path/to/image20', category: '特色商品' },
      { id: 21, name: '鲜花礼盒', needs: 180, points: 180, image: 'path/to/image21', category: '鲜花礼品' },
      { id: 22, name: '永生花', needs: 220, points: 220, image: 'path/to/image22', category: '鲜花礼品' },
      { id: 23, name: '花束', needs: 120, points: 120, image: 'path/to/image23', category: '鲜花礼品' },
      { id: 24, name: '盆栽植物', needs: 100, points: 100, image: 'path/to/image24', category: '鲜花礼品' },
      { id: 25, name: '干花装饰', needs: 150, points: 150, image: 'path/to/image25', category: '鲜花礼品' }
    ],
    currentCategory: '生活用品',
    currentCategoryProducts: []
  },

  onLoad: function() {
    this.updateCurrentCategoryProducts();
  },

  updateCurrentCategoryProducts: function() {
    const currentCategory = this.data.currentCategory;
    const currentCategoryProducts = this.data.products.filter(product => product.category === currentCategory);
    this.setData({ currentCategoryProducts });
  },

  onChangeCategory: function(e) {
    const index = e.currentTarget.dataset.id;
    const category = this.data.categories[index].name;
    this.setData({ currentCategory: category });
    this.updateCurrentCategoryProducts();
  }
});
