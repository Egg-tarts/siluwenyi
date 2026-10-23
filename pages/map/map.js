const DEFAULT_CENTER = {
  latitude: 36.0611,
  longitude: 103.8343
}

const CITY_POINTS = [
  { name: '兰州', latitude: 36.0672, longitude: 103.7489 },
  { name: '张掖', latitude: 38.9473, longitude: 100.0641 },
  { name: '嘉峪关', latitude: 39.8026, longitude: 98.2160 },
  { name: '敦煌', latitude: 40.0372, longitude: 94.8092 },
  { name: '天水', latitude: 34.3539, longitude: 106.0038 },
  { name: '酒泉', latitude: 39.7328, longitude: 98.4939 },
  { name: '定西', latitude: 35.5806, longitude: 104.6263 },
  { name: '庆阳', latitude: 35.7098, longitude: 107.6429 },
  { name: '白银', latitude: 36.5448, longitude: 104.1377 },
  { name: '武威', latitude: 37.9282, longitude: 102.6380 },
  { name: '平凉', latitude: 35.5428, longitude: 106.6653 },
  { name: '陇南', latitude: 33.4007, longitude: 104.9217 },
  { name: '金昌', latitude: 38.5214, longitude: 102.1880 }
]

Page({
  data: {
    latitude: DEFAULT_CENTER.latitude,
    longitude: DEFAULT_CENTER.longitude,
    scale: 7,
    markers: [],
    polylines: [],
    routeStatus: '正在绘制路线'
  },

  onLoad() {
    this.renderRoute()
  },

  renderRoute() {
    const answer = this.getRouteAnswer()
    const coordinates = extractRoutePoints(answer)
    const hasRoute = coordinates.length > 0
    const center = hasRoute ? getCenterPoint(coordinates) : DEFAULT_CENTER

    this.setData({
      latitude: center.latitude,
      longitude: center.longitude,
      scale: coordinates.length > 1 ? 6 : 12,
      markers: buildMarkers(coordinates),
      polylines: coordinates.length > 1 ? [{
        points: coordinates,
        color: '#D64B2AFF',
        width: 7,
        dottedLine: false,
        arrowLine: true,
        borderColor: '#FFF2D6',
        borderWidth: 2
      }] : [],
      routeStatus: hasRoute ? `已绘制${coordinates.length}个路线点` : '暂无可绘制路线'
    }, () => {
      if (coordinates.length > 1) {
        this.fitRouteIntoView(coordinates)
        return
      }

      if (!hasRoute) {
        this.useCurrentLocation()
        wx.showToast({
          title: '请先生成带城市或景点的路线',
          icon: 'none'
        })
      }
    })
  },

  getRouteAnswer() {
    const app = getApp()
    return app.globalData.answer || wx.getStorageSync('currentRouteAnswer') || ''
  },

  fitRouteIntoView(points) {
    const mapContext = wx.createMapContext('map', this)
    setTimeout(() => {
      mapContext.includePoints({
        points,
        padding: [86, 42, 118, 42]
      })
    }, 180)
  },

  useCurrentLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          scale: 12
        })
      },
      fail: () => {
        wx.showToast({
          title: '可在设置中开启位置权限',
          icon: 'none'
        })
      }
    })
  },

  confirmRoute() {
    wx.showToast({
      title: '行程已确认',
      icon: 'success',
      duration: 1400
    })

    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/touring/touring'
      })
    }, 260)
  }
})

function buildMarkers(points) {
  return points.map((point, index) => ({
    id: index + 1,
    latitude: point.latitude,
    longitude: point.longitude,
    width: 28,
    height: 34,
    iconPath: '../images/1.png',
    callout: {
      content: point.name || `第${index + 1}站`,
      color: '#4B2A16',
      fontSize: 13,
      borderRadius: 8,
      bgColor: '#FFF7E8',
      padding: 8,
      display: 'BYCLICK'
    }
  }))
}

function extractRoutePoints(answer) {
  const text = String(answer || '')
  const points = []
  const seen = {}

  addCoordinatePoints(text, points, seen)
  addCityPoints(text, points, seen)

  return points
}

function addCoordinatePoints(text, points, seen) {
  const directionRegex = /(\d{1,3}\.\d+)\s?°\s?([NS]),\s*(\d{1,3}\.\d+)\s?°\s?([EW])/gi
  const reverseDirectionRegex = /(\d{1,3}\.\d+)\s?°\s?([EW]),\s*(\d{1,3}\.\d+)\s?°\s?([NS])/gi
  const plainRegex = /经纬度[：:]\s*(\d{1,3}\.\d+)\s*[,，]\s*(\d{1,3}\.\d+)/g
  let match

  while ((match = directionRegex.exec(text)) !== null) {
    addPoint(points, seen, {
      latitude: match[2].toUpperCase() === 'N' ? parseFloat(match[1]) : -parseFloat(match[1]),
      longitude: match[4].toUpperCase() === 'E' ? parseFloat(match[3]) : -parseFloat(match[3])
    })
  }

  while ((match = reverseDirectionRegex.exec(text)) !== null) {
    addPoint(points, seen, {
      latitude: match[4].toUpperCase() === 'N' ? parseFloat(match[3]) : -parseFloat(match[3]),
      longitude: match[2].toUpperCase() === 'E' ? parseFloat(match[1]) : -parseFloat(match[1])
    })
  }

  while ((match = plainRegex.exec(text)) !== null) {
    addPoint(points, seen, {
      latitude: parseFloat(match[1]),
      longitude: parseFloat(match[2])
    })
  }
}

function addCityPoints(text, points, seen) {
  const cityMatches = []

  CITY_POINTS.forEach(city => {
    const index = text.indexOf(city.name)
    if (index !== -1) {
      cityMatches.push({ ...city, index })
    }
  })

  cityMatches
    .sort((a, b) => a.index - b.index)
    .forEach(city => {
      addPoint(points, seen, city)
    })
}

function addPoint(points, seen, point) {
  if (point.latitude < -90 || point.latitude > 90) return
  if (point.longitude < -180 || point.longitude > 180) return

  const key = `${point.latitude.toFixed(5)},${point.longitude.toFixed(5)}`
  if (seen[key]) return

  seen[key] = true
  points.push(point)
}

function getCenterPoint(points) {
  if (!points.length) return DEFAULT_CENTER

  const total = points.reduce((sum, point) => ({
    latitude: sum.latitude + point.latitude,
    longitude: sum.longitude + point.longitude
  }), { latitude: 0, longitude: 0 })

  return {
    latitude: total.latitude / points.length,
    longitude: total.longitude / points.length
  }
}
