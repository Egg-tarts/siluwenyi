const app = getApp()
const cloudContainer = require('../../utils/cloudContainerClient')

const CLOUD_BASE = 'https://slwy-ai-final-274631-7-1325518283.sh.run.tcloudbase.com'

const DEFAULT_PROMPT = '以用户上传或选择的图片作为首帧参考，保持原图主体、构图方向、空间关系和主要色彩，只加入甘肃丝路风格的轻动画：敦煌壁画光影缓慢流动，黄河风掠过古驿道，丹霞色彩在镜头推进中自然展开。镜头运动要平稳、连续、克制，像从照片里慢慢苏醒，不要突然切换场景，不要凭空替换主体。不要出现可识别人脸、儿童、真实姓名、手机号、证件、二维码、车牌、票据、订单、地图定位、政治符号、军事装备、血腥暴力或可读文字。'
const SAFE_RETRY_PROMPT = '生成一段安全的甘肃丝路文旅动画短片。画面主体只包含敦煌纹样光影、张掖丹霞色带、黄河水面、古驿道、风沙粒子、远处不可识别的旅行剪影和温暖电影光。不要使用上传图片中的可识别人脸、文字、车牌、二维码、证件、票据、订单、定位或任何隐私信息。'

const promptPresets = [
  {
    id: 'silk-light',
    title: '丝路光影',
    desc: '敦煌纹样、金色光尘、古驿道和温暖电影感',
    prompt: DEFAULT_PROMPT
  },
  {
    id: 'danxia-cinematic',
    title: '丹霞电影',
    desc: '日落色带、云影滑过、镜头缓慢推进',
    prompt: '保持原图主体和构图稳定，只把色彩与光影自然过渡到甘肃张掖丹霞氛围：红、橙、金色地貌层次缓慢浮现，云影轻轻滑过，镜头低空平稳推进。不要突然换景，不要替换原图主体，不要出现可识别人脸、文字、证件、车牌、二维码或隐私信息。'
  },
  {
    id: 'yellow-river',
    title: '黄河古道',
    desc: '黄河水面、峡谷纹理、风沙粒子和古道氛围',
    prompt: '保持原图主体和空间层次，让画面逐渐出现甘肃黄河古道气质：金色水面反光、峡谷纹理、轻微风沙粒子和远处古道氛围。镜头只做缓慢推进或轻微横移，避免突兀变形。不要出现可识别人脸、文字、证件、车牌、二维码或隐私信息。'
  },
  {
    id: 'museum-heritage',
    title: '文博织锦',
    desc: '纹样、简牍、壁画色彩和典雅展陈感',
    prompt: '保持主体清晰和构图稳定，只在画面边缘、背景光影和纹理层加入甘肃文博织锦感：简牍纹理、壁画色彩、铜奔马线条和丝路纹样以抽象光影方式轻轻流动。镜头安静、典雅，不要突兀切换，不要出现可识别人脸、文字、证件、车牌、二维码或隐私信息。'
  }
]

const scenes = [
  {
    name: '莫高窟',
    type: '石窟壁画',
    image: 'https://free.picui.cn/free/2026/06/24/6a3b89a1142c9.jpg',
    focus: '壁画纹理与飞天光影',
    restore: '适合表现洞窟暗光、壁画色彩和飞天衣带的流动感。',
    guide: '建议选择建筑、壁画、纹理或风景图，画面越干净生成越稳定。',
    seedancePrompt: '以莫高窟壁画纹样和洞窟光影为灵感，镜头从暗处缓慢推进，金色光尘沿壁画色彩轻微流动，远处只有不可识别的旅行剪影穿过沙丘，整体庄重、细腻、电影感。'
  },
  {
    name: '麦积山',
    type: '石窟栈道',
    image: 'https://free.picui.cn/free/2026/06/24/6a3b89ad87768.jpg',
    focus: '崖壁栈道与山间薄雾',
    restore: '适合强调崖壁纵深、栈道转折和造像轮廓的温润感。',
    guide: '画面中山体、栈道、建筑外观越清晰，生成效果越自然。',
    seedancePrompt: '麦积山崖壁在晨光中展开，镜头沿栈道缓慢上升，山间薄雾流动，画面沉稳、安静、有研学纪录片质感。'
  },
  {
    name: '嘉峪关',
    type: '古关隘',
    image: 'https://free.picui.cn/free/2026/06/24/6a3b89aaefa7d.jpg',
    focus: '关城结构与边塞风沙',
    restore: '适合将关城、城墙、风沙和丝路商旅结合成宏大的镜头运动。',
    guide: '城楼、城墙、戈壁和天空比例明确时，生成稳定性更高。',
    seedancePrompt: '嘉峪关城楼在戈壁风中展开，镜头从城墙外缓慢推向关城，沙尘和云影轻轻运动，远方只有不可识别的旅行剪影经过烽燧，画面有边塞史诗感。'
  },
  {
    name: '张掖丹霞',
    type: '自然地貌',
    image: 'https://free.picui.cn/free/2026/06/24/6a3b89ab2f317.jpg',
    focus: '地貌色带与日落层次',
    restore: '适合做日落、色带和云影流动，镜头可以更开阔。',
    guide: '自然风景图最适合直接生成，建议优先使用横向景观图。',
    seedancePrompt: '张掖丹霞在日落下呈现红、橙、金色层次，镜头低空缓慢滑行，云影从彩丘上掠过，色带像丝绸一样展开，画面壮阔、明亮、具有航拍感。'
  },
  {
    name: '黄河石林',
    type: '峡谷地貌',
    image: 'https://free.picui.cn/free/2026/06/24/6a3b89aae53bf.jpg',
    focus: '峡谷纹理与黄河水面',
    restore: '适合突出峡谷、石柱、河道和西北风的运动感。',
    guide: '河流、峡谷、石林层次清楚时，生成效果更连贯。',
    seedancePrompt: '黄河石林的峡谷与石柱在金色光线中出现，镜头沿河道缓慢前进，水面反光闪动，风吹过岩壁纹理，画面有西北大地的厚重感。'
  }
]

Page({
  data: {
    scenes,
    promptPresets: promptPresets.map((item, index) => ({
      ...item,
      className: index === 0 ? 'preset-card preset-card--active' : 'preset-card'
    })),
    activePresetId: promptPresets[0].id,
    activePresetTitle: promptPresets[0].title,
    showCustomPrompt: false,
    activeIndex: 0,
    activeScene: scenes[0],
    cameraReady: false,
    cameraError: '',
    cameraPosition: 'back',
    flash: 'off',
    flashLabel: '补光',
    photoPath: '',
    selectedImagePath: '',
    selectedImageUrl: scenes[0].image,
    previewImage: scenes[0].image,
    selectedImageLabel: '当前示例图',
    customImageUrl: '',
    videoPrompt: DEFAULT_PROMPT,
    duration: 5,
    ratio: 'adaptive',
    resolution: '720p',
    generateAudio: true,
    cameraFixed: false,
    isGenerating: false,
    safeRetryCount: 0,
    taskId: '',
    taskStatus: '',
    taskStatusText: '选择图片后即可生成丝路动画',
    progressStage: 0,
    generatedVideoUrl: '',
    errorText: '',
    tips: [
      '优先上传纯风景、建筑或文物外观照片',
      '避免包含人脸、车牌、二维码、证件、票据和手机号',
      '如果触发审核，会自动切换安全风景模式重试'
    ],
    styleTags: ['敦煌光影', '驼铃远行', '黄河风', '丹霞色彩', '古驿道']
  },

  onLoad() {
    this.pollTimer = null
  },

  onUnload() {
    this.clearPollTimer()
  },

  goBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack()
      return
    }
    wx.reLaunch({ url: '/pages/community/community' })
  },

  onCameraInitDone() {
    this.setData({
      cameraReady: true,
      cameraError: ''
    })
  },

  onCameraError(error) {
    this.setData({
      cameraReady: false,
      cameraError: '相机暂时无法打开，请在设置中允许相机权限'
    })
    console.warn('image maker camera error:', error)
  },

  chooseScene(e) {
    const index = Number(e.currentTarget.dataset.index)
    const scene = scenes[index] || scenes[0]
    this.clearPollTimer()
    this.setData({
      activeIndex: index,
      activeScene: scene,
      selectedImagePath: '',
      selectedImageUrl: scene.image,
      previewImage: scene.image,
      selectedImageLabel: `${scene.name}示例图`,
      photoPath: '',
      videoPrompt: scene.seedancePrompt,
      activePresetId: 'scene-' + scene.name,
      activePresetTitle: scene.name + '场景',
      promptPresets: this.withPresetClass(promptPresets, ''),
      showCustomPrompt: false,
      generatedVideoUrl: '',
      taskId: '',
      taskStatus: '',
      taskStatusText: '已切换场景，可以继续生成视频',
      progressStage: 1,
      errorText: ''
    })
  },

  chooseImage() {
    if (wx.chooseMedia) {
      wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        sizeType: ['compressed'],
        success: res => {
          const file = res.tempFiles && res.tempFiles[0]
          if (file && file.tempFilePath) this.useLocalImage(file.tempFilePath, '已选择图片')
        },
        fail: () => wx.showToast({ title: '没有选择图片', icon: 'none' })
      })
      return
    }

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const path = res.tempFilePaths && res.tempFilePaths[0]
        if (path) this.useLocalImage(path, '已选择图片')
      }
    })
  },

  useLocalImage(path, label) {
    this.clearPollTimer()
    this.setData({
      photoPath: path,
      selectedImagePath: path,
      selectedImageUrl: '',
      previewImage: path,
      selectedImageLabel: label,
      generatedVideoUrl: '',
      taskId: '',
      taskStatus: '',
      taskStatusText: '图片已就绪，等待生成',
      progressStage: 1,
      errorText: ''
    })
  },

  useSceneImage() {
    const scene = this.data.activeScene
    this.clearPollTimer()
    this.setData({
      photoPath: '',
      selectedImagePath: '',
      selectedImageUrl: scene.image,
      previewImage: scene.image,
      selectedImageLabel: `${scene.name}示例图`,
      generatedVideoUrl: '',
      taskId: '',
      taskStatus: '',
      taskStatusText: '已使用当前示例图',
      progressStage: 1,
      errorText: ''
    })
  },

  onImageUrlInput(e) {
    this.setData({ customImageUrl: String(e.detail.value || '').trim() })
  },

  applyImageUrl() {
    const url = String(this.data.customImageUrl || '').trim()
    if (!/^https?:\/\//.test(url)) {
      wx.showToast({ title: '请输入图片链接', icon: 'none' })
      return
    }
    this.clearPollTimer()
    this.setData({
      photoPath: '',
      selectedImagePath: '',
      selectedImageUrl: url,
      previewImage: url,
      selectedImageLabel: '线上图片',
      generatedVideoUrl: '',
      taskId: '',
      taskStatus: '',
      taskStatusText: '图片链接已就绪',
      progressStage: 1,
      errorText: ''
    })
  },

  takePhoto() {
    if (!this.data.cameraReady) {
      wx.showToast({ title: '相机准备中', icon: 'none' })
      return
    }
    wx.createCameraContext().takePhoto({
      quality: 'high',
      success: res => this.useLocalImage(res.tempImagePath, '相机照片'),
      fail: () => wx.showToast({ title: '拍照未完成', icon: 'none' })
    })
  },

  toggleFlash() {
    const flash = this.data.flash === 'off' ? 'torch' : 'off'
    this.setData({
      flash,
      flashLabel: flash === 'torch' ? '关灯' : '补光'
    })
  },

  onPromptInput(e) {
    this.setData({ videoPrompt: e.detail.value })
  },

  choosePreset(e) {
    const id = e.currentTarget.dataset.id
    const preset = promptPresets.find(item => item.id === id)
    if (!preset) return
    this.setData({
      activePresetId: preset.id,
      activePresetTitle: preset.title,
      videoPrompt: preset.prompt,
      promptPresets: this.withPresetClass(promptPresets, preset.id),
      showCustomPrompt: false,
      taskStatusText: '已选择' + preset.title + '风格'
    })
  },

  toggleCustomPrompt() {
    this.setData({ showCustomPrompt: !this.data.showCustomPrompt })
  },

  withPresetClass(list, activeId) {
    return list.map(item => ({
      ...item,
      className: item.id === activeId ? 'preset-card preset-card--active' : 'preset-card'
    }))
  },

  useStyleTag(e) {
    const tag = e.currentTarget.dataset.tag
    const prompt = this.data.videoPrompt || DEFAULT_PROMPT
    if (prompt.indexOf(tag) > -1) return
    this.setData({ videoPrompt: `${prompt}，加入${tag}。` })
  },

  chooseDuration(e) {
    this.setData({ duration: Number(e.currentTarget.dataset.value) })
  },

  chooseRatio(e) {
    this.setData({ ratio: e.currentTarget.dataset.value })
  },

  chooseResolution(e) {
    this.setData({ resolution: e.currentTarget.dataset.value })
  },

  toggleAudio() {
    this.setData({ generateAudio: !this.data.generateAudio })
  },

  toggleCameraFixed() {
    this.setData({ cameraFixed: !this.data.cameraFixed })
  },

  startGeneration() {
    if (this.data.isGenerating) return
    const prompt = this.buildFinalPrompt()
    const localPath = this.data.selectedImagePath
    const imageUrl = this.data.selectedImageUrl || this.data.activeScene.image

    if (!prompt) {
      wx.showToast({ title: '请选择生成风格', icon: 'none' })
      return
    }

    this.clearPollTimer()
    this.setData({
      isGenerating: true,
      generatedVideoUrl: '',
      taskId: '',
      taskStatus: 'creating',
      taskStatusText: '正在提交到云端生成服务',
      progressStage: 2,
      errorText: '',
      safeRetryCount: 0
    })

    if (localPath) {
      this.createTaskWithFile(localPath, prompt)
      return
    }
    this.createTaskWithUrl(imageUrl, prompt)
  },

  buildFinalPrompt() {
    const prompt = this.sanitizePrompt(this.data.videoPrompt || DEFAULT_PROMPT)
    const scene = this.data.activeScene
    const motionText = this.data.cameraFixed
      ? '镜头固定或只有极轻微推进，主体不能漂移。'
      : '镜头可以缓慢推进、轻微横移或轻微上升，但必须连续自然。'

    return [
      '生成方式：image-to-video。必须把用户上传或选择的图片当作首帧和主要参考。',
      '关联性要求：保留原图主体、构图比例、前后景关系、主要色彩和光线方向；只让光影、云影、水面、风沙、纹样或远景氛围产生轻微运动。',
      '禁止突兀变化：不要突然切换到完全不同的景点，不要替换原图主体，不要让主体消失、融化、跳变或大幅变形。',
      prompt,
      `当前主题：${scene.name}，重点表现${scene.focus}。`,
      motionText,
      '视频需要自然运动、画面稳定、色彩高级，适合作为甘肃文旅短片。',
      '安全要求：不要出现可识别人脸、儿童、真实姓名、手机号、证件、二维码、车牌、票据、订单、地图定位、政治符号、军事装备、血腥暴力或可读文字。'
    ].join('\n')
  },

  sanitizePrompt(text) {
    return String(text || '')
      .replace(/\*\*/g, '')
      .replace(/#{1,6}\s?/g, '')
      .replace(/`{1,3}/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/1\d{10}/g, '')
      .replace(/\d{6,}/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim()
      .slice(0, 800)
  },

  createTaskWithUrl(imageUrl, prompt) {
    this.requestSeedance({
      url: this.getEndpoint('seedanceGenerateEndpoint', `${CLOUD_BASE}/api/seedance/generate`),
      path: '/api/seedance/generate',
      method: 'POST',
      timeout: 25000,
      header: { 'Content-Type': 'application/json' },
      data: this.buildGeneratePayload({ imageUrl, prompt }),
      success: res => this.handleCreateResponse(res),
      fail: error => this.handleCreateError(this.describeRequestFail(error, '视频生成请求没有完成'))
    })
  },

  createTaskWithFile(filePath, prompt) {
    const payload = this.buildGeneratePayload({ prompt })
    this.prepareSeedanceImage(filePath).then(imageDataUrl => {
      this.requestSeedance({
        url: this.getEndpoint('seedanceGenerateEndpoint', `${CLOUD_BASE}/api/seedance/generate`),
        path: '/api/seedance/generate',
        method: 'POST',
        timeout: 25000,
        header: { 'Content-Type': 'application/json' },
        data: { ...payload, imageDataUrl },
        success: res => this.handleCreateResponse(res),
        fail: error => this.handleCreateError(this.describeRequestFail(error, '图片上传没有完成，请稍后再试'))
      })
    }).catch(error => {
      this.handleCreateError(error && error.message === 'IMAGE_TOO_LARGE'
        ? '图片太大，请换一张更小的图片重试'
        : '图片读取失败，请换一张图再试')
    })
  },

  prepareSeedanceImage(filePath) {
    return new Promise((resolve, reject) => {
      const finish = finalPath => {
        cloudContainer.readFileAsDataUrl(finalPath).then(dataUrl => {
          if (!dataUrl || dataUrl.length > 3 * 1024 * 1024) {
            reject(new Error('IMAGE_TOO_LARGE'))
            return
          }
          resolve(dataUrl)
        }).catch(reject)
      }

      if (!wx.compressImage) {
        finish(filePath)
        return
      }

      wx.compressImage({
        src: filePath,
        quality: 60,
        success: res => finish(res && res.tempFilePath ? res.tempFilePath : filePath),
        fail: () => finish(filePath)
      })
    })
  },

  buildGeneratePayload(extra) {
    return Object.assign({
      prompt: extra.prompt,
      duration: this.data.duration,
      ratio: this.data.ratio,
      resolution: this.data.resolution,
      generateAudio: this.data.generateAudio,
      watermark: false,
      cameraFixed: this.data.cameraFixed,
      safeMode: false,
      omitImageOnSafeMode: false
    }, extra)
  },

  handleCreateResponse(res) {
    const data = res.data || {}
    if (res.statusCode < 200 || res.statusCode >= 300 || data.error) {
      this.handleCreateError(this.formatError(data.error || '任务创建失败', data.detail))
      return
    }

    if (!data.taskId) {
      this.handleCreateError('没有拿到生成任务，请检查 Seedance 模型是否已开通')
      return
    }

    this.setData({
      taskId: data.taskId,
      taskStatus: data.status || 'running',
      taskStatusText: data.safetyFallback ? '已切换安全风景模式，正在重新生成' : '视频已开始生成，正在等待成片',
      progressStage: 3
    })

    if (data.videoUrl) {
      this.finishGeneration(data.videoUrl, '视频已生成')
      return
    }

    this.pollTask(data.taskId, 0)
  },

  pollTask(taskId, count) {
    this.clearPollTimer()
    if (count > 80) {
      this.setData({
        isGenerating: false,
        taskStatusText: '生成时间较长，可稍后再次查看结果',
        progressStage: 3
      })
      return
    }

    const delay = count === 0 ? 1500 : 3500
    this.pollTimer = setTimeout(() => {
      this.requestSeedance({
        url: `${this.getEndpoint('seedanceTaskEndpoint', `${CLOUD_BASE}/api/seedance/task`)}?id=${encodeURIComponent(taskId)}`,
        path: `/api/seedance/task?id=${encodeURIComponent(taskId)}`,
        method: 'GET',
        timeout: 20000,
        success: res => {
          const data = res.data || {}
          if (res.statusCode < 200 || res.statusCode >= 300 || data.error) {
            this.handleCreateError(this.formatError(data.error || '查询生成进度失败', data.detail))
            return
          }

          const status = String(data.status || '').toLowerCase()
          if (data.videoUrl || ['succeeded', 'success', 'completed', 'done'].includes(status)) {
            this.finishGeneration(data.videoUrl, '视频已生成')
            return
          }

          if (['failed', 'cancelled', 'canceled', 'error'].includes(status)) {
            if (this.shouldSafeRetry(data.errorMessage || data.detail || data.raw)) {
              this.retryWithSafePrompt()
              return
            }
            this.handleCreateError(this.formatError(data.errorMessage || '视频生成失败，请换一张图片再试', data.detail || data.raw))
            return
          }

          this.setData({
            taskStatus: data.status || 'running',
            taskStatusText: this.describeProgress(count),
            progressStage: count > 3 ? 4 : 3
          })
          this.pollTask(taskId, count + 1)
        },
        fail: error => this.handleCreateError(this.describeRequestFail(error, '进度获取失败，请稍后再试'))
      })
    }, delay)
  },

  describeProgress(count) {
    const texts = [
      '正在锁定原图主体与构图',
      '正在加入丝路光影和轻微镜头运动',
      '正在保持画面连续性，避免突兀跳变',
      '正在合成最终视频，请耐心等待'
    ]
    return texts[Math.min(texts.length - 1, Math.floor(count / 2))]
  },

  finishGeneration(videoUrl, text) {
    this.clearPollTimer()
    this.setData({
      isGenerating: false,
      taskStatus: 'succeeded',
      taskStatusText: this.data.safeRetryCount > 0 ? '安全风景模式已生成视频' : text,
      progressStage: 5,
      generatedVideoUrl: videoUrl || '',
      errorText: ''
    })
    wx.showToast({ title: '生成完成', icon: 'success' })
  },

  handleCreateError(message) {
    if (this.shouldSafeRetry(message)) {
      this.retryWithSafePrompt()
      return
    }
    this.clearPollTimer()
    this.setData({
      isGenerating: false,
      taskStatus: 'failed',
      taskStatusText: '生成没有完成',
      progressStage: 1,
      errorText: this.formatError(message)
    })
    wx.showToast({ title: '生成未完成', icon: 'none' })
  },

  formatError(error, detail) {
    if (this.isSensitiveError(error) || this.isSensitiveError(detail)) {
      return '图片或生成内容可能包含人脸、文字、车牌、二维码、证件、票据等敏感信息。建议换成纯风景图，或使用安全风景模式生成。'
    }
    if (error === 'ARK_API_KEY_MISSING') return '请先配置生成密钥后再试'
    if (error === 'TASK_ID_EMPTY') return '模型已响应，但没有返回任务编号'
    if (error === 'REQUEST_TOO_LARGE') return '图片过大，请换一张较小的图片'
    if (detail && detail.error && detail.error.message) return detail.error.message
    if (detail && detail.message) return detail.message
    return String(error || '生成未完成')
  },

  shouldSafeRetry(error) {
    return this.data.safeRetryCount < 1 && this.isSensitiveError(error)
  },

  isSensitiveError(value) {
    if (!value) return false
    const text = typeof value === 'string' ? value : JSON.stringify(value)
    return /sensitive|safety|risk|unsafe|violation|forbidden|policy|privacy|personal information|contain sensitive information|审核|敏感|风险|违规|不合规|安全|隐私|个人信息|实名|证件|车牌|二维码/i.test(text)
  },

  retryWithSafePrompt() {
    const prompt = [
      SAFE_RETRY_PROMPT,
      `当前主题：${this.data.activeScene.name}，重点表现${this.data.activeScene.focus}。`,
      '纯文本生成，不使用上传图片作为首帧，只生成安全的甘肃文旅风景动画。'
    ].join('\n')

    this.clearPollTimer()
    this.setData({
      safeRetryCount: this.data.safeRetryCount + 1,
      taskStatus: 'creating-safe',
      taskStatusText: '图片触发审核，正在切换安全风景模式重试',
      progressStage: 2,
      errorText: ''
    })

    this.requestSeedance({
      url: this.getEndpoint('seedanceGenerateEndpoint', `${CLOUD_BASE}/api/seedance/generate`),
      path: '/api/seedance/generate',
      method: 'POST',
      timeout: 25000,
      header: { 'Content-Type': 'application/json' },
      data: this.buildGeneratePayload({
        imageUrl: '',
        selectedImageUrl: '',
        prompt,
        generateAudio: false,
        cameraFixed: true,
        safeMode: true,
        omitImageOnSafeMode: true
      }),
      success: res => this.handleCreateResponse(res),
      fail: error => this.handleCreateError(this.describeRequestFail(error, '安全风景模式暂时没有连接成功，请稍后再试'))
    })
  },

  requestSeedance(options) {
    if (cloudContainer.isEnabled()) {
      cloudContainer.requestJson({
        path: options.path,
        method: options.method,
        data: options.data,
        header: options.header,
        timeout: options.timeout || 60000
      }).then(options.success).catch(options.fail)
      return
    }

    if (options.url && options.url.indexOf('tcloudbase.com') > -1) {
      options.fail(new Error('CLOUD_CONTAINER_REQUIRED'))
      return
    }

    wx.request({
      url: options.url,
      method: options.method,
      timeout: options.timeout,
      header: options.header,
      data: options.data,
      success: options.success,
      fail: options.fail
    })
  },

  describeRequestFail(error, fallback) {
    if (error && error.message === 'CLOUD_CONTAINER_TIMEOUT') return '云端视频生成请求超时，请换一张更小的图片重试'
    if (error && error.message === 'CLOUD_CONTAINER_REQUIRED') return '云端生成服务未连接，请重新编译体验版后再试'
    return fallback
  },

  clearPollTimer() {
    if (this.pollTimer) {
      clearTimeout(this.pollTimer)
      this.pollTimer = null
    }
  },

  previewVideo() {
    if (!this.data.generatedVideoUrl) return
    if (wx.previewMedia) {
      wx.previewMedia({
        sources: [{ url: this.data.generatedVideoUrl, type: 'video' }]
      })
      return
    }
    wx.setClipboardData({ data: this.data.generatedVideoUrl })
  },

  copyVideoLink() {
    if (!this.data.generatedVideoUrl) return
    wx.setClipboardData({
      data: this.data.generatedVideoUrl,
      success: () => wx.showToast({ title: '链接已复制', icon: 'success' })
    })
  },

  saveVideo() {
    const videoUrl = this.data.generatedVideoUrl
    if (!videoUrl) return
    wx.showLoading({ title: '正在保存' })
    wx.downloadFile({
      url: videoUrl,
      timeout: 120000,
      success: res => {
        if (res.statusCode < 200 || res.statusCode >= 300 || !res.tempFilePath) {
          wx.hideLoading()
          wx.showToast({ title: '下载失败，请复制链接', icon: 'none' })
          return
        }
        wx.saveVideoToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => {
            wx.hideLoading()
            wx.showToast({ title: '已保存到相册', icon: 'success' })
          },
          fail: error => {
            wx.hideLoading()
            this.handleSaveVideoFail(error)
          }
        })
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({ title: '下载失败，请复制链接', icon: 'none' })
      }
    })
  },

  handleSaveVideoFail(error) {
    const message = error && error.errMsg ? error.errMsg : ''
    if (message.indexOf('auth deny') > -1 || message.indexOf('authorize') > -1) {
      wx.showModal({
        title: '需要相册权限',
        content: '请在设置中允许保存到相册，然后再点击保存视频。',
        confirmText: '去设置',
        success: res => {
          if (res.confirm) wx.openSetting({})
        }
      })
      return
    }
    wx.showToast({ title: '保存失败，请复制链接下载', icon: 'none' })
  },

  getEndpoint(key, fallback) {
    const globalData = app && app.globalData ? app.globalData : {}
    return globalData[key] || fallback
  }
})
