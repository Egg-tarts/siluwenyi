// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.setStorageSync('profileUser', {
      loggedIn: false,
      avatarUrl: 'https://free.picui.cn/free/2026/06/21/6a37c4267aa75.png',
      nickName: '点击登录',
      userId: '未登录',
      points: 0,
      footprints: 0,
      fans: 0,
      follows: 0,
      likes: 0,
      postsCount: 0
    })

    if (wx.cloud && typeof wx.cloud.init === 'function') {
      wx.cloud.init({
        env: 'slwy-ai-d5ggwa78c5fd3ec30',
        traceUser: true
      })
    }

  },
  globalData: {
    userInfo: null,
    activeIndex: 0,
    token:null,
    cloudRunEnabled: true,
    cloudRunEnvId: 'slwy-ai-d5ggwa78c5fd3ec30',
    cloudRunService: 'slwy-ai-final',
    aiButlerEndpoint: 'https://slwy-ai-final-274631-7-1325518283.sh.run.tcloudbase.com/api/ai-butler/chat',
    wechatLoginEndpoint: 'https://slwy-ai-final-274631-7-1325518283.sh.run.tcloudbase.com/api/wechat/login',
    seedanceGenerateEndpoint: 'https://slwy-ai-final-274631-7-1325518283.sh.run.tcloudbase.com/api/seedance/generate',
    seedanceUploadEndpoint: 'https://slwy-ai-final-274631-7-1325518283.sh.run.tcloudbase.com/api/seedance/generate-file',
    seedanceTaskEndpoint: 'https://slwy-ai-final-274631-7-1325518283.sh.run.tcloudbase.com/api/seedance/task',
    aiButlerApiKey: '',
    aiButlerModel: 'deepseek-v4-flash-260425',
    aiButlerUseStream: false,
    currentTab: 'scenic',
    answer: null
  }
})
