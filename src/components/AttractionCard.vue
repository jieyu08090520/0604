<template>
  <div class="card glass">
    <div class="card-header" :style="{ background: attraction.bgGradient }">
      <img
        v-if="attraction.image"
        :src="attraction.image"
        :alt="attraction.name"
        class="card-photo"
        @error="handleImgError"
      />
      <span class="card-emoji" :class="{ 'over-photo': attraction.image }">
        {{ attraction.emoji }}
      </span>
      <span class="card-district">{{ attraction.district }}</span>
    </div>

    <div class="card-body">
      <h3 class="card-name">{{ attraction.name }}</h3>
      <p class="card-desc">{{ attraction.description }}</p>

      <div class="card-meta">
        <span class="meta-item">
          <span class="meta-icon">⏱️</span>
          約 {{ formatDuration(attraction.duration) }}
        </span>
        <span class="meta-item">
          <span class="meta-icon">🎫</span>
          {{ attraction.ticket }}
        </span>
      </div>

      <div class="card-tags">
        <span
          v-for="tag in attraction.tags"
          :key="tag"
          class="tag"
        >
          {{ tagLabel(tag) }}
        </span>
      </div>

      <button
        class="add-btn"
        :class="{ added: isAdded }"
        @click="toggleItinerary"
      >
        <span v-if="isAdded">✓ 已加入行程</span>
        <span v-else>+ 加入我的行程</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { itineraryStore } from '../store/itinerary'

const props = defineProps({
  attraction: {
    type: Object,
    required: true
  }
})

const isAdded = computed(() => itineraryStore.has(props.attraction.id))

function handleImgError(e) {
  e.target.style.display = 'none'
}

function toggleItinerary() {
  if (isAdded.value) {
    itineraryStore.remove(props.attraction.id)
  } else {
    itineraryStore.add(props.attraction)
  }
}

function formatDuration(hours) {
  if (hours < 1) return `${hours * 60} 分鐘`
  if (hours === Math.floor(hours)) return `${hours} 小時`
  return `${Math.floor(hours)} 小時 ${(hours % 1) * 60} 分鐘`
}

const tagMap = {
  sea: '🌊 看海',
  mountain: '🌲 山林',
  indoor: '🏠 室內',
  outdoor: '🌿 戶外',
  couple: '💑 約會',
  group: '👥 多人',
  photo: '📸 拍照',
  food: '🍜 覓食',
  culture: '🎭 文化',
  relax: '😌 放鬆',
  solo: '🚶 獨旅'
}

function tagLabel(tag) {
  return tagMap[tag] || tag
}
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
}

.card-header {
  position: relative;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius) var(--radius) 0 0;
  overflow: hidden;
}

.card-photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius) var(--radius) 0 0;
}

.card-emoji {
  position: relative;
  font-size: 3.5rem;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4));
  z-index: 1;
}

.card-emoji.over-photo {
  font-size: 2rem;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-district {
  position: absolute;
  bottom: 10px;
  right: 12px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  color: #fff;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 50px;
}

.card-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.75rem;
}

.card-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: #fff;
}

.card-desc {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.6;
  flex: 1;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.65);
}

.meta-icon {
  font-size: 0.9rem;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.tag {
  font-size: 0.75rem;
  padding: 3px 10px;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.85);
}

.add-btn {
  width: 100%;
  padding: 0.65rem;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(78, 205, 196, 0.5);
  background: rgba(78, 205, 196, 0.15);
  color: #4ecdc4;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s ease;
  letter-spacing: 0.03em;
}

.add-btn:hover {
  background: rgba(78, 205, 196, 0.3);
  border-color: rgba(78, 205, 196, 0.8);
}

.add-btn.added {
  background: rgba(78, 205, 196, 0.25);
  border-color: #4ecdc4;
  color: #a8edea;
}
</style>
