Page({
  data: {
    user: {},
    posts: [],
    loading: false,
    hasContent: false,
    hasMore: true,
  },

  onLoad() {
    this.fetchUserInfo();
    this.loadPosts();
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

  // 点击查看发布内容
  viewPost(e) {
    const postId = e.currentTarget.dataset.postId;
    wx.navigateTo({
      url: `/pages/post-detail/post-detail?id=${postId}`
    });
  },

  // 创建新发布
  createPost() {
    wx.navigateTo({
      url: '/pages/create-post/create-post'
    });
  },

  // 下拉刷新
  onRefresh() {
    this.setData({
      posts: [],
      hasMore: true
    });
    this.loadPosts();
  },

  // 加载更多
  loadMore() {
    if (this.data.hasMore) {
      this.loadPosts();
    }
  }
});
