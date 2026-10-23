const DEFAULT_ENV_ID = 'slwy-ai-d5ggwa78c5fd3ec30'
const DEFAULT_SERVICE = 'slwy-ai-final'

function getConfig() {
  const app = getApp()
  const globalData = app && app.globalData ? app.globalData : {}

  return {
    enabled: globalData.cloudRunEnabled !== false,
    envId: globalData.cloudRunEnvId || DEFAULT_ENV_ID,
    service: globalData.cloudRunService || DEFAULT_SERVICE
  }
}

function isEnabled() {
  const config = getConfig()
  return !!(config.enabled && wx.cloud && typeof wx.cloud.callContainer === 'function')
}

function requestJson(options) {
  const config = getConfig()

  return new Promise((resolve, reject) => {
    if (!isEnabled()) {
      reject(new Error('CLOUD_CONTAINER_NOT_AVAILABLE'))
      return
    }

    let settled = false
    const timer = setTimeout(() => {
      if (settled) return
      settled = true
      reject(new Error('CLOUD_CONTAINER_TIMEOUT'))
    }, options.timeout || 18000)

    wx.cloud.callContainer({
      config: {
        env: config.envId
      },
      path: options.path,
      method: options.method || 'GET',
      header: {
        'X-WX-SERVICE': config.service,
        'Content-Type': 'application/json',
        ...(options.header || {})
      },
      data: options.data || {},
      success: res => {
        if (settled) return
        settled = true
        clearTimeout(timer)
        resolve(res)
      },
      fail: err => {
        if (settled) return
        settled = true
        clearTimeout(timer)
        reject(err)
      }
    })
  })
}

function requestByUrl(options) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: options.url,
      method: options.method || 'GET',
      timeout: options.timeout || 30000,
      header: options.header || {},
      data: options.data || {},
      success: resolve,
      fail: reject
    })
  })
}

function readFileAsDataUrl(filePath) {
  return new Promise((resolve, reject) => {
    wx.getFileSystemManager().readFile({
      filePath,
      encoding: 'base64',
      success: res => resolve(`data:${guessMimeType(filePath)};base64,${res.data}`),
      fail: reject
    })
  })
}

function guessMimeType(filePath) {
  const lower = String(filePath || '').toLowerCase()
  if (lower.indexOf('.png') > -1) return 'image/png'
  if (lower.indexOf('.webp') > -1) return 'image/webp'
  if (lower.indexOf('.gif') > -1) return 'image/gif'
  return 'image/jpeg'
}

module.exports = {
  isEnabled,
  requestJson,
  requestByUrl,
  readFileAsDataUrl
}
