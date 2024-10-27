Page({
  data: {
    user: {},
    posts: [],
    recommendations: [],
    loading: false,
    hasContent: false,
    hasRecommendations: false,
    hasMore: true,
  },

  onLoad() {
    this.fetchUserInfo();
    this.loadLikedPosts(); // 修改为加载已喜欢的内容
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

  // 加载已喜欢的内容
  loadLikedPosts() {
    if (this.data.loading || !this.data.hasMore) return;

    this.setData({ loading: true });
    const token = wx.getStorageSync('token');
    wx.request({
      url: 'https://lzuer.mynatapp.cc/SRJC/myfavorites/', // 修改为获取已喜欢内容的接口
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`
      },
      success: res => {
        const posts = res.data.posts;
        this.setData({
          posts: this.data.posts.concat(posts),
          hasContent: posts.length > 0,
          hasMore: res.data.hasMore,
          loading: false
        });
      }
    });
  },

  // 查看发布详情
  viewPost(e) {
    const postId = e.currentTarget.dataset.postId;
    wx.navigateTo({
      url: `/pages/post-detail/post-detail?id=${postId}`
    });
  },

  // 取消喜欢内容
  unlikePost(e) {
    const postId = e.currentTarget.dataset.postId;
    wx.request({
      url: `https://lzuer.mynatapp.cc/SRJC/unlike/${postId}`, // 修改为取消喜欢的接口
      method: 'POST',
      header: {
        'Authorization': `Bearer ${wx.getStorageSync('token')}`
      },
      success: res => {
        if (res.statusCode === 200) {
          wx.showToast({
            title: '取消成功',
            icon: 'success'
          });
          this.loadLikedPosts(); // 更新已喜欢内容列表
        }
      }
    });
  },

  // 下拉刷新
  onRefresh() {
    this.setData({
      posts: [],
      hasMore: true
    });
    this.loadLikedPosts(); // 重新加载已喜欢内容
  },

  // 加载更多
  loadMore() {
    if (this.data.hasMore) {
      this.loadLikedPosts(); // 加载更多已喜欢内容
    }
  }
});
