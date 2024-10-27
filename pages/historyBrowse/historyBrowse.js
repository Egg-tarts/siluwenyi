Page({
  data: {
    user: {},
    historyItems: [],  // 修改为 historyItems
    loading: false,
    hasContent: false,
    hasMore: true,
  },

  onLoad() {
    this.fetchUserInfo();
    this.fetchHistoryItems();  // 修改为 fetchHistoryItems
  },

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

  fetchHistoryItems() {  // 修改为 fetchHistoryItems
    if (this.data.loading || !this.data.hasMore) return;

    this.setData({ loading: true });
    const token = wx.getStorageSync('token');
    wx.request({
      url: 'https://lzuer.mynatapp.cc/SRJC/myairoutes/',
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`
      },
      success: res => {
        const historyItems = res.data.historyItems;  // 修改为 historyItems
        this.setData({
          historyItems: this.data.historyItems.concat(historyItems),
          hasContent: historyItems.length > 0,
          hasMore: res.data.hasMore,
          loading: false
        });
      },
      fail: () => {
        this.setData({ loading: false });
        wx.showToast({ title: '加载失败', icon: 'none' });
      }
    });
  },

  viewHistoryItem(e) {  // 修改为 viewHistoryItem
    const itemId = e.currentTarget.dataset.itemId;
    wx.navigateTo({
      url: `/pages/item-detail/item-detail?id=${itemId}`
    });
  },

  exploreMore() {
    wx.navigateTo({
      url: '/pages/explore/explore'
    });
  },

  onRefresh() {
    this.setData({
      historyItems: [],  // 修改为 historyItems
      hasMore: true
    });
    this.fetchHistoryItems();  // 修改为 fetchHistoryItems
  },

  loadMore() {
    if (this.data.hasMore) {
      this.fetchHistoryItems();  // 修改为 fetchHistoryItems
    }
  }
});
