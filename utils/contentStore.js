const scenicDetails = [
  {
    id: '1',
    text_big: '黄河穿城而过的兰州慢行',
    text: '从中山桥到白塔山，再到甘肃省博物馆，兰州适合作为甘肃旅程的开篇。这里既有黄河边的生活气，也有铜奔马、简牍与彩陶共同撑起的文博底色。',
    images: [
      'https://free.picui.cn/free/2026/06/21/6a376637d8919.png',
      'https://free.picui.cn/free/2026/06/21/6a376641167e5.png'
    ],
    comments: [
      { id: 'c-lz-1', liked: false, likeCount: 18, replies: ['我也推荐傍晚去，中山桥附近很舒服。'], author: { username: '河边散步的人', avatar: 'https://api.dicebear.com/7.x/adventurer/png?seed=lanzhou' }, comment: '傍晚走黄河边真的舒服，风很轻。' },
      { id: 'c-lz-2', liked: false, likeCount: 11, replies: ['铜奔马展区值得多停留。'], author: { username: '陇原手账', avatar: 'https://api.dicebear.com/7.x/adventurer/png?seed=longyuan' }, comment: '省博建议留足两个小时，文创也很好逛。' }
    ]
  },
  {
    id: '2',
    text_big: '敦煌：大漠与石窟之间',
    text: '敦煌最迷人的地方，是莫高窟的壁画、鸣沙山的光线和沙洲夜市的烟火被放在同一天里。建议莫高窟提前预约，鸣沙山尽量安排在日落前后。',
    images: [
      'https://free.picui.cn/free/2026/06/21/6a376644b3b26.png',
      'https://free.picui.cn/free/2026/06/21/6a376637eee0a.png'
    ],
    comments: [
      { id: 'c-dh-1', liked: false, likeCount: 26, replies: ['日落后温差会变大，外套要带。'], author: { username: '飞天纹样收集者', avatar: 'https://api.dicebear.com/7.x/adventurer/png?seed=dunhuang' }, comment: '日落前的沙丘颜色很漂亮，拍照不用太赶。' },
      { id: 'c-dh-2', liked: false, likeCount: 14, replies: ['讲解能把壁画故事串起来。'], author: { username: '西行旅人', avatar: 'https://api.dicebear.com/7.x/adventurer/png?seed=silkroad' }, comment: '莫高窟讲解很值得听，信息密度特别高。' }
    ]
  },
  {
    id: '3',
    text_big: '张掖丹霞的色彩长卷',
    text: '张掖七彩丹霞适合慢慢等光。下午到达、傍晚观景，会看到红、橙、赭、紫在山体上交叠，像大地自己铺开的丝路织锦。',
    images: [
      'https://free.picui.cn/free/2026/06/21/6a376641229b8.png',
      'https://free.picui.cn/free/2026/06/21/6a3766409c3b4.png'
    ],
    comments: [
      { id: 'c-zy-1', liked: false, likeCount: 31, replies: ['雨后颜色更厚，晴天线条更清楚。'], author: { username: '追光的人', avatar: 'https://api.dicebear.com/7.x/adventurer/png?seed=zhangye' }, comment: '晴天和雨后完全是两种感觉，都很震撼。' },
      { id: 'c-zy-2', liked: false, likeCount: 9, replies: ['景区车也要排队，确实要留时间。'], author: { username: '地貌爱好者', avatar: 'https://api.dicebear.com/7.x/adventurer/png?seed=danxia' }, comment: '观景台之间要预留移动时间，别只卡最后一刻。' }
    ]
  }
]

const defaultAvatar = 'https://free.picui.cn/free/2026/06/21/6a37c4267aa75.png'
const GUEST_CONTENT_ID_KEY = 'localContentGuestId'

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function cleanId(value) {
  return String(value || '').replace(/[^a-zA-Z0-9_-]/g, '')
}

function getLocalGuestId() {
  const savedId = cleanId(wx.getStorageSync(GUEST_CONTENT_ID_KEY))
  if (savedId) return savedId

  const guestId = 'guest-content-' + Date.now()
  wx.setStorageSync(GUEST_CONTENT_ID_KEY, guestId)
  return guestId
}

function getProfileUser() {
  return wx.getStorageSync('profileUser') || {
    loggedIn: false,
    nickName: '丝路旅人',
    avatarUrl: defaultAvatar,
    userId: 'SR000000',
    points: 0,
    footprints: 0,
    fans: 0,
    follows: 0,
    likes: 0,
    postsCount: 0
  }
}

function saveProfileUser(user) {
  wx.setStorageSync('profileUser', user)
  const app = typeof getApp === 'function' ? getApp() : null
  if (app && app.globalData) {
    app.globalData.userInfo = user
    app.globalData.token = user.token || app.globalData.token || ''
  }
  return user
}

function getAccountId(user) {
  if (!user || !user.loggedIn) return ''

  if (user.isGuest) return getLocalGuestId()

  const candidates = [
    user.openid,
    user.unionid,
    user.userId,
    user.phone,
    user.token
  ]

  const id = candidates.find(item => String(item || '').trim())
  return cleanId(id)
}

function getDetail(id) {
  const detail = scenicDetails.find(item => String(item.id) === String(id)) || scenicDetails[0]
  const comments = wx.getStorageSync('demoComments-' + detail.id) || detail.comments
  return {
    ...clone(detail),
    comments: clone(comments)
  }
}

function saveComment(id, comment) {
  const detail = getDetail(id)
  const comments = [
    {
      id: 'c-me-' + Date.now(),
      liked: false,
      likeCount: 0,
      replies: [],
      author: { username: '我', avatar: 'https://api.dicebear.com/7.x/adventurer/png?seed=me' },
      comment
    }
  ].concat(detail.comments)
  wx.setStorageSync('demoComments-' + detail.id, comments)
  return comments
}

function saveComments(id, comments) {
  const detail = getDetail(id)
  wx.setStorageSync('demoComments-' + detail.id, comments)
  return getDetail(id).comments
}

function toggleCommentLike(id, commentId) {
  const detail = getDetail(id)
  const comments = detail.comments.map(comment => {
    if (String(comment.id) !== String(commentId)) return comment
    const liked = !comment.liked
    return {
      ...comment,
      liked,
      likeCount: Math.max(0, Number(comment.likeCount || 0) + (liked ? 1 : -1))
    }
  })
  return saveComments(id, comments)
}

function addCommentReply(id, commentId) {
  const detail = getDetail(id)
  const comments = detail.comments.map(comment => {
    if (String(comment.id) !== String(commentId)) return comment
    return {
      ...comment,
      replies: (comment.replies || []).concat('我也这么觉得，已加入行程参考。')
    }
  })
  return saveComments(id, comments)
}

function getMyComments() {
  const ids = scenicDetails.map(item => item.id)
  const comments = []

  ids.forEach(id => {
    const detail = scenicDetails.find(item => item.id === id)
    const stored = wx.getStorageSync('demoComments-' + id) || []
    stored.forEach(comment => {
      if (comment.author && comment.author.username === '我') {
        comments.push({
          from_id: id,
          from_title: detail.text_big,
          comment_detail: comment.comment,
          created_at: '刚刚'
        })
      }
    })
  })

  if (comments.length) return comments

  return [
    { from_id: '1', from_title: '黄河穿城而过的兰州慢行', comment_detail: '收藏一下，适合第一天慢慢逛。', created_at: '今天' },
    { from_id: '2', from_title: '敦煌：大漠与石窟之间', comment_detail: '莫高窟和鸣沙山安排在两段时间会更舒服。', created_at: '昨天' }
  ]
}

function getMyPosts() {
  const posts = wx.getStorageSync('demoPosts') || []
  const accountId = getAccountId(getProfileUser())

  if (!accountId) return []

  return clone(posts.filter(post => post.ownerId === accountId))
}

function savePost(post) {
  const posts = wx.getStorageSync('demoPosts') || []
  const user = getProfileUser()
  const accountId = getAccountId(user)

  if (!accountId) return null

  const record = {
    id: 'post-' + Date.now(),
    title: post.title,
    text: post.text,
    image: post.image || 'https://free.picui.cn/free/2026/06/24/6a3b89a3dd24f.jpg',
    time: '刚刚',
    createdAt: Date.now(),
    author: user.nickName || '丝路旅人',
    avatar: user.avatarUrl || defaultAvatar,
    ownerId: accountId,
    tag: post.tag || '旅行笔记',
    likes: 0,
    views: '0',
    liked: false,
    comments: []
  }
  wx.setStorageSync('demoPosts', [record].concat(posts).slice(0, 30))

  if (user && user.loggedIn) {
    saveProfileUser({
      ...user,
      postsCount: Number(user.postsCount || 0) + 1,
      footprints: Number(user.footprints || 0) + 1,
      points: Number(user.points || 0) + (user.isGuest ? 0 : 15)
    })
  }

  return record
}

function toCommunityNote(post) {
  return {
    id: post.id,
    image: post.image || 'https://free.picui.cn/free/2026/06/24/6a3b89a3dd24f.jpg',
    title: post.title,
    desc: post.text.length > 36 ? post.text.slice(0, 36) + '...' : post.text,
    body: post.text,
    author: post.author || '丝路旅人',
    avatar: post.avatar || defaultAvatar,
    views: post.views || '0',
    likes: Number(post.likes || 0),
    liked: !!post.liked,
    tag: post.tag || '旅行笔记',
    video: false,
    fromUser: true,
    comments: (post.comments && post.comments.length ? post.comments : [
      {
        id: 'cm-auto-' + post.id,
        avatar: 'https://api.dicebear.com/7.x/adventurer/png?seed=reader-' + post.id,
        name: '同路旅人',
        text: '这条分享已收藏，准备放进自己的甘肃行程里。',
        likes: 0,
        liked: false,
        replies: []
      }
    ])
  }
}

function getCommunityPosts() {
  const posts = wx.getStorageSync('demoPosts') || []
  return clone(posts).map(toCommunityNote)
}

function getLoginRecords() {
  return clone(wx.getStorageSync('loginRecords') || [])
}

function saveLoginRecord(record) {
  const records = wx.getStorageSync('loginRecords') || []
  wx.setStorageSync('loginRecords', [record].concat(records).slice(0, 20))
  return getLoginRecords()
}

function isLiked(id) {
  const likes = wx.getStorageSync('demoLikes') || []
  return likes.includes(String(id))
}

function toggleLike(id) {
  const key = String(id)
  const likes = wx.getStorageSync('demoLikes') || []
  const next = likes.includes(key) ? likes.filter(item => item !== key) : likes.concat(key)
  wx.setStorageSync('demoLikes', next)
  return next.includes(key)
}

module.exports = {
  getDetail,
  getMyComments,
  getMyPosts,
  getCommunityPosts,
  getLoginRecords,
  getProfileUser,
  isLiked,
  addCommentReply,
  saveComment,
  toggleCommentLike,
  savePost,
  saveLoginRecord,
  saveProfileUser,
  toggleLike
}
