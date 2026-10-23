const demoStore = require('../../utils/demoStore')

const tabs = [
  { key: 'all', title: '全部', fullTitle: '全部订单', emptyMark: '单', emptyTitle: '还没有订单', emptyDesc: '去驼铃余响挑一份丝路文创吧', actionText: '去逛逛' },
  { key: 'ticket', title: '门票', fullTitle: '门票预约', emptyMark: '票', emptyTitle: '暂无门票预约', emptyDesc: '之后预约的景区门票会集中放在这里', actionText: '去看景点' },
  { key: 'refund', title: '售后', fullTitle: '退款售后', emptyMark: '退', emptyTitle: '暂无售后记录', emptyDesc: '退款、改期与售后进度会在这里同步', actionText: '联系客服' },
  { key: 'review', title: '待评价', fullTitle: '待评价', emptyMark: '评', emptyTitle: '暂无待评价内容', emptyDesc: '完成体验后，可以在这里给行程留下评价', actionText: '去社区看看' }
]

function money(value) {
  return '¥' + Number(value || 0).toFixed(0)
}

function normalizeOrder(order, index) {
  const items = order.items || []
  const total = order.total || items.reduce((sum, item) => {
    return sum + Number(item.cultural_product.money || 0) * Number(item.quantity || 1)
  }, 0)

  return {
    ...order,
    displayId: String(order.id || 'order-' + index).replace('order-', 'SR'),
    status: order.status && !String(order.status).includes('�') ? order.status : '待体验',
    totalText: money(total),
    itemCount: items.reduce((sum, item) => sum + Number(item.quantity || 1), 0),
    items
  }
}

function decorateTabs(activeType, counts) {
  return tabs.map(item => ({
    ...item,
    count: counts[item.key] || 0,
    className: item.key === activeType ? 'tab-item active' : 'tab-item'
  }))
}

Page({
  data: {
    activeType: 'all',
    pageTitle: '全部订单',
    tabs: decorateTabs('all', {}),
    orders: [],
    hasOrders: false,
    emptyTitle: '',
    emptyMark: '单',
    emptyDesc: '',
    emptyActionText: ''
  },

  onLoad(options) {
    this.setData({
      activeType: this.normalizeType(options.type || 'all')
    })
  },

  onShow() {
    this.loadOrders()
  },

  normalizeType(type) {
    return tabs.some(item => item.key === type) ? type : 'all'
  },

  switchTab(e) {
    const type = this.normalizeType(e.currentTarget.dataset.type)
    this.setData({ activeType: type }, () => this.loadOrders())
  },

  loadOrders() {
    const allOrders = demoStore.getOrders().map(normalizeOrder)
    const ticketOrders = (wx.getStorageSync('ticketOrders') || []).map(normalizeOrder)
    const refundOrders = (wx.getStorageSync('refundOrders') || []).map(normalizeOrder)
    const reviewOrders = allOrders.filter(item => item.status === '待评价')

    const groups = {
      all: allOrders,
      ticket: ticketOrders,
      refund: refundOrders,
      review: reviewOrders
    }
    const counts = {
      all: allOrders.length,
      ticket: ticketOrders.length,
      refund: refundOrders.length,
      review: reviewOrders.length
    }
    const activeTab = tabs.find(item => item.key === this.data.activeType) || tabs[0]
    const orders = groups[activeTab.key] || []

    this.setData({
      tabs: decorateTabs(activeTab.key, counts),
      pageTitle: activeTab.fullTitle,
      orders,
      hasOrders: orders.length > 0,
      emptyMark: activeTab.emptyMark,
      emptyTitle: activeTab.emptyTitle,
      emptyDesc: activeTab.emptyDesc,
      emptyActionText: activeTab.actionText
    })
  },

  openOrder(e) {
    const id = e.currentTarget.dataset.id
    wx.showToast({
      title: '订单详情已打开',
      icon: 'none'
    })
    this.setData({
      openedOrderId: id
    })
  },

  handleEmptyAction() {
    const actions = {
      all: '/pages/tuolingyuxiang/tuolingyuxiang',
      ticket: '/pages/yantushijing/yantushijing',
      review: '/pages/community/community'
    }
    const url = actions[this.data.activeType]

    if (url) {
      wx.navigateTo({ url })
      return
    }

    wx.navigateTo({ url: '/pages/profileService/profileService?type=service' })
  },

  primaryAction(e) {
    const action = e.currentTarget.dataset.action

    if (action === 'review') {
      wx.navigateTo({ url: '/pages/community/community' })
      return
    }

    if (action === 'refund') {
      wx.showToast({ title: '售后申请已受理', icon: 'none' })
      return
    }

    wx.navigateTo({ url: '/pages/tuolingyuxiang/tuolingyuxiang' })
  }
})
