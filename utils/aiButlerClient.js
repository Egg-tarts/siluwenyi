const cloudContainer = require('./cloudContainerClient')

const ARK_CHAT_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions'
const DEFAULT_MODEL = 'deepseek-v4-flash-260425'

function getConfig() {
  const app = getApp()
  const globalData = app && app.globalData ? app.globalData : {}
  const apiKey = globalData.aiButlerApiKey || wx.getStorageSync('aiButlerApiKey') || ''
  const endpoint = globalData.aiButlerEndpoint || ARK_CHAT_URL

  return {
    endpoint,
    apiKey,
    model: globalData.aiButlerModel || DEFAULT_MODEL,
    stream: globalData.aiButlerUseStream === true,
    maxTokens: globalData.aiButlerMaxTokens || 1000
  }
}

function buildSystemPrompt(context) {
  const cityText = context && context.city
    ? `当前浏览城市：${context.city}。城市提示：${context.cityDesc || '甘肃丝路文旅场景'}。`
    : '当前浏览场景：甘肃丝路文旅小程序。'

  return [
    '你是“丝路小管家”，服务于“丝路问驿 Silk Road Chronicle”小程序。',
    '你的回答要围绕甘肃旅游、丝路文化、景点导览、路线规划、文博故事、美食文创和出行提醒。',
    '回答要清晰、温暖、有实用步骤；涉及开放时间、票价、班次、天气等可能变化的信息时，要提醒游客以官方最新发布为准。',
    '如果用户给出天数、出发地、同行人、兴趣偏好，请按天拆分路线；如果信息不足，先给可执行的参考方案，再提示用户补充条件。',
    '请用自然对话的形式输出，像导游朋友在聊天一样。不要使用 Markdown 格式，不要使用 ** 加粗，不要使用表格，不要使用 # 标题。',
    '可以分段，可以用“一、二、三”或“第1天、第2天”表达，但不要出现星号、井号、反引号等格式符号。',
    cityText
  ].filter(Boolean).join('\n\n')
}

function buildMessages(question, history, context) {
  const normalizedHistory = (history || [])
    .filter(item => item && item.text)
    .slice(-8)
    .map(item => ({
      role: item.role === 'user' ? 'user' : 'assistant',
      content: String(item.text)
    }))

  const lastHistory = normalizedHistory[normalizedHistory.length - 1]
  const chatHistory = lastHistory && lastHistory.role === 'user' && lastHistory.content === question
    ? normalizedHistory.slice(0, -1)
    : normalizedHistory

  return [
    {
      role: 'system',
      content: buildSystemPrompt(context)
    },
    ...chatHistory,
    {
      role: 'user',
      content: question
    }
  ]
}

function buildPayload(question, history, context, config, stream) {
  return {
    model: config.model,
    stream,
    messages: buildMessages(question, history, context),
    max_tokens: config.maxTokens
  }
}

function buildProxyPayload(question, history, context, config) {
  return {
    question,
    history: (history || []).slice(-8),
    context: context || {},
    model: config.model,
    max_tokens: config.maxTokens
  }
}

function askAiButler(options) {
  const config = getConfig()

  const isArkDirect = config.endpoint.indexOf('ark.cn-beijing.volces.com') > -1

  if (!config.endpoint || (isArkDirect && !config.apiKey)) {
    return Promise.reject(makeError('AI_BUTLER_NOT_CONFIGURED'))
  }

  const payload = isArkDirect
    ? buildPayload(options.question, options.history, options.context, config, config.stream)
    : buildProxyPayload(options.question, options.history, options.context, config)
  const header = {
    'Content-Type': 'application/json'
  }

  if (config.apiKey) {
    header.Authorization = `Bearer ${config.apiKey}`
  }

  if (config.stream) {
    return requestStream({
      url: config.endpoint,
      header,
      data: payload,
      onDelta: options.onDelta
    })
  }

  return requestOnce({
    url: config.endpoint,
    header,
    data: payload
  })
}

function requestOnce(options) {
  return new Promise((resolve, reject) => {
    const data = Object.prototype.hasOwnProperty.call(options.data, 'stream')
      ? { ...options.data, stream: false }
      : options.data

    requestTransport({
      url: options.url,
      path: '/api/ai-butler/chat',
      method: 'POST',
      timeout: 30000,
      header: options.header,
      data,
      success: res => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(makeError('AI_BUTLER_REQUEST_FAILED', res))
          return
        }

        const text = cleanAnswer(extractFinalText(res.data))
        text ? resolve(text) : reject(makeError('AI_BUTLER_EMPTY_RESPONSE', res))
      },
      fail: err => {
        const error = makeError('AI_BUTLER_NETWORK_FAILED')
        error.responseData = err
        reject(error)
      }
    })
  })
}

function requestTransport(options) {
  if (cloudContainer.isEnabled() && options.url.indexOf('ark.cn-beijing.volces.com') === -1) {
    cloudContainer.requestJson({
      path: options.path,
      method: options.method,
      data: options.data,
      header: options.header,
      timeout: 18000
    }).then(options.success).catch(options.fail)
    return
  }

  if (options.url.indexOf('tcloudbase.com') > -1) {
    options.fail(new Error('CLOUD_CONTAINER_REQUIRED'))
    return
  }

  cloudContainer.requestByUrl(options).then(options.success).catch(options.fail)
}

function requestStream(options) {
  return new Promise((resolve, reject) => {
    let buffer = ''
    let answer = ''
    let settled = false
    const onceOptions = {
      ...options,
      data: {
        ...options.data,
        stream: false
      }
    }

    const task = wx.request({
      url: options.url,
      method: 'POST',
      timeout: 45000,
      enableChunked: true,
      header: options.header,
      data: options.data,
      success: res => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          if (!settled) reject(makeError('AI_BUTLER_REQUEST_FAILED', res))
          return
        }

        if (answer) {
          resolve(answer)
          return
        }

        const finalText = cleanAnswer(extractFinalText(res.data))
        finalText ? resolve(finalText) : reject(makeError('AI_BUTLER_EMPTY_RESPONSE', res))
      },
      fail: err => {
        if (!settled) reject(err)
      }
    })

    if (!task || !task.onChunkReceived) {
      settled = true
      requestOnce(onceOptions).then(resolve).catch(reject)
      return
    }

    task.onChunkReceived(res => {
      buffer += decodeArrayBuffer(res.data)
      const lines = buffer.split(/\r?\n/)
      buffer = lines.pop() || ''

      lines.forEach(line => {
        const delta = parseStreamLine(line)

        if (!delta) return

        answer += delta
        if (typeof options.onDelta === 'function') {
          options.onDelta(delta, answer)
        }
      })
    })
  })
}

function makeError(code, response) {
  const error = new Error(code)
  error.code = code

  if (response) {
    error.statusCode = response.statusCode
    error.responseData = response.data
  }

  return error
}

function parseStreamLine(line) {
  const text = line.trim()

  if (!text || !text.startsWith('data:')) return ''

  const payload = text.replace(/^data:\s*/, '')
  if (!payload || payload === '[DONE]') return ''

  try {
    return extractDeltaText(JSON.parse(payload))
  } catch (e) {
    return ''
  }
}

function extractDeltaText(data) {
  if (!data || typeof data !== 'object') return ''
  if (typeof data.delta === 'string') return data.delta
  if (typeof data.text === 'string' && String(data.type || '').indexOf('delta') > -1) return data.text

  if (data.choices && data.choices[0]) {
    const choice = data.choices[0]
    if (choice.delta && typeof choice.delta.content === 'string') return choice.delta.content
    if (choice.message && typeof choice.message.content === 'string') return choice.message.content
  }

  if (data.output && Array.isArray(data.output)) {
    return extractOutputText(data.output)
  }

  return ''
}

function extractFinalText(data) {
  if (!data) return ''
  if (typeof data === 'string') return data
  if (typeof data.output_text === 'string') return data.output_text
  if (data.output && Array.isArray(data.output)) return extractOutputText(data.output)

  if (data.choices && data.choices[0]) {
    const choice = data.choices[0]
    if (choice.delta && typeof choice.delta.content === 'string') return choice.delta.content
    if (choice.message && typeof choice.message.content === 'string') return choice.message.content
    if (typeof choice.text === 'string') return choice.text
  }

  if (data.data && typeof data.data.answer === 'string') return data.data.answer
  if (typeof data.answer === 'string') return data.answer

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

function extractOutputText(output) {
  return output.map(item => {
    if (!item) return ''
    if (typeof item.text === 'string') return item.text

    if (Array.isArray(item.content)) {
      return item.content.map(content => {
        if (!content) return ''
        if (typeof content.text === 'string') return content.text
        if (typeof content.output_text === 'string') return content.output_text
        return ''
      }).join('')
    }

    return ''
  }).join('')
}

function decodeArrayBuffer(buffer) {
  const bytes = new Uint8Array(buffer)

  if (typeof TextDecoder !== 'undefined') {
    return new TextDecoder('utf-8').decode(bytes)
  }

  let encoded = ''
  for (let index = 0; index < bytes.length; index += 1) {
    encoded += '%' + bytes[index].toString(16).padStart(2, '0')
  }

  try {
    return decodeURIComponent(encoded)
  } catch (e) {
    return ''
  }
}

module.exports = {
  askAiButler
}
