const http = require('http')
const https = require('https')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

loadEnvFile(path.join(__dirname, '.env'))

const PORT = Number(process.env.PORT || process.env.AI_BUTLER_PROXY_PORT || 8787)
const ARK_CHAT_URL = process.env.ARK_CHAT_URL || 'https://ark.cn-beijing.volces.com/api/v3/chat/completions'
const ARK_VIDEO_TASK_URL = process.env.ARK_VIDEO_TASK_URL || 'https://ark.cn-beijing.volces.com/api/v3/contents/generations/tasks'
const ARK_API_KEY = process.env.ARK_API_KEY || ''
const ARK_MODEL = process.env.ARK_MODEL || 'deepseek-v4-flash-260425'
const ARK_SEEDANCE_MODEL = process.env.ARK_SEEDANCE_MODEL || 'doubao-seedance-1-5-pro-251215'
const WECHAT_APP_ID = process.env.WECHAT_APP_ID || ''
const WECHAT_APP_SECRET = process.env.WECHAT_APP_SECRET || ''
const LOGIN_TOKEN_SECRET = process.env.LOGIN_TOKEN_SECRET || crypto.randomBytes(16).toString('hex')
const MAX_JSON_BODY = 64 * 1024 * 1024
const MAX_UPLOAD_BODY = 72 * 1024 * 1024
const WECHAT_ACCESS_TOKEN_REFRESH_MARGIN = 5 * 60 * 1000

let wechatAccessTokenCache = {
  token: '',
  expiresAt: 0
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/)
  lines.forEach(line => {
    const text = line.trim()
    if (!text || text.startsWith('#')) return

    const equalIndex = text.indexOf('=')
    if (equalIndex === -1) return

    const key = text.slice(0, equalIndex).trim()
    const value = text.slice(equalIndex + 1).trim().replace(/^["']|["']$/g, '')
    if (key && !process.env[key]) {
      process.env[key] = value
    }
  })
}

function sendJson(res, statusCode, data) {
  const body = JSON.stringify(data)

  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  })
  res.end(body)
}

function readRawBody(req, maxSize) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let length = 0

    req.on('data', chunk => {
      chunks.push(chunk)
      length += chunk.length
      if (length > maxSize) {
        reject(new Error('REQUEST_TOO_LARGE'))
        req.destroy()
      }
    })
    req.on('end', () => {
      resolve(Buffer.concat(chunks))
    })
    req.on('error', reject)
  })
}

async function readBody(req) {
  try {
    const body = (await readRawBody(req, MAX_JSON_BODY)).toString('utf8')
    return body ? JSON.parse(body) : {}
  } catch (error) {
    if (error.message === 'REQUEST_TOO_LARGE') throw error
    throw new Error('BAD_JSON')
  }
}

function parseContentDisposition(value) {
  const result = {}
  String(value || '').split(';').forEach(part => {
    const equalIndex = part.indexOf('=')
    if (equalIndex === -1) return
    const key = part.slice(0, equalIndex).trim().toLowerCase()
    const rawValue = part.slice(equalIndex + 1).trim()
    result[key] = rawValue.replace(/^"|"$/g, '')
  })
  return result
}

async function readMultipart(req) {
  const contentType = req.headers['content-type'] || ''
  const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i)

  if (!boundaryMatch) {
    throw new Error('MULTIPART_BOUNDARY_MISSING')
  }

  const boundary = `--${boundaryMatch[1] || boundaryMatch[2]}`
  const body = (await readRawBody(req, MAX_UPLOAD_BODY)).toString('binary')
  const parts = body.split(boundary)
  const fields = {}
  const files = {}

  parts.forEach(part => {
    let text = part
    if (!text || text === '--\r\n' || text === '--') return
    if (text.startsWith('\r\n')) text = text.slice(2)
    if (text.endsWith('\r\n')) text = text.slice(0, -2)
    if (text.endsWith('--')) text = text.slice(0, -2)

    const headerEnd = text.indexOf('\r\n\r\n')
    if (headerEnd === -1) return

    const rawHeaders = text.slice(0, headerEnd).split('\r\n')
    let payload = text.slice(headerEnd + 4)
    if (payload.endsWith('\r\n')) payload = payload.slice(0, -2)

    const headers = {}
    rawHeaders.forEach(line => {
      const index = line.indexOf(':')
      if (index === -1) return
      headers[line.slice(0, index).trim().toLowerCase()] = line.slice(index + 1).trim()
    })

    const disposition = parseContentDisposition(headers['content-disposition'])
    const name = disposition.name
    if (!name) return

    if (disposition.filename) {
      files[name] = {
        filename: disposition.filename,
        mimeType: headers['content-type'] || guessMimeType(disposition.filename),
        buffer: Buffer.from(payload, 'binary')
      }
      return
    }

    fields[name] = Buffer.from(payload, 'binary').toString('utf8')
  })

  return { fields, files }
}

function guessMimeType(filename) {
  const ext = path.extname(filename || '').toLowerCase()
  const map = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.bmp': 'image/bmp',
    '.gif': 'image/gif',
    '.tif': 'image/tiff',
    '.tiff': 'image/tiff',
    '.heic': 'image/heic',
    '.heif': 'image/heif'
  }

  return map[ext] || 'image/jpeg'
}

function normalizeBoolean(value, defaultValue) {
  if (value === undefined || value === null || value === '') return defaultValue
  if (typeof value === 'boolean') return value
  return !['false', '0', 'no', 'off'].includes(String(value).toLowerCase())
}

function normalizeNumber(value, defaultValue, min, max) {
  const number = Number(value)
  if (!Number.isFinite(number)) return defaultValue
  return Math.max(min, Math.min(max, Math.round(number)))
}

function stringifyErrorPayload(value) {
  if (!value) return ''
  if (typeof value === 'string') return value

  try {
    return JSON.stringify(value)
  } catch (error) {
    return String(value)
  }
}

function isSensitiveSeedanceProblem(value) {
  const text = stringifyErrorPayload(value)
  return /sensitive|safety|risk|unsafe|violation|forbidden|policy|privacy|personal information|contain sensitive information|审核|敏感|风险|违规|不合规|安全|隐私|个人信息|实名|证件|车牌|二维码/i.test(text)
}

function sanitizeSeedancePrompt(prompt) {
  return String(prompt || '')
    .replace(/\*\*/g, '')
    .replace(/#{1,6}\s?/g, '')
    .replace(/`{1,3}/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/1\d{10}/g, '')
    .replace(/\d{6,}/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, 900)
}

function buildSeedancePrompt(prompt, safeMode) {
  const text = sanitizeSeedancePrompt(prompt)
  const styleGuide = '视频需要呈现甘肃丝路风格：敦煌壁画光影、驼铃远行、黄河风、丹霞色彩、古驿道氛围，镜头运动自然，画面电影感强，整体温暖庄重。'
  const safetyGuide = [
    '安全要求：画面只呈现自然风景、历史建筑外观、纹样光影和抽象旅行氛围。',
    '不要出现可识别人脸、儿童、真实姓名、手机号、证件、二维码、车牌、票据、订单、地图定位、政治符号、军事装备、血腥暴力或可读文字。',
    '如果参考图中存在人物、车牌、文字、二维码或隐私信息，请忽略这些细节，并转化为不可识别的远景、纹理、光影或环境氛围。'
  ].join('\n')
  const safeGuide = safeMode
    ? '\n安全风景模式：不使用任何人物主体，不复现原图中的文字或隐私元素，只生成甘肃文旅风景、建筑轮廓、自然光影和丝路纹样动画。'
    : ''

  if (!text) return `${styleGuide}\n${safetyGuide}${safeGuide}`
  if (text.includes('甘肃') || text.includes('丝路') || text.includes('敦煌')) {
    return `${text}\n${safetyGuide}${safeGuide}`
  }
  return `${text}\n${styleGuide}\n${safetyGuide}${safeGuide}`
}

function buildSafeRetryPrompt(prompt) {
  return [
    buildSeedancePrompt(prompt, true),
    '本次请按纯文本生成一段安全的甘肃文旅动画短片，不使用用户上传图作为首帧。',
    '画面主体为敦煌光影、丹霞色带、黄河水面、古驿道、风沙粒子和丝路纹样，不出现任何可识别人物或隐私信息。'
  ].join('\n')
}

function buildSeedanceBody(payload) {
  const safeMode = normalizeBoolean(payload.safeMode, false)
  const omitImage = safeMode && normalizeBoolean(payload.omitImageOnSafeMode, true)
  const imageUrl = omitImage ? '' : String(payload.imageUrl || payload.imageDataUrl || '').trim()
  const content = [
    {
      type: 'text',
      text: buildSeedancePrompt(payload.prompt, safeMode)
    }
  ]

  if (imageUrl) {
    content.push({
      type: 'image_url',
      image_url: {
        url: imageUrl
      },
      role: 'first_frame'
    })
  }

  return {
    model: payload.model || ARK_SEEDANCE_MODEL,
    content,
    ratio: payload.ratio || 'adaptive',
    duration: normalizeNumber(payload.duration, safeMode ? 5 : 5, 4, 10),
    resolution: payload.resolution || '720p',
    generate_audio: safeMode ? false : normalizeBoolean(payload.generateAudio, true),
    watermark: normalizeBoolean(payload.watermark, false),
    camera_fixed: safeMode ? true : normalizeBoolean(payload.cameraFixed, false),
    service_tier: payload.serviceTier || 'default'
  }
}

function requestArkJson(method, endpoint, data) {
  return new Promise((resolve, reject) => {
    if (!ARK_API_KEY) {
      reject(new Error('ARK_API_KEY_MISSING'))
      return
    }

    const url = new URL(endpoint)
    const body = method === 'GET' || data === undefined || data === null ? '' : JSON.stringify(data)
    const req = https.request({
      hostname: url.hostname,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${ARK_API_KEY}`,
        'Content-Length': Buffer.byteLength(body, 'utf8')
      }
    }, arkRes => {
      let responseBody = ''

      arkRes.on('data', chunk => {
        responseBody += chunk
      })
      arkRes.on('end', () => {
        let parsed = {}

        try {
          parsed = responseBody ? JSON.parse(responseBody) : {}
        } catch (error) {
          reject(new Error('ARK_BAD_JSON'))
          return
        }

        if (arkRes.statusCode < 200 || arkRes.statusCode >= 300) {
          const error = new Error('ARK_REQUEST_FAILED')
          error.statusCode = arkRes.statusCode
          error.data = parsed
          reject(error)
          return
        }

        resolve(parsed)
      })
    })

    req.on('error', reject)
    if (body) req.write(body)
    req.end()
  })
}

function requestJson(method, endpoint) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint)
    const req = https.request({
      hostname: url.hostname,
      path: url.pathname + url.search,
      method,
      headers: {
        Accept: 'application/json'
      }
    }, remoteRes => {
      let responseBody = ''

      remoteRes.on('data', chunk => {
        responseBody += chunk
      })
      remoteRes.on('end', () => {
        let parsed = {}

        try {
          parsed = responseBody ? JSON.parse(responseBody) : {}
        } catch (error) {
          reject(new Error('REMOTE_BAD_JSON'))
          return
        }

        if (remoteRes.statusCode < 200 || remoteRes.statusCode >= 300) {
          const error = new Error('REMOTE_REQUEST_FAILED')
          error.statusCode = remoteRes.statusCode
          error.data = parsed
          reject(error)
          return
        }

        resolve(parsed)
      })
    })

    req.on('error', reject)
    req.end()
  })
}

function requestWechatJson(method, endpoint, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint)
    const body = data === undefined || data === null ? '' : JSON.stringify(data)
    const req = https.request({
      hostname: url.hostname,
      path: url.pathname + url.search,
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(body, 'utf8')
      }
    }, remoteRes => {
      let responseBody = ''

      remoteRes.on('data', chunk => {
        responseBody += chunk
      })
      remoteRes.on('end', () => {
        let parsed = {}

        try {
          parsed = responseBody ? JSON.parse(responseBody) : {}
        } catch (error) {
          reject(new Error('REMOTE_BAD_JSON'))
          return
        }

        if (remoteRes.statusCode < 200 || remoteRes.statusCode >= 300) {
          const error = new Error('REMOTE_REQUEST_FAILED')
          error.statusCode = remoteRes.statusCode
          error.data = parsed
          reject(error)
          return
        }

        resolve(parsed)
      })
    })

    req.on('error', reject)
    if (body) req.write(body)
    req.end()
  })
}

async function getWechatAccessToken() {
  if (!WECHAT_APP_ID || !WECHAT_APP_SECRET) {
    throw new Error('WECHAT_CONFIG_MISSING')
  }

  if (wechatAccessTokenCache.token && Date.now() < wechatAccessTokenCache.expiresAt - WECHAT_ACCESS_TOKEN_REFRESH_MARGIN) {
    return wechatAccessTokenCache.token
  }

  const endpoint = new URL('https://api.weixin.qq.com/cgi-bin/token')
  endpoint.searchParams.set('grant_type', 'client_credential')
  endpoint.searchParams.set('appid', WECHAT_APP_ID)
  endpoint.searchParams.set('secret', WECHAT_APP_SECRET)

  const data = await requestWechatJson('GET', endpoint.toString())

  if (data.errcode) {
    const error = new Error('WECHAT_ACCESS_TOKEN_FAILED')
    error.data = data
    throw error
  }

  wechatAccessTokenCache = {
    token: data.access_token || '',
    expiresAt: Date.now() + Number(data.expires_in || 7200) * 1000
  }

  if (!wechatAccessTokenCache.token) {
    throw new Error('WECHAT_ACCESS_TOKEN_EMPTY')
  }

  return wechatAccessTokenCache.token
}

async function getWechatPhoneNumber(phoneCode) {
  const code = String(phoneCode || '').trim()
  if (!code) return ''

  const accessToken = await getWechatAccessToken()
  const endpoint = new URL('https://api.weixin.qq.com/wxa/business/getuserphonenumber')
  endpoint.searchParams.set('access_token', accessToken)

  const data = await requestWechatJson('POST', endpoint.toString(), { code })

  if (data.errcode) {
    const error = new Error('WECHAT_PHONE_FAILED')
    error.data = data
    throw error
  }

  return data.phone_info && (data.phone_info.phoneNumber || data.phone_info.purePhoneNumber) || ''
}

async function code2Session(code) {
  if (!WECHAT_APP_ID || !WECHAT_APP_SECRET) {
    throw new Error('WECHAT_CONFIG_MISSING')
  }

  const endpoint = new URL('https://api.weixin.qq.com/sns/jscode2session')
  endpoint.searchParams.set('appid', WECHAT_APP_ID)
  endpoint.searchParams.set('secret', WECHAT_APP_SECRET)
  endpoint.searchParams.set('js_code', code)
  endpoint.searchParams.set('grant_type', 'authorization_code')

  const data = await requestJson('GET', endpoint.toString())

  if (data.errcode) {
    const error = new Error('WECHAT_CODE2SESSION_FAILED')
    error.data = data
    throw error
  }

  if (!data.openid) {
    const error = new Error('WECHAT_OPENID_EMPTY')
    error.data = data
    throw error
  }

  return data
}

function createLoginToken(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = crypto
    .createHmac('sha256', LOGIN_TOKEN_SECRET)
    .update(body)
    .digest('base64url')

  return `${body}.${signature}`
}

function buildSystemPrompt(context) {
  const cityText = context && context.city
    ? `当前浏览城市：${context.city}。城市提示：${context.cityDesc || '甘肃丝路文旅场景'}。`
    : '当前浏览场景：甘肃丝路文旅小程序。'

  return [
    '你是“丝路小管家”，服务于“丝路问驿 Silk Road Chronicle”小程序。',
    '请围绕甘肃旅游、丝路文化、景点导览、路线规划、文博故事、美食文创和出行提醒回答。',
    '回答要清晰、温暖、可执行。涉及开放时间、票价、班次、天气等可能变化的信息时，提醒游客以官方最新发布为准。',
    '用户给出天数、出发地、同行人、兴趣偏好时，请严格按用户给出的天数拆分路线，不要擅自扩展天数；信息不足时先给参考方案，再提示补充条件。',
    '请用自然对话的形式输出，像导游朋友在聊天一样。不要使用 Markdown 格式，不要使用 ** 加粗，不要使用表格，不要使用 # 标题。',
    '可以分段，可以用“一、二、三”或“第1天、第2天”表达，但不要出现星号、井号、反引号等格式符号。',
    cityText
  ].join('\n')
}

function normalizeMessages(question, history, context) {
  const messages = [
    {
      role: 'system',
      content: buildSystemPrompt(context)
    }
  ]

  ;(history || []).slice(-8).forEach(item => {
    if (!item || !item.text) return
    if (item.role === 'user' && String(item.text).trim() === question) return
    messages.push({
      role: item.role === 'user' ? 'user' : 'assistant',
      content: String(item.text)
    })
  })

  const last = messages[messages.length - 1]
  if (!last || last.role !== 'user' || last.content !== question) {
    messages.push({
      role: 'user',
      content: [
        `游客问题：${question}`,
        '请直接回答这个问题，不要说用户没有提出具体需求。',
        '如果问题是路线规划，请严格按照用户问题中的天数给出按天安排、城市顺序、看点和注意事项。'
      ].join('\n')
    })
  }

  return messages
}

function callArk(payload) {
  return new Promise((resolve, reject) => {
    if (!ARK_API_KEY) {
      reject(new Error('ARK_API_KEY_MISSING'))
      return
    }

    const url = new URL(ARK_CHAT_URL)
    const body = JSON.stringify({
      model: payload.model || ARK_MODEL,
      messages: normalizeMessages(payload.question, payload.history, payload.context),
      max_tokens: Number(payload.max_tokens || 1200)
    })

    const req = https.request({
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${ARK_API_KEY}`,
        'Content-Length': Buffer.byteLength(body, 'utf8')
      }
    }, arkRes => {
      let responseBody = ''

      arkRes.on('data', chunk => {
        responseBody += chunk
      })
      arkRes.on('end', () => {
        let data = {}

        try {
          data = responseBody ? JSON.parse(responseBody) : {}
        } catch (error) {
          reject(new Error('ARK_BAD_JSON'))
          return
        }

        if (arkRes.statusCode < 200 || arkRes.statusCode >= 300) {
          const error = new Error('ARK_REQUEST_FAILED')
          error.statusCode = arkRes.statusCode
          error.data = data
          reject(error)
          return
        }

        resolve({
          answer: extractAnswer(data),
          raw: data
        })
      })
    })

    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

async function createSeedanceTask(payload) {
  const data = await requestArkJson('POST', ARK_VIDEO_TASK_URL, buildSeedanceBody(payload))
  const normalized = normalizeSeedanceTask(data)

  return {
    taskId: normalized.taskId,
    status: normalized.status || 'submitted',
    videoUrl: normalized.videoUrl,
    errorMessage: normalized.errorMessage,
    sensitive: normalized.sensitive,
    model: payload.model || ARK_SEEDANCE_MODEL,
    safetyFallback: !!payload.safeMode,
    raw: data
  }
}

async function createSeedanceTaskWithSafetyFallback(payload) {
  try {
    const result = await createSeedanceTask(payload)

    if (!payload.safeMode && result.sensitive && !result.videoUrl) {
      return createSeedanceTask({
        ...payload,
        imageUrl: '',
        imageDataUrl: '',
        prompt: buildSafeRetryPrompt(payload.prompt),
        safeMode: true,
        omitImageOnSafeMode: true,
        generateAudio: false,
        cameraFixed: true
      })
    }

    return result
  } catch (error) {
    if (!payload.safeMode && isSensitiveSeedanceProblem(error.data || error.message)) {
      return createSeedanceTask({
        ...payload,
        imageUrl: '',
        imageDataUrl: '',
        prompt: buildSafeRetryPrompt(payload.prompt),
        safeMode: true,
        omitImageOnSafeMode: true,
        generateAudio: false,
        cameraFixed: true
      })
    }

    throw error
  }
}

async function querySeedanceTask(taskId) {
  const endpoint = `${ARK_VIDEO_TASK_URL.replace(/\/$/, '')}/${encodeURIComponent(taskId)}`
  const data = await requestArkJson('GET', endpoint, null)
  const normalized = normalizeSeedanceTask(data)

  return {
    taskId: normalized.taskId || taskId,
    status: normalized.status || 'running',
    progress: normalized.progress,
    videoUrl: normalized.videoUrl,
    errorMessage: normalized.errorMessage,
    sensitive: normalized.sensitive,
    raw: data
  }
}

function normalizeSeedanceTask(data) {
  const source = data && data.data ? data.data : data || {}
  const content = source.content || source.output || source.result || {}
  const error = source.error || source.last_error || {}

  return {
    taskId: source.id || source.task_id || source.taskId || data.id || data.task_id || data.taskId || '',
    status: source.status || data.status || '',
    progress: source.progress || data.progress || null,
    videoUrl:
      content.video_url ||
      content.videoUrl ||
      content.url ||
      source.video_url ||
      source.videoUrl ||
      source.output_url ||
      source.outputUrl ||
      '',
    errorMessage: source.error_message || source.errorMessage || error.message || '',
    sensitive: isSensitiveSeedanceProblem(source) || isSensitiveSeedanceProblem(data)
  }
}

function extractAnswer(data) {
  if (data && data.choices && data.choices[0] && data.choices[0].message) {
    return cleanAnswer(data.choices[0].message.content || '')
  }

  return ''
}

function cleanAnswer(text) {
  return String(text || '')
    .replace(/\*\*/g, '')
    .replace(/#{1,6}\s?/g, '')
    .replace(/`{1,3}/g, '')
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

async function handleChat(req, res) {
  try {
    const body = await readBody(req)
    const question = String(body.question || '').trim()

    if (!question) {
      sendJson(res, 400, { error: 'QUESTION_REQUIRED' })
      return
    }

    const result = await callArk({
      question,
      history: body.history || [],
      context: body.context || {},
      model: body.model || ARK_MODEL,
      max_tokens: body.max_tokens
    })

    if (!result.answer) {
      sendJson(res, 502, { error: 'EMPTY_ANSWER', raw: result.raw })
      return
    }

    sendJson(res, 200, {
      answer: result.answer,
      model: body.model || ARK_MODEL
    })
  } catch (error) {
    console.error('[ai-butler-proxy]', error.message, error.statusCode || '', error.data || '')
    sendJson(res, error.statusCode || 500, {
      error: error.message,
      detail: error.data || null
    })
  }
}

async function handleWechatLogin(req, res) {
  try {
    const body = await readBody(req)
    const code = String(body.code || '').trim()
    const nickName = String(body.nickName || '').trim()
    const avatarUrl = String(body.avatarUrl || '').trim()
    let phone = String(body.phone || '').trim()
    const phoneCode = String(body.phoneCode || '').trim()
    const codeSource = String(body.codeSource || 'wxLogin').trim()

    if (!code) {
      sendJson(res, 400, { error: 'WECHAT_CODE_REQUIRED' })
      return
    }

    if (!nickName || !avatarUrl) {
      sendJson(res, 400, { error: 'PROFILE_REQUIRED' })
      return
    }

    const session = await code2Session(code)

    if (phoneCode) {
      try {
        phone = await getWechatPhoneNumber(phoneCode) || phone
      } catch (phoneError) {
        console.error('[wechat-phone]', phoneError.message, phoneError.data || '')
      }
    }

    const now = Date.now()
    const userId = `SR${crypto.createHash('sha1').update(session.openid).digest('hex').slice(0, 8).toUpperCase()}`
    const token = createLoginToken({
      openid: session.openid,
      unionid: session.unionid || '',
      userId,
      nickName,
      loginAt: now
    })

    sendJson(res, 200, {
      token,
      openid: session.openid,
      unionid: session.unionid || '',
      userId,
      nickName,
      avatarUrl,
      phone,
      codeSource,
      expiresIn: 7200
    })
  } catch (error) {
    console.error('[wechat-login]', error.message, error.statusCode || '', error.data || '')
    sendJson(res, error.statusCode || 500, {
      error: error.message,
      detail: error.data || null
    })
  }
}

async function handleSeedanceGenerate(req, res) {
  try {
    const body = await readBody(req)
    const result = await createSeedanceTaskWithSafetyFallback({
      imageUrl: body.imageUrl,
      imageDataUrl: body.imageDataUrl,
      prompt: body.prompt,
      duration: body.duration,
      ratio: body.ratio,
      resolution: body.resolution,
      generateAudio: body.generateAudio,
      watermark: body.watermark,
      cameraFixed: body.cameraFixed,
      serviceTier: body.serviceTier,
      model: body.model,
      safeMode: body.safeMode,
      omitImageOnSafeMode: body.omitImageOnSafeMode
    })

    if (!result.taskId) {
      sendJson(res, 502, { error: 'TASK_ID_EMPTY', raw: result.raw })
      return
    }

    sendJson(res, 200, result)
  } catch (error) {
    console.error('[seedance-generate]', error.message, error.statusCode || '', error.data || '')
    sendJson(res, error.statusCode || 500, {
      error: error.message,
      detail: error.data || null
    })
  }
}

async function handleSeedanceGenerateFile(req, res) {
  try {
    const multipart = await readMultipart(req)
    const image = multipart.files.image || multipart.files.file

    if (!image || !image.buffer || !image.buffer.length) {
      sendJson(res, 400, { error: 'IMAGE_REQUIRED' })
      return
    }

    const imageDataUrl = `data:${image.mimeType || 'image/jpeg'};base64,${image.buffer.toString('base64')}`
    const result = await createSeedanceTaskWithSafetyFallback({
      imageDataUrl,
      prompt: multipart.fields.prompt,
      duration: multipart.fields.duration,
      ratio: multipart.fields.ratio,
      resolution: multipart.fields.resolution,
      generateAudio: multipart.fields.generateAudio,
      watermark: multipart.fields.watermark,
      cameraFixed: multipart.fields.cameraFixed,
      serviceTier: multipart.fields.serviceTier,
      model: multipart.fields.model,
      safeMode: multipart.fields.safeMode,
      omitImageOnSafeMode: multipart.fields.omitImageOnSafeMode
    })

    if (!result.taskId) {
      sendJson(res, 502, { error: 'TASK_ID_EMPTY', raw: result.raw })
      return
    }

    sendJson(res, 200, result)
  } catch (error) {
    console.error('[seedance-upload]', error.message, error.statusCode || '', error.data || '')
    sendJson(res, error.statusCode || 500, {
      error: error.message,
      detail: error.data || null
    })
  }
}

async function handleSeedanceTask(req, res, url) {
  try {
    const taskId = String(url.searchParams.get('id') || '').trim()

    if (!taskId) {
      sendJson(res, 400, { error: 'TASK_ID_REQUIRED' })
      return
    }

    sendJson(res, 200, await querySeedanceTask(taskId))
  } catch (error) {
    console.error('[seedance-task]', error.message, error.statusCode || '', error.data || '')
    sendJson(res, error.statusCode || 500, {
      error: error.message,
      detail: error.data || null
    })
  }
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || '127.0.0.1'}`)

  if (req.method === 'OPTIONS') {
    sendJson(res, 204, {})
    return
  }

  if (req.method === 'GET' && url.pathname === '/health') {
    sendJson(res, 200, {
      ok: true,
      model: ARK_MODEL,
      seedanceModel: ARK_SEEDANCE_MODEL,
      hasKey: !!ARK_API_KEY,
      hasWechatLogin: !!(WECHAT_APP_ID && WECHAT_APP_SECRET)
    })
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/ai-butler/chat') {
    handleChat(req, res)
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/wechat/login') {
    handleWechatLogin(req, res)
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/seedance/generate') {
    handleSeedanceGenerate(req, res)
    return
  }

  if (req.method === 'POST' && url.pathname === '/api/seedance/generate-file') {
    handleSeedanceGenerateFile(req, res)
    return
  }

  if (req.method === 'GET' && url.pathname === '/api/seedance/task') {
    handleSeedanceTask(req, res, url)
    return
  }

  sendJson(res, 404, { error: 'NOT_FOUND' })
})

server.listen(PORT, () => {
  console.log(`AI butler proxy listening on http://127.0.0.1:${PORT}`)
  console.log(`Model: ${ARK_MODEL}`)
  console.log(`Seedance model: ${ARK_SEEDANCE_MODEL}`)
  console.log(`WeChat login configured: ${WECHAT_APP_ID && WECHAT_APP_SECRET ? 'yes' : 'no'}`)
  console.log(`Key configured: ${ARK_API_KEY ? 'yes' : 'no'}`)
})
