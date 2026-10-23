const cities = [
  {
    name: '兰州',
    en: 'Lanzhou',
    image: 'https://free.picui.cn/free/2026/06/21/6a376637d8919.png',
    slogan: '黄河穿城而过的陇原序章',
    desc: '兰州是甘肃旅程最适合开启的一站。黄河风情线、甘肃省博物馆、中山桥和白塔山把城市生活、丝路文物与黄河气象连在一起。',
    tags: ['黄河', '省博', '牛肉面', '城市慢游'],
    museums: ['甘肃省博物馆', '兰州市博物馆', '黄河桥梁博物馆'],
    route: ['甘肃省博物馆看铜奔马和彩陶', '中山桥步行到黄河边', '白塔山俯瞰城市夜色'],
    food: ['兰州牛肉面', '甜醅子', '灰豆子'],
    tips: '第一天抵达不要排太满，下午省博、傍晚黄河边散步最舒服。'
  },
  {
    name: '酒泉',
    en: 'Jiuquan',
    image: 'https://free.picui.cn/free/2026/06/21/6a376637eee0a.png',
    slogan: '绿洲与大漠之间的西行补给站',
    desc: '酒泉承接嘉峪关与敦煌之间的节奏，既有汉唐边塞记忆，也有绿洲城市的从容，适合做文博停留与旅途调整。',
    tags: ['绿洲', '汉唐', '补给', '边塞'],
    museums: ['酒泉市博物馆', '肃州区博物馆', '西汉酒泉胜迹'],
    route: ['城市博物馆了解河西郡县', '西汉酒泉胜迹散步', '夜间补给休整'],
    food: ['糊锅', '羊肉粉汤', '油饼子'],
    tips: '适合放在敦煌、嘉峪关之间，给长线行程留出休息缓冲。'
  },
  {
    name: '敦煌',
    en: 'Dunhuang',
    image: 'https://free.picui.cn/free/2026/06/21/6a376644b3b26.png',
    slogan: '大漠、石窟与丝路想象的交汇',
    desc: '敦煌把莫高窟壁画、鸣沙山月牙泉和沙洲夜市放在同一个城市里，是甘肃文旅最具辨识度的目的地之一。',
    tags: ['莫高窟', '鸣沙山', '飞天', '沙洲夜市'],
    museums: ['敦煌博物馆', '莫高窟数字展示中心', '敦煌研究院相关展陈'],
    route: ['上午参观莫高窟', '下午敦煌博物馆补充背景', '傍晚鸣沙山看日落'],
    food: ['驴肉黄面', '杏皮水', '胡羊焖饼'],
    tips: '莫高窟务必提前预约，鸣沙山更适合日落前后进入。'
  },
  {
    name: '嘉峪关',
    en: 'Jiayuguan',
    image: 'https://free.picui.cn/free/2026/06/21/6a37664492008.png',
    slogan: '长城西端的风声与关城',
    desc: '嘉峪关的核心不只是一座城楼，而是关城、长城、戈壁与边塞防御体系共同形成的历史现场。',
    tags: ['关城', '长城', '戈壁', '边塞'],
    museums: ['嘉峪关长城博物馆', '嘉峪关关城景区展陈', '魏晋墓砖画相关展陈'],
    route: ['长城博物馆打底', '关城看城防结构', '悬壁长城或第一墩补充边塞视角'],
    food: ['烤肉', '搓鱼面', '炮仗面'],
    tips: '戈壁风大，拍摄关城建议留出傍晚侧光。'
  },
  {
    name: '定西',
    en: 'Dingxi',
    image: 'https://free.picui.cn/free/2026/06/21/6a37782948bfa.png',
    slogan: '陇中梯田与药香之间',
    desc: '定西的气质安静而厚重，梯田、药材、民俗与陇中生活共同构成了这座城市的文旅底色。',
    tags: ['陇中', '梯田', '药香', '民俗'],
    museums: ['定西市博物馆', '陇西李氏文化相关展陈', '通渭书画文化展陈'],
    route: ['城市博物馆看陇中文脉', '陇西寻访历史文化', '通渭感受书画民俗'],
    food: ['定西宽粉', '洋芋搅团', '浆水面'],
    tips: '适合做陇中人文线，节奏可以比河西线更慢。'
  },
  {
    name: '庆阳',
    en: 'Qingyang',
    image: 'https://free.picui.cn/free/2026/06/21/6a3766412689c.png',
    slogan: '黄土塬上的农耕记忆',
    desc: '庆阳适合看黄土塬、窑洞、香包、剪纸和农耕文化，城市更偏人文体验和非遗观察。',
    tags: ['黄土塬', '窑洞', '非遗', '农耕'],
    museums: ['庆阳市博物馆', '陇东民俗博物馆', '南梁革命纪念馆'],
    route: ['博物馆了解陇东历史', '看香包剪纸等非遗', '塬上村落感受黄土生活'],
    food: ['庆阳臊子面', '荞面饸饹', '暖锅'],
    tips: '适合做半天到一天的人文专题，注意塬区交通时间。'
  },
  {
    name: '天水',
    en: 'Tianshui',
    image: 'https://free.picui.cn/free/2026/06/21/6a37664115350.png',
    slogan: '麦积烟雨与伏羲古韵',
    desc: '天水是甘肃东部最适合亲子和研学慢游的城市，麦积山石窟、伏羲庙与城市山水互相呼应。',
    tags: ['麦积山', '伏羲庙', '石窟', '亲子研学'],
    museums: ['天水市博物馆', '麦积山石窟展陈', '伏羲庙相关展陈'],
    route: ['伏羲庙了解人文脉络', '麦积山看石窟造像', '市区品尝地方小吃'],
    food: ['天水呱呱', '浆水面', '猪油盒'],
    tips: '麦积山建议先听讲解再上栈道，雨天注意防滑。'
  },
  {
    name: '张掖',
    en: 'Zhangye',
    image: 'https://free.picui.cn/free/2026/06/21/6a376641229b8.png',
    slogan: '丹霞色彩铺开的地理长卷',
    desc: '张掖的色彩来自丹霞，也来自马蹄寺、大佛寺和河西走廊的历史层次，适合自然与文博组合游。',
    tags: ['七彩丹霞', '大佛寺', '马蹄寺', '摄影'],
    museums: ['张掖市博物馆', '大佛寺展陈', '马蹄寺石窟群'],
    route: ['上午大佛寺与城市文博', '下午马蹄寺或博物馆', '傍晚七彩丹霞等光'],
    food: ['搓鱼子', '牛肉小饭', '炒拨拉'],
    tips: '丹霞日落前后最出片，观景台之间要预留摆渡时间。'
  },
  {
    name: '白银',
    en: 'Baiyin',
    image: 'https://free.picui.cn/free/2026/06/21/6a376641167e5.png',
    slogan: '黄河石林与古渡峡谷',
    desc: '白银最有辨识度的是黄河石林、峡谷纹理与古渡风景，适合喜欢自然地貌和黄河文化的游客。',
    tags: ['黄河石林', '峡谷', '古渡', '地貌'],
    museums: ['白银市博物馆', '黄河石林相关展陈', '景泰地方文化展陈'],
    route: ['城市博物馆了解矿业与黄河文化', '黄河石林峡谷游览', '古渡口看黄河地貌'],
    food: ['靖远羊羔肉', '酸烂肉', '黄河鱼'],
    tips: '峡谷区域看天气和鞋底防滑，补水要提前准备。'
  },
  {
    name: '武威',
    en: 'Wuwei',
    image: 'https://free.picui.cn/free/2026/06/21/6a3766409c3b4.png',
    slogan: '铜奔马踏起的凉州汉风',
    desc: '武威是河西走廊非常适合文博停留的城市，雷台汉墓、文庙和凉州文化让它有很强的历史辨识度。',
    tags: ['铜奔马', '凉州', '雷台', '汉风'],
    museums: ['武威市博物馆', '雷台汉文化博物馆', '武威文庙'],
    route: ['雷台看铜奔马故事', '武威文庙感受凉州文脉', '市区慢逛小吃'],
    food: ['三套车', '凉州面皮', '羊肉香头子'],
    tips: '雷台适合午后避暑参观，文博和美食可以放在同一天。'
  },
  {
    name: '平凉',
    en: 'Pingliang',
    image: 'https://free.picui.cn/free/2026/06/21/6a376637e90df.png',
    slogan: '崆峒云气里的山岳文化',
    desc: '平凉以崆峒山为核心，山岳、道源文化和陇东风物构成了清朗的城市气质。',
    tags: ['崆峒山', '道源', '山岳', '陇东'],
    museums: ['平凉市博物馆', '崆峒山相关展陈', '泾川历史文化展陈'],
    route: ['崆峒山慢走', '城市博物馆补充历史背景', '夜间品尝地方小吃'],
    food: ['平凉红牛', '静宁烧鸡', '饸饹面'],
    tips: '山地游览要看天气，轻装慢走体验更好。'
  },
  {
    name: '陇南',
    en: 'Longnan',
    image: 'https://free.picui.cn/free/2026/06/21/6a3766381d1e6.png',
    slogan: '秦巴山水把甘肃变得清润',
    desc: '陇南与河西走廊气质完全不同，山水、古道、茶香和民族文化让它更适合慢旅行。',
    tags: ['山水', '古道', '茶香', '亲子慢游'],
    museums: ['陇南市博物馆', '成县西狭颂相关展陈', '文县白马民俗展陈'],
    route: ['城市文博了解秦巴文化', '官鹅沟或山水景区慢游', '古道与民俗点补充体验'],
    food: ['洋芋搅团', '陇南茶', '核桃饼'],
    tips: '山区天气变化快，薄外套和雨具最好带上。'
  },
  {
    name: '金昌',
    en: 'Jinchang',
    image: 'https://free.picui.cn/free/2026/06/21/6a376637d6ad3.png',
    slogan: '花海与工业记忆相遇',
    desc: '金昌既有镍都工业记忆，也有花海和城市景观，适合做轻松的城市补给与拍照停留。',
    tags: ['镍都', '花海', '工业记忆', '城市摄影'],
    museums: ['金昌市博物馆', '镍都工业文化展陈', '城市花海主题景观'],
    route: ['博物馆看工业城市记忆', '花海拍照散步', '市区补给休整'],
    food: ['羊肉垫卷子', '手抓羊肉', '金昌面食'],
    tips: '花期时更适合拍照，非花期可把重点放在工业文化和城市休整。'
  }
]

Page({
  data: {
    city: cities[0],
    cities,
    activeIndex: 0
  },

  onLoad(options) {
    const name = decodeURIComponent(options && options.name ? options.name : '')
    const index = cities.findIndex(item => item.name === name)
    this.setData({
      activeIndex: index > -1 ? index : 0,
      city: index > -1 ? cities[index] : cities[0]
    })
  },

  goBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack()
      return
    }
    wx.reLaunch({ url: '/pages/touring/touring' })
  },

  chooseCity(e) {
    const index = Number(e.currentTarget.dataset.index)
    this.setData({
      activeIndex: index,
      city: cities[index] || cities[0]
    })
  },

  openRoutePlanner() {
    wx.navigateTo({
      url: `/pages/siluwenyi/siluwenyi?city=${encodeURIComponent(this.data.city.name)}`
    })
  },

  openImageMaker() {
    wx.navigateTo({
      url: '/pages/arViewer/arViewer'
    })
  }
})
