<template>
  <nav class="navbar glass">
    <RouterLink to="/" class="logo">
      <span class="logo-icon">🌿</span>
      <span class="logo-text">宜蘭放風去！</span>
    </RouterLink>
    <div class="nav-links">
      <RouterLink to="/" class="nav-link" active-class="active" exact>
        探索景點
      </RouterLink>
      <RouterLink to="/guide" class="nav-link" active-class="active">
        旅遊攻略
      </RouterLink>
      <RouterLink to="/quiz" class="nav-link quiz-btn" active-class="active">
        知識測驗
      </RouterLink>
      <RouterLink to="/itinerary" class="nav-link itinerary-btn" active-class="active">
        我的行程
        <span v-if="itineraryStore.count > 0" class="badge">
          {{ itineraryStore.count }}
        </span>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup>
import { itineraryStore } from '../store/itinerary'
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 64px;
  border-radius: 0;
  border-left: none;
  border-right: none;
  border-top: none;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
}

.logo-icon {
  font-size: 1.5rem;
}

.logo-text {
  background: linear-gradient(90deg, #4ecdc4, #a8edea);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-link {
  padding: 0.5rem 1.25rem;
  border-radius: 50px;
  font-size: 0.95rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;
  position: relative;
}

.nav-link:hover,
.nav-link.active {
  color: #fff;
  background: rgba(255, 255, 255, 0.15);
}

.quiz-btn {
  background: rgba(247, 208, 138, 0.15);
  border: 1px solid rgba(247, 208, 138, 0.3);
  color: rgba(255, 255, 255, 0.8);
}

.quiz-btn:hover,
.quiz-btn.active {
  background: rgba(247, 208, 138, 0.3);
  color: #fff;
}

.itinerary-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(78, 205, 196, 0.2);
  border: 1px solid rgba(78, 205, 196, 0.4);
}

.itinerary-btn:hover,
.itinerary-btn.active {
  background: rgba(78, 205, 196, 0.35);
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  background: #4ecdc4;
  color: #0a2a4a;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
}
</style>
