const languageList = [
  { key: 'mandarin', name: '普通话', short: '普' },
  { key: 'gansu', name: '甘肃方言', short: '甘' },
  { key: 'english', name: 'English', short: 'EN' },
  { key: 'russian', name: 'Русский', short: 'RU' }
]

const scenarios = [
  { key: 'all', name: '全部' },
  { key: 'route', name: '问路' },
  { key: 'ticket', name: '票务' },
  { key: 'food', name: '点餐' },
  { key: 'hotel', name: '住宿' },
  { key: 'shop', name: '购物' },
  { key: 'help', name: '求助' }
]

const phraseGroups = [
  {
    id: 'route-center',
    scenario: 'route',
    title: '景区问路',
    mandarin: '请问游客中心怎么走？',
    gansu: '麻烦问一下，游客中心往阿达走？',
    english: 'Excuse me, how can I get to the visitor center?',
    russian: 'Извините, как пройти к туристическому центру?',
    tip: '适合景区入口、停车场和游客服务点。'
  },
  {
    id: 'route-toilet',
    scenario: 'route',
    title: '寻找卫生间',
    mandarin: '请问最近的卫生间在哪里？',
    gansu: '麻烦问一下，最近的卫生间在阿达？',
    english: 'Excuse me, where is the nearest restroom?',
    russian: 'Извините, где ближайший туалет?',
    tip: '适合老人、亲子出行时快速询问。'
  },
  {
    id: 'ticket-book',
    scenario: 'ticket',
    title: '门票预约',
    mandarin: '我想预约明天上午的门票。',
    gansu: '我想约明早上的票，麻烦看一下撒。',
    english: 'I would like to book a ticket for tomorrow morning.',
    russian: 'Я хотел бы забронировать билет на завтра утром.',
    tip: '适合博物馆、石窟、热门景区预约咨询。'
  },
  {
    id: 'ticket-guide',
    scenario: 'ticket',
    title: '询问讲解',
    mandarin: '这里有中文讲解或语音导览吗？',
    gansu: '这达有中文讲解或者语音导览没？',
    english: 'Is there a Chinese guide or audio guide here?',
    russian: 'Здесь есть экскурсовод на китайском или аудиогид?',
    tip: '适合莫高窟、麦积山、博物馆等文博场景。'
  },
  {
    id: 'food-special',
    scenario: 'food',
    title: '特色点餐',
    mandarin: '请推荐一份当地特色美食。',
    gansu: '给咱推荐一个本地攒劲的吃的嘛。',
    english: 'Could you recommend a local specialty dish?',
    russian: 'Порекомендуйте, пожалуйста, местное фирменное блюдо.',
    tip: '适合牛肉面馆、夜市和农家乐。'
  },
  {
    id: 'food-light',
    scenario: 'food',
    title: '少辣少油',
    mandarin: '请少放辣椒，口味清淡一点。',
    gansu: '辣子少些，味道清淡一点，麻烦了。',
    english: 'Please make it less spicy and lighter.',
    russian: 'Пожалуйста, сделайте менее острым и полегче.',
    tip: '适合带老人、孩子或口味清淡游客。'
  },
  {
    id: 'hotel-checkin',
    scenario: 'hotel',
    title: '酒店入住',
    mandarin: '你好，我已经预订了房间，想办理入住。',
    gansu: '你好，我订下房子了，想办入住。',
    english: 'Hello, I have a reservation and would like to check in.',
    russian: 'Здравствуйте, у меня забронирован номер, я хотел бы заселиться.',
    tip: '适合酒店、民宿和驿站前台。'
  },
  {
    id: 'hotel-luggage',
    scenario: 'hotel',
    title: '寄存行李',
    mandarin: '请问可以寄存行李到下午吗？',
    gansu: '麻烦问一下，行李能寄到下午不？',
    english: 'May I store my luggage until this afternoon?',
    russian: 'Можно оставить багаж до второй половины дня?',
    tip: '适合换乘、离店后继续游览。'
  },
  {
    id: 'shop-price',
    scenario: 'shop',
    title: '文创价格',
    mandarin: '这个文创产品多少钱？',
    gansu: '这个文创卖多少钱嘛？',
    english: 'How much is this cultural creative product?',
    russian: 'Сколько стоит этот сувенир?',
    tip: '适合文创店、夜市摊位和博物馆商店。'
  },
  {
    id: 'shop-package',
    scenario: 'shop',
    title: '打包邮寄',
    mandarin: '可以帮我打包并邮寄吗？',
    gansu: '能不能帮我包好，再寄一下？',
    english: 'Could you pack it and ship it for me?',
    russian: 'Можете упаковать и отправить это для меня?',
    tip: '适合陶杯、书签、明信片等文创购买。'
  },
  {
    id: 'help-hospital',
    scenario: 'help',
    title: '身体不适',
    mandarin: '我有些不舒服，请问附近有医院或药店吗？',
    gansu: '我有点不舒服，附近有医院或者药店没？',
    english: 'I feel unwell. Is there a hospital or pharmacy nearby?',
    russian: 'Мне нехорошо. Поблизости есть больница или аптека?',
    tip: '适合高原、沙漠、长途乘车后的突发状况。'
  },
  {
    id: 'help-contact',
    scenario: 'help',
    title: '联系同伴',
    mandarin: '我和同伴走散了，请帮我联系一下。',
    gansu: '我跟同伴走散了，麻烦帮我联系一下。',
    english: 'I got separated from my companions. Please help me contact them.',
    russian: 'Я потерял своих спутников. Помогите мне связаться с ними, пожалуйста.',
    tip: '适合景区人流密集、夜市和车站。'
  },
  {
    id: 'route-bus',
    scenario: 'route',
    title: '公交换乘',
    mandarin: '请问去火车站坐哪路车？',
    gansu: '麻烦问一下，去火车站坐哪一路车嘛？',
    english: 'Which bus should I take to the railway station?',
    russian: 'На каком автобусе доехать до железнодорожного вокзала?',
    tip: '适合兰州、天水、张掖等城市内换乘。'
  },
  {
    id: 'route-distance',
    scenario: 'route',
    title: '询问距离',
    mandarin: '从这里走过去大概需要多久？',
    gansu: '从这达走过去大概要多长时间？',
    english: 'How long does it take to walk there from here?',
    russian: 'Сколько времени идти туда отсюда пешком?',
    tip: '适合步行街区、景区入口到观景台。'
  },
  {
    id: 'ticket-open',
    scenario: 'ticket',
    title: '开放时间',
    mandarin: '请问今天几点停止入园？',
    gansu: '麻烦问一下，今天几点就不让进园了？',
    english: 'What time is the last admission today?',
    russian: 'Во сколько сегодня заканчивается вход?',
    tip: '适合莫高窟、嘉峪关、丹霞等有闭园时间的景区。'
  },
  {
    id: 'ticket-student',
    scenario: 'ticket',
    title: '优惠票',
    mandarin: '请问学生证或老年证可以优惠吗？',
    gansu: '学生证或者老年证能优惠不？',
    english: 'Is there a discount for students or seniors?',
    russian: 'Есть скидка для студентов или пожилых людей?',
    tip: '适合售票窗口和线上预约核验。'
  },
  {
    id: 'food-beef-noodle',
    scenario: 'food',
    title: '牛肉面口味',
    mandarin: '我要一碗细面，辣子少一点。',
    gansu: '我要一碗细的，辣子少些。',
    english: 'I would like a bowl of thin noodles with less chili.',
    russian: 'Мне одну порцию тонкой лапши, поменьше перца.',
    tip: '适合兰州牛肉面馆快速点餐。'
  },
  {
    id: 'food-halal',
    scenario: 'food',
    title: '清真餐饮',
    mandarin: '请问附近有清真餐厅吗？',
    gansu: '麻烦问一下，附近有清真饭馆没？',
    english: 'Is there a halal restaurant nearby?',
    russian: 'Поблизости есть халяльный ресторан?',
    tip: '适合临夏、兰州、张掖等餐饮咨询。'
  },
  {
    id: 'hotel-quiet',
    scenario: 'hotel',
    title: '安静房间',
    mandarin: '可以帮我安排一间安静一点的房间吗？',
    gansu: '能不能给我安排个清静些的房子？',
    english: 'Could you arrange a quieter room for me?',
    russian: 'Можно номер потише?',
    tip: '适合老人、亲子和长途旅客入住。'
  },
  {
    id: 'hotel-wifi',
    scenario: 'hotel',
    title: '无线网络',
    mandarin: '请问无线网络密码是多少？',
    gansu: '麻烦问一下，Wi-Fi 密码是多少？',
    english: 'What is the Wi-Fi password?',
    russian: 'Какой пароль от Wi-Fi?',
    tip: '适合酒店、驿站、咖啡馆。'
  },
  {
    id: 'shop-discount',
    scenario: 'shop',
    title: '询问优惠',
    mandarin: '如果买两件，可以优惠一点吗？',
    gansu: '买两个的话，能不能便宜些嘛？',
    english: 'If I buy two, could I get a discount?',
    russian: 'Если купить две штуки, можно скидку?',
    tip: '适合文创店、夜市和集市。'
  },
  {
    id: 'shop-local',
    scenario: 'shop',
    title: '本地特产',
    mandarin: '请推荐适合带走的本地特产。',
    gansu: '给咱推荐点适合带走的本地特产嘛。',
    english: 'Please recommend some local specialties to take home.',
    russian: 'Порекомендуйте местные продукты, которые удобно увезти.',
    tip: '适合伴手礼和特产购买。'
  },
  {
    id: 'help-police',
    scenario: 'help',
    title: '寻求工作人员',
    mandarin: '请帮我找景区工作人员。',
    gansu: '麻烦帮我找一下景区工作人员。',
    english: 'Please help me find a staff member.',
    russian: 'Помогите мне найти сотрудника, пожалуйста.',
    tip: '适合遗失物品、迷路和紧急情况。'
  },
  {
    id: 'help-weather',
    scenario: 'help',
    title: '天气变化',
    mandarin: '今天风沙大吗？需要注意什么？',
    gansu: '今天风沙大不？有啥要注意的？',
    english: 'Is it windy and dusty today? What should I watch out for?',
    russian: 'Сегодня сильный ветер и пыль? На что обратить внимание?',
    tip: '适合敦煌、嘉峪关、张掖等户外场景。'
  }
]

const dialectWords = [
  { word: '攒劲', meaning: '好、厉害、舒服', sample: '这碗牛肉面真攒劲。', standard: '这碗牛肉面很好吃。', area: '兰州及西北常见表达' },
  { word: '尕', meaning: '小、年纪小', sample: '尕娃娃慢慢走。', standard: '小朋友慢慢走。', area: '甘肃多地常见' },
  { word: '谝 / 喧关', meaning: '聊天、闲谈', sample: '晚上在黄河边喧关一阵。', standard: '晚上在黄河边聊一会儿。', area: '兰州、河西等地常见' },
  { word: '下茬', meaning: '认真、用心、下功夫', sample: '这个路线要下茬看时间。', standard: '这个路线要认真看时间。', area: '西北口语常见' },
  { word: '亮豁', meaning: '清楚、明白、敞亮', sample: '这个导览说得亮豁。', standard: '这个导览说得很清楚。', area: '兰州话常见' },
  { word: '满福', meaning: '舒服、满足', sample: '走完黄河边心里满福。', standard: '走完黄河边感觉很舒服。', area: '兰州及周边口语' },
  { word: '阿达', meaning: '哪里、什么地方', sample: '游客中心在阿达？', standard: '游客中心在哪里？', area: '西北口语常见' },
  { word: '喋', meaning: '吃', sample: '先喋碗面再出发。', standard: '先吃碗面再出发。', area: '西北口语常见' },
  { word: '奏啥', meaning: '做什么、干什么', sample: '你们今天奏啥去？', standard: '你们今天准备去做什么？', area: '兰州、陇中口语常见' },
  { word: '碎怂', meaning: '小孩、年轻人，口语色彩较重', sample: '碎怂们排好队慢慢走。', standard: '孩子们排好队慢慢走。', area: '西北口语，使用时注意语境' },
  { word: '瓷实', meaning: '可靠、扎实、结实', sample: '这个攻略做得瓷实。', standard: '这个攻略做得很扎实。', area: '甘肃多地常见' },
  { word: '一搭里', meaning: '一起、一块儿', sample: '咱们一搭里去中山桥。', standard: '我们一起去中山桥。', area: '兰州及周边口语' },
  { word: '没麻达', meaning: '没问题、可以', sample: '寄存行李没麻达。', standard: '寄存行李没问题。', area: '西北口语常见' },
  { word: '得劲', meaning: '舒服、合适', sample: '这条慢行路线很得劲。', standard: '这条慢行路线很舒服。', area: '甘肃及西北常见' },
  { word: '撒', meaning: '语气助词，让语气更自然', sample: '你先看一下撒。', standard: '你先看一下吧。', area: '甘肃多地口语' },
  { word: '嘛', meaning: '语气助词，表示询问或商量', sample: '能不能便宜些嘛？', standard: '能不能便宜一点？', area: '西北口语常见' },
  { word: '这达', meaning: '这里', sample: '这达能买票不？', standard: '这里可以买票吗？', area: '兰州及西北常见' },
  { word: '那达', meaning: '那里', sample: '那达是不是游客中心？', standard: '那里是不是游客中心？', area: '兰州及西北常见' },
  { word: '啥价钱', meaning: '多少钱、什么价格', sample: '这个文创啥价钱？', standard: '这个文创多少钱？', area: '西北口语常见' },
  { word: '便宜些', meaning: '便宜一点', sample: '能不能便宜些嘛？', standard: '能不能便宜一点？', area: '甘肃多地口语' },
  { word: '清静些', meaning: '安静一点', sample: '给我安排个清静些的房子。', standard: '给我安排一个安静一点的房间。', area: '兰州及周边常见' },
  { word: '房子', meaning: '房间', sample: '我订下房子了。', standard: '我预订了房间。', area: '口语场景常见' },
  { word: '看一下撒', meaning: '请帮忙看一下', sample: '麻烦给我看一下撒。', standard: '请帮我看一下。', area: '甘肃多地口语' },
  { word: '慢慢走', meaning: '小心走、别着急', sample: '山路上慢慢走。', standard: '山路上小心一点。', area: '旅行提醒常用' },
  { word: '照顾一下', meaning: '帮忙、关照', sample: '老人走得慢，麻烦照顾一下。', standard: '老人走得慢，请帮忙照顾一下。', area: '甘肃多地口语' },
  { word: '够不够', meaning: '是否足够', sample: '这个时间够不够？', standard: '这个时间是否足够？', area: '通用口语' },
  { word: '赶趟不', meaning: '来不来得及', sample: '现在去车站赶趟不？', standard: '现在去车站来得及吗？', area: '西北口语常见' },
  { word: '歇一哈', meaning: '休息一下', sample: '娃累了，想歇一哈。', standard: '孩子累了，想休息一下。', area: '甘肃多地口语' },
  { word: '热得很', meaning: '很热', sample: '今天太阳热得很。', standard: '今天太阳很晒。', area: '甘肃多地口语' },
  { word: '冷得很', meaning: '很冷', sample: '晚上冷得很，要加衣服。', standard: '晚上很冷，要加衣服。', area: '甘肃多地口语' },
  { word: '风大得很', meaning: '风很大', sample: '今天风大得很。', standard: '今天风很大。', area: '河西、敦煌等户外场景常用' },
  { word: '沙尘大', meaning: '风沙较大', sample: '今天沙尘大，眼镜戴上。', standard: '今天风沙较大，请戴好眼镜。', area: '河西走廊旅行场景' },
  { word: '娃', meaning: '孩子', sample: '娃有点累了。', standard: '孩子有点累了。', area: '甘肃多地口语' },
  { word: '老人家', meaning: '老人、长辈', sample: '老人家走得慢。', standard: '老人走得比较慢。', area: '礼貌口语' }
]

const gansuReplacementPairs = [
  ['请问', '麻烦问一下'],
  ['麻烦问一下麻烦问一下', '麻烦问一下'],
  ['您好', '你好'],
  ['这里', '这达'],
  ['那里', '那达'],
  ['哪里', '阿达'],
  ['什么地方', '阿达'],
  ['在哪里', '在阿达'],
  ['在哪儿', '在阿达'],
  ['怎么走', '往阿达走'],
  ['怎么去', '咋个去'],
  ['如何去', '咋个去'],
  ['需要多久', '要多长时间'],
  ['大概需要多久', '大概要多长时间'],
  ['多少钱', '啥价钱'],
  ['价格是多少', '啥价钱'],
  ['可以优惠一点吗', '能不能便宜些嘛'],
  ['便宜一点', '便宜些'],
  ['推荐', '给咱推荐'],
  ['很好', '很攒劲'],
  ['好吃', '攒劲'],
  ['好玩', '攒劲'],
  ['清楚', '亮豁'],
  ['明白', '亮豁'],
  ['舒服', '满福'],
  ['休息一下', '歇一哈'],
  ['小朋友', '尕娃娃'],
  ['孩子', '娃'],
  ['老人', '老人家'],
  ['吃', '喋'],
  ['聊天', '喧关'],
  ['一起', '一搭里'],
  ['一块儿', '一搭里'],
  ['没问题', '没麻达'],
  ['可以吗', '行不行嘛'],
  ['可以不可以', '行不行嘛'],
  ['能不能', '能不能'],
  ['请帮我', '麻烦帮我'],
  ['帮我', '给咱'],
  ['看一下', '看一下撒'],
  ['预订了房间', '订下房子了'],
  ['房间', '房子'],
  ['安静一点', '清静些'],
  ['少一点', '少些'],
  ['辣椒', '辣子'],
  ['清淡一点', '清淡些'],
  ['来得及吗', '赶趟不'],
  ['车站', '车站'],
  ['游客中心', '游客中心'],
  ['卫生间', '卫生间'],
  ['门票', '票'],
  ['工作人员', '工作人员'],
  ['风很大', '风大得很'],
  ['很热', '热得很'],
  ['很冷', '冷得很'],
  ['谢谢', '谢谢了'],
  ['吧', '撒']
]

const mandarinReplacementPairs = [
  ['麻烦问一下', '请问'],
  ['这达', '这里'],
  ['那达', '那里'],
  ['阿达', '哪里'],
  ['往阿达走', '怎么走'],
  ['咋个去', '怎么去'],
  ['啥价钱', '多少钱'],
  ['便宜些', '便宜一点'],
  ['给咱推荐', '请推荐'],
  ['攒劲', '很好'],
  ['亮豁', '清楚'],
  ['满福', '舒服'],
  ['歇一哈', '休息一下'],
  ['尕娃娃', '小朋友'],
  ['娃', '孩子'],
  ['老人家', '老人'],
  ['喋', '吃'],
  ['喧关', '聊天'],
  ['一搭里', '一起'],
  ['没麻达', '没问题'],
  ['行不行嘛', '可以吗'],
  ['看一下撒', '看一下'],
  ['订下房子了', '预订了房间'],
  ['房子', '房间'],
  ['清静些', '安静一点'],
  ['少些', '少一点'],
  ['辣子', '辣椒'],
  ['清淡些', '清淡一点'],
  ['赶趟不', '来得及吗'],
  ['风大得很', '风很大'],
  ['热得很', '很热'],
  ['冷得很', '很冷'],
  ['撒', '吧'],
  ['嘛', '']
]

const quickKits = [
  { title: '第一次到兰州', scene: '问路 + 牛肉面 + 黄河边', text: '请问中山桥怎么走？我想吃一碗当地牛肉面。' },
  { title: '敦煌看石窟', scene: '预约 + 讲解 + 日落', text: '我已经预约了门票，请问在哪里换票和听讲解？' },
  { title: '张掖看丹霞', scene: '观景台 + 返程车', text: '请问几号观景台适合看日落？返程车在哪里坐？' },
  { title: '临夏找美食', scene: '清真餐饮 + 礼貌询问', text: '请问这里有什么招牌菜？口味可以清淡一点吗？' },
  { title: '亲子出行求助', scene: '卫生间 + 休息点', text: '请问最近的卫生间和休息区在哪里？孩子有点累了。' }
]

const readingMap = {
  '麻烦问一下': 'ma fan wen yi xia',
  '阿达': 'a da',
  '攒劲': 'zan jin',
  '尕': 'ga',
  '谝': 'pian',
  '喧关': 'xuan guan',
  '下茬': 'xia cha',
  '亮豁': 'liang huo',
  '满福': 'man fu',
  '喋': 'die',
  '奏啥': 'zou sha',
  '碎怂': 'sui song',
  '瓷实': 'ci shi',
  '一搭里': 'yi da li',
  '没麻达': 'mei ma da',
  '得劲': 'de jin',
  '往阿达走': 'wang a da zou',
  '辣子少些': 'la zi shao xie',
  '撒': 'sa',
  '嘛': 'ma',
  '这达': 'zhe da',
  '那达': 'na da',
  '啥价钱': 'sha jia qian',
  '便宜些': 'pian yi xie',
  '清静些': 'qing jing xie',
  '房子': 'fang zi',
  '看一下撒': 'kan yi xia sa',
  '慢慢走': 'man man zou',
  '照顾一下': 'zhao gu yi xia',
  '赶趟不': 'gan tang bu',
  '歇一哈': 'xie yi ha',
  '热得很': 're de hen',
  '冷得很': 'leng de hen',
  '风大得很': 'feng da de hen',
  '沙尘大': 'sha chen da',
  '娃': 'wa',
  '老人家': 'lao ren jia',
  '行不行嘛': 'xing bu xing ma',
  '咋个去': 'za ge qu'
}

const dialectRegions = [
  { city: '兰州', title: '兰州话 / 兰银官话代表区', desc: '语气干脆，生活词很有烟火气，适合做游客与本地商户沟通的入门方言包。', tags: ['攒劲', '尕', '亮豁'] },
  { city: '河西走廊', title: '河西片区 / 丝路交流带', desc: '酒泉、张掖、嘉峪关、武威等地口音和词汇带有走廊城市的混合感，适合景区、交通和文博场景。', tags: ['喧关', '下茬', '阿达'] },
  { city: '陇东陇中', title: '中原官话影响明显', desc: '平凉、庆阳、定西等地与关中、陇中交流紧密，适合加入农耕、黄土塬和民俗体验表达。', tags: ['尕', '喋', '满福'] },
  { city: '陇南', title: '南北过渡口音区', desc: '山地、秦巴文化和周边方言相互影响，适合山水旅行、民宿住宿和问路表达。', tags: ['慢走', '山路', '问路'] }
]

const cultureCards = [
  {
    city: '临夏',
    nation: '回族、东乡族、保安族文化场景',
    title: '清真饮食与做客礼节',
    desc: '进入清真餐饮场所时尊重饮食习惯，不携带不合适的外食。点餐前可以先问招牌菜、是否可少辣、是否方便打包。',
    phrase: '请问这里有什么招牌菜？我想点一份当地特色。'
  },
  {
    city: '甘南',
    nation: '藏族文化场景',
    title: '寺院参观与拍照礼仪',
    desc: '进入寺院保持安静，按现场提示行走，不随意触碰法器、经幡和供品。拍照或录音前先确认是否允许。',
    phrase: '请问这里可以拍照吗？我会保持安静。'
  },
  {
    city: '肃南',
    nation: '裕固族草原文化场景',
    title: '草原做客与生态尊重',
    desc: '参与民俗体验时先听主人说明，尊重服饰、歌舞和饮食习惯；草原区域注意垃圾带走，不打扰牧场秩序。',
    phrase: '谢谢你的介绍，我们会尊重这里的习俗。'
  },
  {
    city: '兰州',
    nation: '城市烟火与牛肉面场景',
    title: '排队点餐与本地沟通',
    desc: '牛肉面馆节奏较快，可以提前想好粗细、辣子和小菜。需要清淡口味时直接说明少辣少油。',
    phrase: '我要一碗细面，辣子少一点，谢谢。'
  },
  {
    city: '敦煌',
    nation: '丝路国际交流场景',
    title: '中外游客友好沟通',
    desc: '敦煌、嘉峪关、张掖等热门目的地常遇到外地与外籍游客，英语、俄语短句适合问路、购票和文创购买。',
    phrase: '请问去莫高窟数字展示中心怎么走？'
  }
]

const fallbackTerms = [
  { zh: '游客中心', en: 'visitor center', ru: 'туристический центр', gs: '游客中心' },
  { zh: '卫生间', en: 'restroom', ru: 'туалет', gs: '卫生间' },
  { zh: '门票', en: 'ticket', ru: 'билет', gs: '票' },
  { zh: '医院', en: 'hospital', ru: 'больница', gs: '医院' },
  { zh: '药店', en: 'pharmacy', ru: 'аптека', gs: '药店' },
  { zh: '车站', en: 'station', ru: 'вокзал', gs: '车站' },
  { zh: '酒店', en: 'hotel', ru: 'отель', gs: '酒店' },
  { zh: '多少钱', en: 'how much', ru: 'сколько стоит', gs: '多少钱嘛' }
]

function buildLanguageOptions(activeKey, classPrefix) {
  return languageList.map(item => ({
    ...item,
    className: item.key === activeKey ? `${classPrefix} active` : classPrefix
  }))
}

function decorateScenarios(activeKey) {
  return scenarios.map(item => ({
    ...item,
    className: item.key === activeKey ? 'scenario-chip active' : 'scenario-chip'
  }))
}

function filterPhrases(scenario, keyword) {
  const search = String(keyword || '').trim().toLowerCase()
  return phraseGroups.filter(item => {
    const matchScenario = scenario === 'all' || item.scenario === scenario
    const text = [item.title, item.mandarin, item.gansu, item.english, item.russian, item.tip].join(' ').toLowerCase()
    return matchScenario && (!search || text.indexOf(search) !== -1)
  })
}

function findPhrase(text) {
  const value = String(text || '').trim()
  return phraseGroups.find(item => {
    return [item.mandarin, item.gansu, item.english, item.russian].some(field => field === value)
  })
}

function phraseValue(phrase, lang) {
  if (!phrase) return ''
  if (lang === 'english') return phrase.english
  if (lang === 'russian') return phrase.russian
  if (lang === 'gansu') return phrase.gansu
  return phrase.mandarin
}

function replaceTerms(text, lang) {
  let result = String(text || '')
  fallbackTerms.forEach(item => {
    const target = lang === 'english' ? item.en : lang === 'russian' ? item.ru : lang === 'gansu' ? item.gs : item.zh
    result = result.replace(new RegExp(item.zh, 'g'), target)
  })

  if (lang === 'gansu') {
    gansuReplacementPairs.forEach(([from, to]) => {
      result = result.replace(new RegExp(from, 'g'), to)
    })
    return polishGansuSentence(result)
  }

  if (lang === 'mandarin') {
    mandarinReplacementPairs.forEach(([from, to]) => {
      result = result.replace(new RegExp(from, 'g'), to)
    })
    return result.replace(/\s{2,}/g, ' ').trim()
  }

  return result
}

function polishGansuSentence(text) {
  let result = String(text || '')
    .replace(/麻烦问一下，麻烦问一下/g, '麻烦问一下，')
    .replace(/麻烦问一下麻烦问一下/g, '麻烦问一下')
    .replace(/给咱给咱/g, '给咱')
    .replace(/票票/g, '票')
    .replace(/撒。/g, '撒。')
    .replace(/吗？/g, '不？')
    .replace(/吗\?/g, '不？')
    .replace(/么？/g, '不？')
    .replace(/一点一点/g, '一点')

  if (!/[。？！?]$/.test(result) && result.length < 34) {
    result += '。'
  }

  return result
}

function translateText(text, toLang) {
  const phrase = findPhrase(text)
  if (phrase) return phraseValue(phrase, toLang)

  const replaced = replaceTerms(text, toLang)
  if (toLang === 'english') return 'Travel phrase: ' + replaced
  if (toLang === 'russian') return 'Туристическая фраза: ' + replaced
  if (toLang === 'gansu') return replaced
  return replaced
}

function getOutputLangName(lang) {
  const item = languageList.find(language => language.key === lang)
  return item ? item.name : '译文'
}

function buildReadingHint(text, lang) {
  const value = String(text || '').trim()
  if (!value) return ''

  if (lang === 'english') {
    return '朗读提示：按英语短句自然朗读，遇到景区名可保留中文名。'
  }

  if (lang === 'russian') {
    return '朗读提示：俄语可直接展示给对方查看；景区名、城市名可指给工作人员确认。'
  }

  const matches = Object.keys(readingMap).filter(key => value.indexOf(key) > -1)
  if (!matches.length) {
    return lang === 'gansu'
      ? '读音提示：按普通话慢读即可，语气自然一些。'
      : '读音提示：按普通话朗读。'
  }

  return '不好念的词：' + matches.map(key => `${key}(${readingMap[key]})`).join('，')
}

function buildReplacementPreview() {
  return gansuReplacementPairs
    .filter(([from]) => from.length > 1 && !['麻烦问一下麻烦问一下', '能不能', '游客中心', '卫生间', '车站'].includes(from))
    .slice(0, 28)
    .map(([from, to]) => ({ from, to }))
}

Page({
  data: {
    fromLang: 'mandarin',
    toLang: 'gansu',
    fromLanguages: buildLanguageOptions('mandarin', 'lang-chip'),
    toLanguages: buildLanguageOptions('gansu', 'lang-chip'),
    activeScenario: 'all',
    scenarioTabs: decorateScenarios('all'),
    keyword: '',
    inputText: '请问游客中心怎么走？',
    outputText: '麻烦问一下，游客中心往阿达走？',
    readingHint: buildReadingHint('麻烦问一下，游客中心往阿达走？', 'gansu'),
    outputLangName: getOutputLangName('gansu'),
    isSpeaking: false,
    phraseGroups: filterPhrases('all', ''),
    dialectWords,
    replacementPreview: buildReplacementPreview(),
    dialectRegions,
    cultureCards,
    quickKits,
    activeCulture: cultureCards[0],
    activeWord: dialectWords[0],
    voiceState: '点击录音，说完后可回放或选择最接近的常用表达',
    isListening: false,
    recordPath: '',
    recordDuration: 0,
    recordLabel: '暂无录音',
    showVoiceHints: false,
    voiceHints: phraseGroups.slice(0, 4),
    favoriteCount: 0,
    historyRecords: [],
    favoriteRecords: [],
    showFavorites: false,
    lastCopied: ''
  },

  onLoad() {
    this.recorder = wx.getRecorderManager()
    this.audio = wx.createInnerAudioContext()
    this.ttsAudio = wx.createInnerAudioContext()

    this.recorder.onStart(() => {
      this.recordStartTime = Date.now()
      this.setData({
        isListening: true,
        voiceState: '正在录音，请说出要翻译的内容',
        showVoiceHints: false
      })
    })

    this.recorder.onStop(res => {
      const duration = Math.max(1, Math.round((Date.now() - this.recordStartTime) / 1000))
      const hints = filterPhrases(this.data.activeScenario, this.data.keyword).slice(0, 4)
      this.setData({
        isListening: false,
        recordPath: res.tempFilePath,
        recordDuration: duration,
        recordLabel: duration + ' 秒',
        voiceState: '录音已保存，可回放确认，也可选择下方最接近的表达',
        showVoiceHints: true,
        voiceHints: hints.length ? hints : phraseGroups.slice(0, 4)
      })
    })

    this.recorder.onError(() => {
      this.setData({
        isListening: false,
        voiceState: '录音没有完成，请检查麦克风权限'
      })
      wx.showToast({ title: '请允许录音权限', icon: 'none' })
    })

    this.audio.onEnded(() => {
      this.setData({ voiceState: '录音播放完成' })
    })

    this.ttsAudio.onEnded(() => {
      this.setData({ isSpeaking: false })
    })

    this.ttsAudio.onError(() => {
      this.setData({ isSpeaking: false })
      wx.showToast({ title: '朗读暂不可用', icon: 'none' })
    })

    this.refreshRecords()
  },

  onUnload() {
    if (this.audio) {
      this.audio.stop()
      this.audio.destroy()
    }
    if (this.ttsAudio) {
      this.ttsAudio.stop()
      this.ttsAudio.destroy()
    }
  },

  onShow() {
    this.refreshRecords()
  },

  refreshRecords() {
    const historyRecords = wx.getStorageSync('translateHistory') || []
    const favoriteRecords = wx.getStorageSync('translateFavorites') || []

    this.setData({
      historyRecords: historyRecords.slice(0, 6),
      favoriteRecords: favoriteRecords.slice(0, 6),
      favoriteCount: favoriteRecords.length
    })
  },

  goBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack()
      return
    }
    wx.reLaunch({ url: '/pages/touring/touring' })
  },

  chooseFrom(e) {
    const fromLang = e.currentTarget.dataset.lang
    this.setData({
      fromLang,
      fromLanguages: buildLanguageOptions(fromLang, 'lang-chip')
    })
  },

  chooseTo(e) {
    const toLang = e.currentTarget.dataset.lang
    this.setData({
      toLang,
      toLanguages: buildLanguageOptions(toLang, 'lang-chip'),
      outputLangName: getOutputLangName(toLang)
    }, () => this.translateNow())
  },

  swapLang() {
    const fromLang = this.data.toLang
    const toLang = this.data.fromLang
    this.setData({
      fromLang,
      toLang,
      fromLanguages: buildLanguageOptions(fromLang, 'lang-chip'),
      toLanguages: buildLanguageOptions(toLang, 'lang-chip'),
      inputText: this.data.outputText,
      outputText: this.data.inputText,
      outputLangName: getOutputLangName(toLang),
      readingHint: buildReadingHint(this.data.inputText, toLang)
    })
  },

  setScenario(e) {
    const activeScenario = e.currentTarget.dataset.key
    const phraseList = filterPhrases(activeScenario, this.data.keyword)
    this.setData({
      activeScenario,
      scenarioTabs: decorateScenarios(activeScenario),
      phraseGroups: phraseList,
      voiceHints: phraseList.slice(0, 4)
    })
  },

  onKeywordInput(e) {
    const keyword = e.detail.value
    const phraseList = filterPhrases(this.data.activeScenario, keyword)
    this.setData({
      keyword,
      phraseGroups: phraseList,
      voiceHints: phraseList.slice(0, 4)
    })
  },

  onInput(e) {
    this.setData({ inputText: e.detail.value })
  },

  translateNow() {
    const text = this.data.inputText.trim()
    if (!text) {
      wx.showToast({ title: '先输入要翻译的内容', icon: 'none' })
      return
    }

    const outputText = translateText(text, this.data.toLang)
    this.setData({
      outputText,
      outputLangName: getOutputLangName(this.data.toLang),
      readingHint: buildReadingHint(outputText, this.data.toLang)
    })
    this.saveHistory(text, outputText)
  },

  saveHistory(input, output) {
    const history = wx.getStorageSync('translateHistory') || []
    const record = {
      id: 'history-' + Date.now(),
      input,
      output,
      fromLang: this.data.fromLang,
      toLang: this.data.toLang,
      time: '刚刚'
    }

    wx.setStorageSync('translateHistory', [record].concat(history).slice(0, 20))
    this.refreshRecords()
  },

  usePhrase(e) {
    const index = Number(e.currentTarget.dataset.index)
    const phrase = this.data.phraseGroups[index]
    if (!phrase) return
    this.applyPhrase(phrase)
  },

  useVoiceHint(e) {
    const index = Number(e.currentTarget.dataset.index)
    const phrase = this.data.voiceHints[index]
    if (!phrase) return
    this.applyPhrase(phrase)
  },

  applyPhrase(phrase) {
    const inputText = phraseValue(phrase, this.data.fromLang)
    const outputText = phraseValue(phrase, this.data.toLang)
    this.setData({
      inputText,
      outputText,
      outputLangName: getOutputLangName(this.data.toLang),
      readingHint: buildReadingHint(outputText, this.data.toLang),
      showVoiceHints: false
    })
  },

  chooseWord(e) {
    const index = Number(e.currentTarget.dataset.index)
    const activeWord = dialectWords[index]
    this.setData({
      activeWord,
      inputText: activeWord.sample,
      outputText: this.data.toLang === 'gansu' ? activeWord.sample : activeWord.standard,
      outputLangName: getOutputLangName(this.data.toLang),
      readingHint: buildReadingHint(this.data.toLang === 'gansu' ? activeWord.sample : activeWord.standard, this.data.toLang)
    })
  },

  chooseCulture(e) {
    const index = Number(e.currentTarget.dataset.index)
    const activeCulture = cultureCards[index]
    this.setData({
      activeCulture,
      inputText: activeCulture.phrase,
      outputText: translateText(activeCulture.phrase, this.data.toLang),
      outputLangName: getOutputLangName(this.data.toLang),
      readingHint: buildReadingHint(translateText(activeCulture.phrase, this.data.toLang), this.data.toLang)
    })
  },

  useQuickKit(e) {
    const index = Number(e.currentTarget.dataset.index)
    const kit = quickKits[index]
    if (!kit) return
    this.setData({
      inputText: kit.text,
      outputText: translateText(kit.text, this.data.toLang),
      outputLangName: getOutputLangName(this.data.toLang),
      readingHint: buildReadingHint(translateText(kit.text, this.data.toLang), this.data.toLang)
    }, () => this.saveHistory(kit.text, this.data.outputText))
  },

  useRecord(e) {
    const type = e.currentTarget.dataset.type
    const index = Number(e.currentTarget.dataset.index)
    const list = type === 'favorite' ? this.data.favoriteRecords : this.data.historyRecords
    const record = list[index]
    if (!record) return

    this.setData({
      inputText: record.input,
      outputText: record.output,
      fromLang: record.fromLang || this.data.fromLang,
      toLang: record.toLang || this.data.toLang,
      fromLanguages: buildLanguageOptions(record.fromLang || this.data.fromLang, 'lang-chip'),
      toLanguages: buildLanguageOptions(record.toLang || this.data.toLang, 'lang-chip'),
      outputLangName: getOutputLangName(record.toLang || this.data.toLang),
      readingHint: buildReadingHint(record.output, record.toLang || this.data.toLang)
    })
  },

  toggleFavorites() {
    this.setData({ showFavorites: !this.data.showFavorites })
  },

  clearHistory() {
    wx.showModal({
      title: '清空翻译记录',
      content: '只会清空本机保存的随行翻译记录，收藏短句不会删除。',
      confirmText: '清空',
      success: res => {
        if (!res.confirm) return
        wx.removeStorageSync('translateHistory')
        this.refreshRecords()
      }
    })
  },

  toggleListen() {
    if (this.data.isListening) {
      this.recorder.stop()
      return
    }

    this.ensureRecordPermission(() => {
      this.recorder.start({
        duration: 30000,
        sampleRate: 16000,
        numberOfChannels: 1,
        encodeBitRate: 48000,
        format: 'mp3'
      })
    })
  },

  ensureRecordPermission(next) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.record']) {
          next()
          return
        }

        wx.authorize({
          scope: 'scope.record',
          success: next,
          fail: () => {
            wx.showModal({
              title: '需要录音权限',
              content: '开启录音后可以保存旅途语音并回放确认。',
              confirmText: '去设置',
              success: modalRes => {
                if (modalRes.confirm) wx.openSetting()
              }
            })
          }
        })
      },
      fail: next
    })
  },

  playRecord() {
    if (!this.data.recordPath) {
      wx.showToast({ title: '还没有录音', icon: 'none' })
      return
    }

    this.audio.stop()
    this.audio.src = this.data.recordPath
    this.audio.play()
    this.setData({ voiceState: '正在回放录音' })
  },

  speakOutput() {
    const text = String(this.data.outputText || '').trim()
    if (!text) {
      wx.showToast({ title: '暂无可朗读内容', icon: 'none' })
      return
    }

    if (this.data.isSpeaking) {
      this.ttsAudio.stop()
      this.setData({ isSpeaking: false })
      return
    }

    const plugin = this.getSpeechPlugin()
    if (!plugin) return

    const lang = this.data.toLang === 'english' ? 'en_US' : this.data.toLang === 'russian' ? 'ru_RU' : 'zh_CN'
    this.setData({ isSpeaking: true })
    plugin.textToSpeech({
      lang,
      tts: true,
      content: text,
      success: res => {
        if (!res || !res.filename) {
          this.setData({ isSpeaking: false })
          wx.showToast({ title: '朗读暂不可用', icon: 'none' })
          return
        }
        this.ttsAudio.stop()
        this.ttsAudio.src = res.filename
        this.ttsAudio.play()
      },
      fail: () => {
        this.setData({ isSpeaking: false })
        wx.showToast({ title: '朗读暂不可用', icon: 'none' })
      }
    })
  },

  getSpeechPlugin() {
    if (typeof requirePlugin !== 'function') {
      wx.setClipboardData({ data: this.data.outputText })
      wx.showToast({ title: '已复制，可按提示朗读', icon: 'none' })
      return null
    }

    try {
      const plugin = requirePlugin('WechatSI')
      if (plugin && plugin.textToSpeech) return plugin
    } catch (error) {
      wx.setClipboardData({ data: this.data.outputText })
      wx.showToast({ title: '未开通朗读插件，已复制译文', icon: 'none' })
      return null
    }

    wx.setClipboardData({ data: this.data.outputText })
    wx.showToast({ title: '未开通朗读插件，已复制译文', icon: 'none' })
    return null
  },

  copyOutput() {
    const text = this.data.outputText
    if (!text) {
      wx.showToast({ title: '暂无译文', icon: 'none' })
      return
    }

    wx.setClipboardData({
      data: text,
      success: () => {
        this.setData({ lastCopied: text })
      }
    })
  },

  saveFavorite() {
    const text = this.data.outputText
    if (!text) {
      wx.showToast({ title: '暂无可收藏内容', icon: 'none' })
      return
    }

    const favorites = wx.getStorageSync('translateFavorites') || []
    const record = {
      id: 'phrase-' + Date.now(),
      input: this.data.inputText,
      output: this.data.outputText,
      fromLang: this.data.fromLang,
      toLang: this.data.toLang,
      time: '刚刚'
    }

    wx.setStorageSync('translateFavorites', [record].concat(favorites).slice(0, 30))
    this.refreshRecords()
    wx.showToast({ title: '已收藏', icon: 'success' })
  }
})
