<template>
  <main class="itinerary-page">
    <div class="page-inner">
      <div class="page-header">
        <h1 class="page-title">我的行程清單</h1>
        <p class="page-sub">你精心挑選的宜蘭行程，就差車鑰匙還沒拿</p>
      </div>

      <!-- Warning Banner -->
      <Transition name="page">
        <div v-if="itineraryStore.hasDistanceWarning" class="warning-banner glass">
          <span class="warning-icon">⚠️</span>
          <div>
            <strong>距離提醒：</strong>
            {{ itineraryStore.warningDistricts[0] }} 與 {{ itineraryStore.warningDistricts[1] }}
            距離較遠，請留意車程時間，建議分兩天安排
          </div>
        </div>
      </Transition>

      <!-- Empty state -->
      <div v-if="itineraryStore.count === 0" class="empty-state glass">
        <div class="empty-icon">🗺️</div>
        <p class="empty-text">行程清單還是空的</p>
        <p class="empty-sub">回到首頁挑選你喜歡的宜蘭景點</p>
        <RouterLink to="/" class="go-back-btn">去探索景點 →</RouterLink>
      </div>

      <!-- Itinerary list -->
      <div v-else class="itinerary-content">
        <!-- Summary card -->
        <div class="summary-card glass">
          <div class="summary-item">
            <span class="summary-num">{{ itineraryStore.count }}</span>
            <span class="summary-label">個景點</span>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-item">
            <span class="summary-num">{{ formatDuration(itineraryStore.totalDuration) }}</span>
            <span class="summary-label">預估停留時間</span>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-item">
            <span class="summary-num">{{ districtList }}</span>
            <span class="summary-label">涵蓋鄉鎮</span>
          </div>
        </div>

        <!-- Items -->
        <TransitionGroup name="cards" tag="div" class="item-list">
          <div
            v-for="(item, index) in itineraryStore.items"
            :key="item.id"
            class="itinerary-item glass"
          >
            <div class="item-order">{{ index + 1 }}</div>
            <div class="item-icon" :style="{ background: item.bgGradient }">
              {{ item.emoji }}
            </div>
            <div class="item-info">
              <div class="item-name">{{ item.name }}</div>
              <div class="item-meta">
                <span>📍 {{ item.district }}</span>
                <span>⏱️ 約 {{ formatDuration(item.duration) }}</span>
                <span>🎫 {{ item.ticket }}</span>
              </div>
            </div>
            <button class="remove-btn" @click="itineraryStore.remove(item.id)" title="移除">
              ✕
            </button>
          </div>
        </TransitionGroup>

        <!-- Clear all -->
        <div class="actions">
          <button class="clear-all-btn" @click="confirmClear">清空行程</button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { itineraryStore } from '../store/itinerary'

function formatDuration(hours) {
  if (hours < 1) return `${hours * 60} 分鐘`
  if (hours === Math.floor(hours)) return `${hours} 小時`
  return `${Math.floor(hours)} 小時 ${(hours % 1) * 60} 分鐘`
}

const districtList = computed(() => {
  const districts = [...new Set(itineraryStore.items.map(i => i.district))]
  return districts.join('、')
})

function confirmClear() {
  if (confirm('確定要清空所有行程嗎？')) {
    itineraryStore.items.splice(0)
  }
}
</script>

<style scoped>
.itinerary-page {
  min-height: calc(100vh - 64px);
  padding: 2rem 1.5rem 4rem;
}

.page-inner {
  max-width: 780px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-header {
  padding: 2rem 0 0.5rem;
  text-align: center;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(90deg, #4ecdc4, #a8edea);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.page-sub {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.95rem;
}

.warning-banner {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-color: rgba(255, 193, 7, 0.4);
  background: rgba(255, 193, 7, 0.12);
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  line-height: 1.6;
}

.warning-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
  margin-top: 1px;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.empty-icon {
  font-size: 3.5rem;
  margin-bottom: 0.5rem;
}

.empty-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
}

.empty-sub {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
}

.go-back-btn {
  margin-top: 0.5rem;
  padding: 0.6rem 1.5rem;
  border-radius: 50px;
  background: rgba(78, 205, 196, 0.2);
  border: 1px solid rgba(78, 205, 196, 0.5);
  color: #4ecdc4;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.go-back-btn:hover {
  background: rgba(78, 205, 196, 0.35);
}

.itinerary-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.summary-card {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 1.25rem;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.summary-num {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--accent);
}

.summary-label {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.55);
}

.summary-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.15);
}

.item-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
}

.itinerary-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
}

.item-order {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(78, 205, 196, 0.2);
  border: 1px solid rgba(78, 205, 196, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: #4ecdc4;
}

.item-icon {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 0.35rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.55);
}

.remove-btn {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.75rem;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  background: rgba(255, 80, 80, 0.2);
  border-color: rgba(255, 80, 80, 0.5);
  color: #ff8080;
}

.actions {
  display: flex;
  justify-content: center;
  padding-top: 0.5rem;
}

.clear-all-btn {
  padding: 0.55rem 1.5rem;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.clear-all-btn:hover {
  color: rgba(255, 80, 80, 0.8);
  border-color: rgba(255, 80, 80, 0.4);
}
</style>
