Page({
  data: {
    user: {},
    posts: [],
    recommendations: [], // 新增推荐内容的数据
    loading: false,
    hasContent: false,
    hasRecommendations: false, // 判断是否有推荐内容
    hasMore: true,
  },

  onLoad() {
    this.fetchUserInfo();
    this.loadPosts();  // 原有的加载发布内容方法
    this.loadRecommendations(); // 新增加载推荐内容的方法
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

  // 加载发布内容
  loadPosts() {
    if (this.data.loading || !this.data.hasMore) return;

    this.setData({ loading: true });
    const token = wx.getStorageSync('token');
    wx.request({
      url: 'https://lzuer.mynatapp.cc/SRJC/mycomments/',
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

  // 加载推荐内容
  loadRecommendations() {
    if (this.data.loading || !this.data.hasMore) return;

    this.setData({ loading: true });
    const token = wx.getStorageSync('token');
    wx.request({
      url: 'https://lzuer.mynatapp.cc/SRJC/myrecommendations/',
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`
      },
      success: res => {
        const recommendations = res.data.recommendations;
        this.setData({
          recommendations: this.data.recommendations.concat(recommendations),
          hasRecommendations: recommendations.length > 0,
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

  // 点赞推荐内容
  likePost(e) {
    const postId = e.currentTarget.dataset.postId;
    wx.request({
      url: `https://lzuer.mynatapp.cc/SRJC/like/${postId}`,
      method: 'POST',
      header: {
        'Authorization': `Bearer ${wx.getStorageSync('token')}`
      },
      success: res => {
        if (res.statusCode === 200) {
          wx.showToast({
            title: '点赞成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 下拉刷新
  onRefresh() {
    this.setData({
      posts: [],
      recommendations: [], // 重置推荐内容
      hasMore: true
    });
    this.loadPosts();
    this.loadRecommendations(); // 重新加载推荐内容
  },

  // 加载更多
  loadMore() {
    if (this.data.hasMore) {
      this.loadPosts();
      this.loadRecommendations(); // 加载更多推荐内容
    }
  }
});

