const allCoupons = [
  {
    id: 'c1',
    title: '敦煌文博联票礼遇',
    desc: '适用于莫高窟数字展示、文创纪念与讲解服务抵扣。',
    amount: '¥30',
    condition: '满 199 可用',
    date: '有效期至 2026-12-31',
    type: '文博',
    claimed: false
  },
  {
    id: 'c2',
    title: '兰州黄河夜游券',
    desc: '黄河风情线游船、茶摊小食和夜游补给组合优惠。',
    amount: '8折',
    condition: '夜游专享',
    date: '有效期至 2026-10-01',
    type: '城市',
    claimed: false
  },
  {
    id: 'c3',
    title: '张掖丹霞观景券',
    desc: '适合日落场次使用，含摆渡提醒和拍照点推荐。',
    amount: '¥20',
    condition: '满 120 可用',
    date: '有效期至 2026-09-30',
    type: '景区',
    claimed: true
  },
  {
    id: 'c4',
    title: '丝路美食尝鲜券',
    desc: '牛肉面、酿皮、甜醅子、杏皮水等城市小吃可用。',
    amount: '¥15',
    condition: '满 60 可用',
    date: '有效期至 2026-08-31',
    type: '美食',
    claimed: false
  }
]

function decorateCoupons(list) {
  return list.map(item => ({
    ...item,
    buttonText: item.claimed ? '已领取' : '立即领取',
    cardClass: item.claimed ? 'coupon-card claimed' : 'coupon-card'
  }))
}

Page({
  data: {
    filters: ['全部', '文博', '景区', '城市', '美食'],
    activeFilter: '全部',
    coupons: decorateCoupons(allCoupons)
  },

  setFilter(e) {
    const activeFilter = e.currentTarget.dataset.type
    const source = activeFilter === '全部'
      ? allCoupons
      : allCoupons.filter(item => item.type === activeFilter)
    this.setData({
      activeFilter,
      coupons: decorateCoupons(source)
    })
  },

  claimCoupon(e) {
    const id = e.currentTarget.dataset.id
    allCoupons.forEach(item => {
      if (item.id === id) item.claimed = true
    })
    this.setFilter({ currentTarget: { dataset: { type: this.data.activeFilter } } })
    wx.showToast({ title: '领取成功', icon: 'success' })
  }
})
