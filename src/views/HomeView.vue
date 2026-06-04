<template>
  <main class="home">
    <!-- Hero -->
    <section class="hero">
      <h1 class="hero-title">宜蘭放風去！</h1>
      <p class="hero-sub">
        禮拜六睡到自然醒，不想動腦也能立刻出發<br />
        選你的心情，讓網站幫你決定去哪
      </p>
    </section>

    <!-- Filter section -->
    <section class="filter-wrapper glass">
      <FilterTags
        v-model:weather="selectedWeather"
        v-model:moods="selectedMoods"
        :result-count="filteredAttractions.length"
      />
    </section>

    <!-- Results -->
    <section class="results-section">
      <TransitionGroup
        name="cards"
        tag="div"
        class="cards-grid"
      >
        <AttractionCard
          v-for="attraction in filteredAttractions"
          :key="attraction.id"
          :attraction="attraction"
        />
      </TransitionGroup>

      <div v-if="filteredAttractions.length === 0" class="empty-state">
        <div class="empty-icon">🔍</div>
        <p>沒有符合這些條件的景點</p>
        <p class="empty-sub">試著減少篩選條件，或切換天氣試試看</p>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { attractions } from '../data/attractions'
import FilterTags from '../components/FilterTags.vue'
import AttractionCard from '../components/AttractionCard.vue'

const selectedWeather = ref('any')
const selectedMoods = ref([])

const filteredAttractions = computed(() => {
  return attractions.filter(attraction => {
    const weatherMatch =
      selectedWeather.value === 'any' ||
      attraction.weather === 'any' ||
      attraction.weather === selectedWeather.value

    const moodMatch =
      selectedMoods.value.length === 0 ||
      selectedMoods.value.every(mood => attraction.tags.includes(mood))

    return weatherMatch && moodMatch
  })
})
</script>

<style scoped>
.home {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.hero {
  text-align: center;
  padding: 3rem 0 1.5rem;
}

.hero-title {
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  font-weight: 900;
  background: linear-gradient(90deg, #4ecdc4, #a8edea, #ffffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.hero-sub {
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.8;
}

.filter-wrapper {
  padding: 1.75rem;
}

.results-section {
  position: relative;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;
  position: relative;
}

.empty-state {
  text-align: center;
  padding: 5rem 0;
  color: rgba(255, 255, 255, 0.55);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.empty-icon {
  font-size: 3rem;
}

.empty-state p {
  font-size: 1rem;
}

.empty-sub {
  font-size: 0.875rem !important;
  opacity: 0.7;
}
</style>
