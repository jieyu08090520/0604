import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ItineraryView from '../views/ItineraryView.vue'
import GuideView from '../views/GuideView.vue'
import QuizView from '../views/QuizView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/itinerary', name: 'itinerary', component: ItineraryView },
    { path: '/guide', name: 'guide', component: GuideView },
    { path: '/quiz', name: 'quiz', component: QuizView }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
