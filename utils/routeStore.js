function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function getProfileUser() {
  return wx.getStorageSync('profileUser') || {}
}

const GUEST_ROUTE_ID_KEY = 'localRouteGuestId'

function cleanId(value) {
  return String(value || '').replace(/[^a-zA-Z0-9_-]/g, '')
}

function getLocalGuestId() {
  const savedId = cleanId(wx.getStorageSync(GUEST_ROUTE_ID_KEY))
  if (savedId) return savedId

  const guestId = 'guest-' + Date.now()
  wx.setStorageSync(GUEST_ROUTE_ID_KEY, guestId)
  return guestId
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

function getRouteStorageKey() {
  const accountId = getAccountId(getProfileUser())
  return accountId ? `localAiroutes:${accountId}` : ''
}

function canUseRouteHistory() {
  return !!getRouteStorageKey()
}

function getRoutes() {
  const key = getRouteStorageKey()
  if (!key) return []
  return clone(wx.getStorageSync(key) || [])
}

function saveRoute(route) {
  const key = getRouteStorageKey()
  if (!key) {
    return {
      saved: false,
      reason: 'storage-key-empty'
    }
  }

  const routes = wx.getStorageSync(key) || []
  wx.setStorageSync(key, [route].concat(routes).slice(0, 20))

  return {
    saved: true,
    key
  }
}

module.exports = {
  canUseRouteHistory,
  getRoutes,
  getRouteStorageKey,
  saveRoute
}
