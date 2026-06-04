import { reactive, watch } from 'vue'

const STORAGE_KEY = 'yilan-itinerary'

function loadFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export const itineraryStore = reactive({
  items: loadFromStorage(),

  add(attraction) {
    if (!this.items.find(item => item.id === attraction.id)) {
      this.items.push(attraction)
    }
  },

  remove(id) {
    const index = this.items.findIndex(item => item.id === id)
    if (index !== -1) this.items.splice(index, 1)
  },

  has(id) {
    return this.items.some(item => item.id === id)
  },

  get count() {
    return this.items.length
  },

  get totalDuration() {
    return this.items.reduce((sum, item) => sum + item.duration, 0)
  },

  get hasDistanceWarning() {
    if (this.items.length < 2) return false
    const scores = this.items.map(item => item.distanceScore)
    return Math.max(...scores) - Math.min(...scores) >= 3
  },

  get warningDistricts() {
    if (!this.hasDistanceWarning) return []
    const scores = this.items.map(item => item.distanceScore)
    const maxScore = Math.max(...scores)
    const minScore = Math.min(...scores)
    const far = this.items.find(i => i.distanceScore === maxScore)
    const close = this.items.find(i => i.distanceScore === minScore)
    return [close.district, far.district]
  }
})

watch(
  () => JSON.stringify(itineraryStore.items),
  (newVal) => {
    localStorage.setItem(STORAGE_KEY, newVal)
  }
)
