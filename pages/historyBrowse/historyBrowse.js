Page({
  data: {
    user: {},
    favorites: [],
    loading: false,
    hasContent: false,
    hasMore: true,
  },

  onLoad() {
    this.fetchUserInfo();
    this.loadFavorites();
  },

  // 获取用户信息
  fetchUserInfo() {
    const token = wx.getStorageSync('token');
    wx.request({
      url: 'https://lzuer.mynatapp.cc/SRJC/getinfo/',
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`
      },
      success: res => {
        this.setData({
          user: res.data.user
        });
      }
    });
  },

  // 加载喜欢的内容
  loadFavorites() {
    if (this.data.loading || !this.data.hasMore) return;

    this.setData({ loading: true });
    const token = wx.getStorageSync('token');
    wx.request({
      url: 'https://lzuer.mynatapp.cc/SRJC/mylikes/',
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`
      },
      success: res => {
        const favorites = res.data.favorites;
        this.setData({
          favorites: this.data.favorites.concat(favorites),
          hasContent: favorites.length > 0,
          hasMore: res.data.hasMore,
          loading: false
        });
      }
    });
  },

  // 点击查看喜欢的内容
  viewItem(e) {
    const itemId = e.currentTarget.dataset.itemId;
    wx.navigateTo({
      url: `/pages/item-detail/item-detail?id=${itemId}`
    });
  },

  // 探索更多内容
  exploreMore() {
    wx.navigateTo({
      url: '/pages/explore/explore'
    });
  },

  // 下拉刷新
  onRefresh() {
    this.setData({
      favorites: [],
      hasMore: true
    });
    this.loadFavorites();
  },

  // 加载更多
  loadMore() {
    if (this.data.hasMore) {
      this.loadFavorites();
    }
  }
});
