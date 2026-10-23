const contentStore = require('../../utils/contentStore')

const noteImages = {
  lanzhou: 'https://free.picui.cn/free/2026/06/24/6a3b89a3dd24f.jpg',
  jiuquan: 'https://free.picui.cn/free/2026/06/24/6a3b89a3affc5.jpg',
  dunhuang: 'https://free.picui.cn/free/2026/06/24/6a3b89a1142c9.jpg',
  jiayuguan: 'https://free.picui.cn/free/2026/06/24/6a3b89a3c3511.jpg',
  qingyang: 'https://free.picui.cn/free/2026/06/24/6a3b89a11ced3.jpg',
  tianshui: 'https://free.picui.cn/free/2026/06/24/6a3b89a10209a.jpg',
  zhangye: 'https://free.picui.cn/free/2026/06/24/6a3b89a3e9552.jpg',
  baiyin: 'https://free.picui.cn/free/2026/06/24/6a3b89a126a55.jpg',
  wuwei: 'https://free.picui.cn/free/2026/06/24/6a3b89a3bcebc.jpg',
  longnan: 'https://free.picui.cn/free/2026/06/24/6a3b89a0e5c5b.jpg'
}

const comments = [
  { id: 'cm-1', avatar: 'https://api.dicebear.com/7.x/adventurer/png?seed=yellowriver', name: '黄河边散步', text: '这个路线很稳，我去年也是兰州进敦煌出，张掖日落一定要留足时间。', likes: 42, liked: false, replies: ['同意，张掖晚上回市区的车也要提前看。', '我还会多留一天给嘉峪关。'] },
  { id: 'cm-2', avatar: 'https://api.dicebear.com/7.x/adventurer/png?seed=maiji', name: '石窟听风', text: '如果带老人，麦积山可以放慢，讲解比赶路更重要。', likes: 31, liked: false, replies: ['亲子也适合，孩子会更容易听进去。'] },
  { id: 'cm-3', avatar: 'https://api.dicebear.com/7.x/adventurer/png?seed=shazhou', name: '沙洲小记', text: '敦煌夜市建议放在莫高窟之后，行程收尾会很舒服。', likes: 26, liked: false, replies: [] }
]

const notes = [
  { id: 'n1', image: noteImages.dunhuang, title: '敦煌夜色里的驼铃声', desc: '傍晚进鸣沙山，先看沙脊被光线压出层次，再等月牙泉亮灯。', body: '我最喜欢把敦煌放在行程的后半段。白天看莫高窟，傍晚去鸣沙山，夜里再走到沙洲夜市。这样一天从壁画、沙山到烟火气，层次特别完整。鸣沙山不用太早冲进去，日照强的时候可以先休息，等光线软下来再进景区。', author: '沙州小记', avatar: 'https://api.dicebear.com/7.x/adventurer/png?seed=note-dh', views: '2.8k', likes: 326, liked: false, tag: '敦煌', video: true, comments },
  { id: 'n2', image: noteImages.zhangye, title: '张掖丹霞别急着走', desc: '日落前 40 分钟才是颜色最稳的时候，观景台之间要留足摆渡车时间。', body: '丹霞最怕赶。很多人下午到景区，看一两个观景台就准备走，其实越接近日落，色带越有层次。建议把返程时间往后放一点，带外套，等山体阴影慢慢出来。', author: '河西走廊', avatar: 'https://api.dicebear.com/7.x/adventurer/png?seed=note-zy', views: '1.9k', likes: 218, liked: false, tag: '摄影', video: false, comments },
  { id: 'n3', image: noteImages.lanzhou, title: '兰州黄河边的慢半拍', desc: '中山桥、白塔山、牛肉面和甜醅子，适合把第一天走成松弛的城市引子。', body: '兰州适合做丝路行程的缓冲。第一天不要排太满，早上吃牛肉面，下午走省博，晚上沿黄河散步。这样进入河西走廊之前，身体和心情都能慢慢打开。', author: '黄河茶摊', avatar: 'https://api.dicebear.com/7.x/adventurer/png?seed=note-lz', views: '3.1k', likes: 402, liked: false, tag: '兰州', video: false, comments },
  { id: 'n4', image: noteImages.jiayuguan, title: '嘉峪关的风很会讲故事', desc: '登城墙时别只拍正面，侧面的墙体线条和远处戈壁更有边塞感。', body: '嘉峪关不要只看关城正面。走到侧面，城墙的线条、远处的戈壁和风声会让边塞感一下子出来。拍照可以带一点人物背影，画面会更有故事。', author: '关城风声', avatar: 'https://api.dicebear.com/7.x/adventurer/png?seed=note-jyg', views: '980', likes: 144, liked: false, tag: '关隘', video: true, comments },
  { id: 'n5', image: noteImages.tianshui, title: '麦积山适合慢慢听', desc: '先听讲解再上栈道，泥塑的表情会比第一眼更细。', body: '麦积山不是只看风景，它更像一段需要慢慢听的故事。建议先听讲解，再走栈道，很多造像表情和姿态会突然变得生动起来。', author: '石窟听风', avatar: 'https://api.dicebear.com/7.x/adventurer/png?seed=note-ts', views: '1.6k', likes: 231, liked: false, tag: '文博', video: false, comments },
  { id: 'n6', image: noteImages.wuwei, title: '武威雷台的城市午后', desc: '把雷台汉墓放在午后很舒服，室内展陈避暑，也能接上晚间市集。', body: '武威的节奏不紧不慢。午后去雷台汉墓，避开日晒，顺便把铜奔马的故事补上。晚上再去吃凉州小吃，半天就很完整。', author: '凉州册页', avatar: 'https://api.dicebear.com/7.x/adventurer/png?seed=note-ww', views: '756', likes: 98, liked: false, tag: '武威', video: false, comments },
  { id: 'n7', image: noteImages.baiyin, title: '黄河石林像一段野路', desc: '峡谷和黄河水面在同一张照片里，行程里要预留天气缓冲。', body: '黄河石林很有野性，天气影响也更明显。出发前一定看天气，鞋底要防滑，峡谷和水面同框的时候特别震撼。', author: '古渡笔记', avatar: 'https://api.dicebear.com/7.x/adventurer/png?seed=note-by', views: '1.2k', likes: 176, liked: false, tag: '白银', video: true, comments },
  { id: 'n8', image: noteImages.longnan, title: '陇南把甘肃变清润了', desc: '官鹅沟的水和森林很适合亲子慢走，雨具和薄外套一定带。', body: '如果你以为甘肃只有戈壁和黄土，陇南会给你换一种感觉。这里更清润，适合慢走，也适合带孩子做一次山水换气。', author: '山水换气', avatar: 'https://api.dicebear.com/7.x/adventurer/png?seed=note-ln', views: '889', likes: 132, liked: false, tag: '陇南', video: false, comments },
  { id: 'n9', image: noteImages.jiuquan, title: '酒泉适合当作补给站', desc: '从城市补给到文博停留，酒泉很适合承接敦煌和嘉峪关之间的节奏。', body: '酒泉很适合放在中途调节节奏。不要把它只当路过，补给、休息、简单文博停留都很方便。', author: '肃州旅人', avatar: 'https://api.dicebear.com/7.x/adventurer/png?seed=note-jq', views: '642', likes: 87, liked: false, tag: '酒泉', video: false, comments },
  { id: 'n10', image: noteImages.qingyang, title: '庆阳的黄土记忆', desc: '塬、窑洞和非遗线索适合做成半天的人文路线。', body: '庆阳适合做黄土文化的小专题。窑洞、民俗、非遗和塬上风景串起来，会比单点参观更有记忆。', author: '陇东来信', avatar: 'https://api.dicebear.com/7.x/adventurer/png?seed=note-qy', views: '713', likes: 104, liked: false, tag: '庆阳', video: false, comments }
]

const topicCards = [
  { title: '丝路问驿文化讨论', desc: '路线、讲解、历史故事和城市冷知识都放这里聊。', count: '12.6万热度', image: noteImages.dunhuang },
  { title: '甘肃文博百科全书', desc: '石窟、简牍、长城、驿站和博物馆展陈速查。', count: '8.9万收藏', image: noteImages.tianshui },
  { title: '河西走廊同路人', desc: '找同路线经验，看看别人如何安排交通和停留。', count: '6.4万讨论', image: noteImages.zhangye },
  { title: '亲子慢游互助站', desc: '老人儿童、休息点、轻松路线和避坑提醒。', count: '4.1万收藏', image: noteImages.lanzhou }
]

const discussList = [
  { title: '兰州进敦煌出，7 天会不会太赶？', reply: '128 条回复', heat: '热', noteId: 'n3' },
  { title: '莫高窟普通票和应急票到底差多少？', reply: '96 条回复', heat: '问', noteId: 'n1' },
  { title: '张掖丹霞下雨后真的更好看吗？', reply: '74 条回复', heat: '拍', noteId: 'n2' },
  { title: '带老人去麦积山，哪条线更轻松？', reply: '52 条回复', heat: '暖', noteId: 'n5' }
]

const cityPartners = [
  { city: '兰州', text: '黄河夜游、牛肉面、第一天落脚', people: '238 人正在看', noteId: 'n3' },
  { city: '敦煌', text: '莫高窟、鸣沙山、沙洲夜市', people: '416 人正在看', noteId: 'n1' },
  { city: '张掖', text: '丹霞日落、马蹄寺、城市补给', people: '189 人正在看', noteId: 'n2' },
  { city: '天水', text: '麦积山、伏羲庙、亲子讲解', people: '156 人正在看', noteId: 'n5' },
  { city: '嘉峪关', text: '关城、长城、边塞摄影', people: '132 人正在看', noteId: 'n4' }
]

function splitNotes(list) {
  return {
    leftNotes: list.filter((item, index) => index % 2 === 0),
    rightNotes: list.filter((item, index) => index % 2 === 1)
  }
}

Page({
  data: {
    searchValue: '',
    hotLine: '今天想问：河西走廊第一次去，兰州进敦煌出怎么排更稳？',
    topicCards,
    quickTopics: ['敦煌避坑', '丹霞日落', '兰州夜游', '石窟讲解', '亲子路线', '自驾补给', '文博盖章', '美食清单'],
    discussList,
    cityPartners,
    allNotes: notes,
    noteList: notes,
    leftNotes: splitNotes(notes).leftNotes,
    rightNotes: splitNotes(notes).rightNotes,
    showDetail: false,
    showList: true,
    activeNote: notes[0],
    relatedNotes: notes.slice(1, 4),
    activeComment: comments[0],
    showCommentFocus: false
  },

  onLoad(options) {
    const allNotes = this.loadCommunityNotes()
    if (options && options.openPost) {
      this.openNoteById(options.openPost, allNotes)
    }
  },

  onShow() {
    this.loadCommunityNotes()
  },

  loadCommunityNotes() {
    const allNotes = contentStore.getCommunityPosts().concat(notes)
    const noteList = this.data.searchValue ? this.filterNotes(allNotes, this.data.searchValue) : allNotes
    const columns = splitNotes(noteList)
    this.setData({
      allNotes,
      noteList,
      leftNotes: columns.leftNotes,
      rightNotes: columns.rightNotes
    })
    return allNotes
  },

  onInput(e) {
    const searchValue = e.detail.value
    this.setData({ searchValue })
    this.applySearch(searchValue)
  },

  applySearch(value) {
    const noteList = this.filterNotes(this.data.allNotes, value)
    const columns = splitNotes(noteList)
    this.setData({ noteList, leftNotes: columns.leftNotes, rightNotes: columns.rightNotes })
  },

  filterNotes(source, value) {
    const keyword = value.trim()
    return keyword
      ? source.filter(item => item.title.indexOf(keyword) > -1 || item.desc.indexOf(keyword) > -1 || item.tag.indexOf(keyword) > -1 || item.author.indexOf(keyword) > -1)
      : source
  },

  selectTopic(e) {
    const keyword = e.currentTarget.dataset.keyword
    this.setData({ searchValue: keyword })
    this.applySearch(keyword)
  },

  openNote(e) {
    const id = e.currentTarget.dataset.id
    this.openNoteById(id)
  },

  openNoteById(id, sourceNotes) {
    const baseNotes = sourceNotes || this.data.allNotes
    const allNotes = baseNotes.concat(this.data.relatedNotes)
    const activeNote = allNotes.find(item => item.id === id) || notes.find(item => item.id === id) || notes[0]
    const relatedNotes = baseNotes.filter(item => item.id !== activeNote.id).slice(0, 3)
    this.setData({
      showDetail: true,
      showList: false,
      activeNote,
      relatedNotes,
      activeComment: activeNote.comments[0],
      showCommentFocus: false
    })
  },

  closeDetail() {
    this.setData({ showDetail: false, showList: true })
  },

  openComment(e) {
    const index = Number(e.currentTarget.dataset.index)
    const activeComment = this.data.activeNote.comments[index] || this.data.activeNote.comments[0]
    this.setData({
      activeComment,
      showCommentFocus: true
    })
  },

  openCommentFromAction(e) {
    const index = Number(e.currentTarget.dataset.index)
    const activeComment = this.data.activeNote.comments[index] || this.data.activeNote.comments[0]
    this.setData({
      activeComment,
      showCommentFocus: true
    })
  },

  toggleNoteLike() {
    const activeNote = {
      ...this.data.activeNote,
      liked: !this.data.activeNote.liked,
      likes: Math.max(0, this.data.activeNote.likes + (this.data.activeNote.liked ? -1 : 1))
    }

    this.syncActiveNote(activeNote)
    wx.showToast({ title: activeNote.liked ? '已点赞' : '已取消', icon: 'none' })
  },

  toggleNoteCollect() {
    const activeNote = {
      ...this.data.activeNote,
      collected: !this.data.activeNote.collected
    }

    this.syncActiveNote(activeNote)
    wx.showToast({ title: activeNote.collected ? '已收藏' : '已取消', icon: 'none' })
  },

  toggleCommentLike(e) {
    const index = Number(e.currentTarget.dataset.index)
    const comments = this.data.activeNote.comments.map((comment, commentIndex) => {
      if (commentIndex !== index) return comment
      const liked = !comment.liked

      return {
        ...comment,
        liked,
        likes: Math.max(0, comment.likes + (liked ? 1 : -1))
      }
    })

    this.syncActiveNote({ ...this.data.activeNote, comments })
  },

  replyComment(e) {
    const index = Number(e.currentTarget.dataset.index)
    const comments = this.data.activeNote.comments.map((comment, commentIndex) => {
      if (commentIndex !== index) return comment

      return {
        ...comment,
        replies: comment.replies.concat('我也收藏了这条建议，准备放进行程里。')
      }
    })

    this.syncActiveNote({ ...this.data.activeNote, comments })
    wx.showToast({ title: '已回复', icon: 'success' })
  },

  syncActiveNote(activeNote) {
    const allNotes = this.data.allNotes.map(note => note.id === activeNote.id ? activeNote : note)
    const noteList = this.data.noteList.map(note => note.id === activeNote.id ? activeNote : note)
    const relatedNotes = this.data.relatedNotes.map(note => note.id === activeNote.id ? activeNote : note)
    const columns = splitNotes(noteList)
    const activeComment = activeNote.comments[0] || {}

    this.setData({
      activeNote,
      allNotes,
      noteList,
      leftNotes: columns.leftNotes,
      rightNotes: columns.rightNotes,
      relatedNotes,
      activeComment
    })
  },

  publishNote() {
    wx.navigateTo({
      url: '/pages/myrecommend/myrecommend'
    })
  },

  openArViewer() {
    wx.navigateTo({
      url: '/pages/arViewer/arViewer'
    })
  }
})
