const contentStore = require('../../utils/contentStore')

Page({
  data: {
    text: '',
    images: [],
    head_txt: '',
    user: contentStore.getProfileUser(),
    authorName: '未登录旅人',
    authorDesc: '登录后发布内容会保存记录',
    publishing: false,
    tagOptions: ['旅行笔记', '路线心得', '文博记录', '美食分享'],
    activeTag: '旅行笔记'
  },

  onShow() {
    const user = contentStore.getProfileUser()
    this.setData({
      user,
      authorName: user && user.loggedIn ? user.nickName : '未登录旅人',
      authorDesc: user && user.isGuest
        ? '游客内容会保存在本机记录'
        : (user && user.loggedIn ? '内容会同步到你的个人记录' : '请先进行游客登录后发布')
    })
  },

  goBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack()
      return
    }
    wx.reLaunch({ url: '/pages/community/community' })
  },

  bindTextInput(e) {
    this.setData({
      text: e.detail.value
    })
  },

  bindTitleInput(e) {
    this.setData({
      head_txt: e.detail.value
    })
  },

  chooseTag(e) {
    this.setData({
      activeTag: e.currentTarget.dataset.tag
    })
  },

  choosepicture() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const filePath = res.tempFilePaths && res.tempFilePaths[0]
        if (!filePath) return

        wx.saveFile({
          tempFilePath: filePath,
          success: saved => {
            this.addImage(saved.savedFilePath || filePath)
          },
          fail: () => {
            this.addImage(filePath)
          }
        })
      }
    })
  },

  addImage(path) {
    this.setData({
      images: this.data.images.concat(path).slice(0, 3)
    })
  },

  removeImage(e) {
    const index = Number(e.currentTarget.dataset.index)
    this.setData({
      images: this.data.images.filter((item, itemIndex) => itemIndex !== index)
    })
  },

  publish() {
    if (this.data.publishing) return

    const user = contentStore.getProfileUser()
    if (!user || !user.loggedIn) {
      const loginUrl = '/pages/profileLogin/profileLogin?mode=guestRequired&redirect=' + encodeURIComponent('/pages/myrecommend/myrecommend')
      wx.showToast({ title: '请先进行游客登录', icon: 'none' })
      setTimeout(() => {
        wx.navigateTo({
          url: loginUrl,
          fail: () => wx.redirectTo({ url: loginUrl })
        })
      }, 420)
      return
    }

    const title = this.data.head_txt.trim()
    const text = this.data.text.trim()

    if (!title || !text) {
      wx.showToast({
        title: '请先填写标题和内容',
        icon: 'none'
      })
      return
    }

    this.setData({ publishing: true })
    const savedPost = contentStore.savePost({
      title,
      text,
      image: this.data.images[0],
      tag: this.data.activeTag
    })

    if (!savedPost) {
      this.setData({ publishing: false })
      wx.showToast({ title: '请先进行游客登录', icon: 'none' })
      return
    }

    wx.showToast({
      title: '发布成功',
      icon: 'success'
    })

    setTimeout(() => {
      wx.redirectTo({
        url: '/pages/posts/posts'
      })
    }, 650)
  }
})
