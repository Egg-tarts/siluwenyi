const contentStore = require('../../utils/contentStore')

Page({
  data: {
    user: {
      avatarUrl: 'https://free.picui.cn/free/2026/06/21/6a37a7e8168bf.png',
      name: '丝路旅人'
    },
    posts: [],
    comments: [],
    loading: false,
    hasContent: false,
    hasMore: false
  },

  onLoad() {
    this.loadComPosts()
  },

  onShow() {
    this.loadComPosts()
  },

  loadComPosts() {
    this.setData({ loading: true })
    const comments = contentStore.getMyComments()
    const posts = comments.map(item => ({
      from_id: item.from_id,
      comment_detail: item.comment_detail,
      from_title: item.from_title,
      time: item.created_at
    }))

    this.setData({
      posts,
      comments,
      hasContent: posts.length > 0,
      loading: false,
      hasMore: false
    })
  },

  viewPost(e) {
    const postId = e.currentTarget.dataset.postId
    wx.navigateTo({
      url: `/pages/detail/detail?id=${postId}`
    })
  },

  createPost() {
    wx.navigateTo({
      url: '/pages/community/community'
    })
  },

  onRefresh() {
    this.loadComPosts()
  },

  loadMore() {
    wx.showToast({
      title: '已经到底了哦',
      icon: 'none'
    })
  }
})
