const contentStore = require('../../utils/contentStore')

Page({
  data: {
    user: {
      avatarUrl: 'https://free.picui.cn/free/2026/06/21/6a37a7e8168bf.png',
      name: '丝路旅人'
    },
    posts: [],
    post: [],
    loading: false,
    hasContent: false,
    hasMore: false
  },

  onLoad() {
    this.loadPostPosts()
  },

  onShow() {
    this.loadPostPosts()
  },

  loadPostPosts() {
    this.setData({ loading: true })
    const posts = contentStore.getMyPosts()
    const profileUser = contentStore.getProfileUser()
    const isNamedUser = profileUser && profileUser.loggedIn && !profileUser.isGuest

    this.setData({
      user: {
        avatarUrl: profileUser.avatarUrl,
        name: isNamedUser ? profileUser.nickName : (profileUser.isGuest ? '游客旅人' : '丝路旅人')
      },
      posts,
      post: posts,
      hasContent: posts.length > 0,
      loading: false,
      hasMore: false
    })
  },

  viewPost(e) {
    const postId = e.currentTarget.dataset.postId
    wx.navigateTo({
      url: `/pages/community/community?openPost=${postId}`
    })
  },

  createPost() {
    wx.navigateTo({
      url: '/pages/myrecommend/myrecommend'
    })
  },

  onRefresh() {
    this.loadPostPosts()
  },

  loadMore() {
    wx.showToast({
      title: '已经到底了哦',
      icon: 'none'
    })
  }
})
