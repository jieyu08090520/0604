<template>
  <div class="filter-section">
    <!-- Step 1: Weather -->
    <div class="filter-group">
      <div class="filter-label">
        <span class="step-badge">1</span>
        今天天氣怎麼樣？
      </div>
      <div class="tag-row">
        <button
          v-for="option in weatherOptions"
          :key="option.value"
          class="filter-tag"
          :class="{ selected: selectedWeather === option.value }"
          @click="selectedWeather = option.value"
        >
          {{ option.emoji }} {{ option.label }}
        </button>
      </div>
    </div>

    <!-- Step 2: Mood -->
    <div class="filter-group">
      <div class="filter-label">
        <span class="step-badge">2</span>
        你想要什麼感覺？<span class="hint">（可複選）</span>
      </div>
      <div class="tag-row">
        <button
          v-for="option in moodOptions"
          :key="option.value"
          class="filter-tag"
          :class="{ selected: selectedMoods.includes(option.value) }"
          @click="toggleMood(option.value)"
        >
          {{ option.emoji }} {{ option.label }}
        </button>
      </div>
    </div>

    <!-- Result count -->
    <div class="result-bar">
      <span v-if="selectedMoods.length === 0 && selectedWeather === 'any'">
        共 <strong>{{ resultCount }}</strong> 個景點，點上方標籤開始篩選 👆
      </span>
      <span v-else>
        找到
        <strong>{{ resultCount }}</strong> 個符合條件的景點
        <button v-if="hasFilter" class="clear-btn" @click="clearAll">清除篩選</button>
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { weatherOptions, moodOptions } from '../data/attractions'

const selectedWeather = defineModel('weather', { default: 'any' })
const selectedMoods = defineModel('moods', { default: () => [] })

const props = defineProps({
  resultCount: { type: Number, default: 0 }
})

const hasFilter = computed(
  () => selectedWeather.value !== 'any' || selectedMoods.value.length > 0
)

function toggleMood(value) {
  const idx = selectedMoods.value.indexOf(value)
  if (idx === -1) {
    selectedMoods.value = [...selectedMoods.value, value]
  } else {
    selectedMoods.value = selectedMoods.value.filter(m => m !== value)
  }
}

function clearAll() {
  selectedWeather.value = 'any'
  selectedMoods.value = []
}
</script>

<style scoped>
.filter-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
}

.step-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--accent);
  color: #0a2a4a;
  font-size: 0.8rem;
  font-weight: 700;
  flex-shrink: 0;
}

.hint {
  font-size: 0.8rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.55);
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-tag {
  padding: 0.5rem 1rem;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.88rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.filter-tag:hover {
  border-color: rgba(78, 205, 196, 0.5);
  color: #fff;
  background: rgba(78, 205, 196, 0.1);
}

.filter-tag.selected {
  background: rgba(78, 205, 196, 0.25);
  border-color: var(--accent);
  color: #a8edea;
  font-weight: 600;
}

.result-bar {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.65);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-top: 0.25rem;
}

.result-bar strong {
  color: var(--accent);
  font-size: 1.1rem;
}

.clear-btn {
  padding: 0.25rem 0.85rem;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: transparent;
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.8rem;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.5);
}
</style>
