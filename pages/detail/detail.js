const contentStore = require('../../utils/contentStore')

Page({
  data: {
    id: '1',
    dataItem: null,
    comment: '',
    like: 0,
    likeIcon: '/pages/images/love_unfull.png'
  },

  onLoad(options) {
    const id = options.id || '1'
    this.loadDetail(id)
  },

  loadDetail(id) {
    const dataItem = contentStore.getDetail(id)
    const liked = contentStore.isLiked(id)

    this.setData({
      id,
      dataItem,
      like: liked ? 1 : 0,
      likeIcon: liked ? '/pages/images/love_full.png' : '/pages/images/love_unfull.png'
    })
  },

  onCommentInput(e) {
    this.setData({
      comment: e.detail.value
    })
  },

  onInputComment() {
    const comment = this.data.comment.trim()

    if (!comment) {
      wx.showToast({
        title: '先写一点内容吧',
        icon: 'none'
      })
      return
    }

    const comments = contentStore.saveComment(this.data.id, comment)
    this.setData({
      comment: '',
      'dataItem.comments': comments
    })

    wx.showToast({
      title: '评论已发布',
      icon: 'success'
    })
  },

  onLike() {
    const liked = contentStore.toggleLike(this.data.id)

    this.setData({
      like: liked ? 1 : 0,
      likeIcon: liked ? '/pages/images/love_full.png' : '/pages/images/love_unfull.png'
    })
    wx.showToast({
      title: liked ? '已点赞' : '已取消',
      icon: 'none'
    })
  },

  onCommentLike(e) {
    const commentId = e.currentTarget.dataset.id
    const comments = contentStore.toggleCommentLike(this.data.id, commentId)
    this.setData({
      'dataItem.comments': comments
    })
  },

  onCommentReply(e) {
    const commentId = e.currentTarget.dataset.id
    const comments = contentStore.addCommentReply(this.data.id, commentId)
    this.setData({
      'dataItem.comments': comments
    })
    wx.showToast({
      title: '已回复',
      icon: 'success'
    })
  },

  navigateBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack()
      return
    }
    wx.navigateTo({
      url: '/pages/community/community'
    })
  }
})
