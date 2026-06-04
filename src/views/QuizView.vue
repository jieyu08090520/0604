<template>
  <main class="quiz-page">
    <section class="quiz-hero">
      <h1 class="quiz-title">宜蘭知識小測驗</h1>
      <p class="quiz-sub">你以為你懂宜蘭嗎？六題測出你的旅遊 IQ</p>
    </section>

    <!-- 未開始 -->
    <div v-if="phase === 'intro'" class="intro-box glass">
      <div class="intro-icon">🧭</div>
      <h2>準備好了嗎？</h2>
      <p>共 {{ questions.length }} 題選擇題，每題即時顯示答對/答錯。<br>測完看看你的宜蘭旅遊等級！</p>
      <div class="intro-stats">
        <div class="intro-stat">
          <div class="stat-num">{{ questions.length }}</div>
          <div class="stat-label">題</div>
        </div>
        <div class="intro-stat">
          <div class="stat-num">即時</div>
          <div class="stat-label">作答回饋</div>
        </div>
        <div class="intro-stat">
          <div class="stat-num">3分</div>
          <div class="stat-label">完成時間</div>
        </div>
      </div>
      <button class="start-btn" @click="startQuiz">開始測驗 →</button>
    </div>

    <!-- 作答中 -->
    <div v-else-if="phase === 'quiz'" class="quiz-body">

      <!-- Progress bar -->
      <div class="progress-wrap">
        <div class="progress-text">
          第 <strong>{{ currentIndex + 1 }}</strong> 題 / 共 {{ questions.length }} 題
        </div>
        <div class="progress-bar">
          <div
            class="progress-fill"
            :style="{ width: ((currentIndex + 1) / questions.length * 100) + '%' }"
          ></div>
        </div>
        <div class="score-badge">
          目前 {{ score }} / {{ currentIndex }} 分
        </div>
      </div>

      <!-- Question card -->
      <Transition name="slide-q" mode="out-in">
        <div :key="currentIndex" class="question-card glass">
          <div class="q-category">{{ currentQ.category }}</div>
          <h2 class="q-text">{{ currentQ.q }}</h2>

          <div class="options">
            <button
              v-for="(opt, i) in currentQ.options"
              :key="i"
              class="option-btn"
              :class="optionClass(i)"
              :disabled="answered"
              @click="answer(i)"
            >
              <span class="option-letter">{{ ['A', 'B', 'C', 'D'][i] }}</span>
              <span class="option-text">{{ opt }}</span>
              <span v-if="answered && i === currentQ.answer" class="option-mark correct-mark">✓</span>
              <span v-if="answered && i === selectedAnswer && i !== currentQ.answer" class="option-mark wrong-mark">✗</span>
            </button>
          </div>

          <!-- Feedback -->
          <Transition name="fade-in">
            <div v-if="answered" class="feedback" :class="isCorrect ? 'correct' : 'wrong'">
              <div class="feedback-head">
                <span class="feedback-icon">{{ isCorrect ? '🎉' : '💡' }}</span>
                <span class="feedback-label">{{ isCorrect ? '答對了！' : '答錯了！' }}</span>
              </div>
              <p class="feedback-explain">{{ currentQ.explain }}</p>
              <button class="next-btn" @click="nextQuestion">
                {{ currentIndex < questions.length - 1 ? '下一題 →' : '查看結果 →' }}
              </button>
            </div>
          </Transition>
        </div>
      </Transition>
    </div>

    <!-- 結果 -->
    <div v-else-if="phase === 'result'" class="result-box glass">
      <div class="result-icon">{{ resultData.icon }}</div>
      <h2 class="result-title">{{ resultData.title }}</h2>
      <div class="result-score">
        <span class="score-big">{{ score }}</span>
        <span class="score-divider">/</span>
        <span class="score-total">{{ questions.length }}</span>
      </div>
      <p class="result-desc">{{ resultData.desc }}</p>

      <div class="result-review">
        <h3>答題回顧</h3>
        <div
          v-for="(q, i) in questions"
          :key="i"
          class="review-item"
          :class="userAnswers[i] === q.answer ? 'review-correct' : 'review-wrong'"
        >
          <span class="review-icon">{{ userAnswers[i] === q.answer ? '✓' : '✗' }}</span>
          <div class="review-body">
            <div class="review-q">{{ q.q }}</div>
            <div class="review-a">正確答案：{{ q.options[q.answer] }}</div>
          </div>
        </div>
      </div>

      <div class="result-actions">
        <button class="restart-btn" @click="restart">再測一次</button>
        <RouterLink to="/guide" class="guide-link-btn">看旅遊攻略</RouterLink>
        <RouterLink to="/" class="explore-btn">開始探索景點 →</RouterLink>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'

const phase = ref('intro')
const currentIndex = ref(0)
const score = ref(0)
const selectedAnswer = ref(null)
const answered = ref(false)
const userAnswers = ref([])

const questions = [
  {
    category: '🗺️ 地理常識',
    q: '從雪山隧道北宜出口出來，最先抵達的是哪個鄉鎮？',
    options: ['礁溪鄉', '頭城鎮', '宜蘭市', '羅東鎮'],
    answer: 1,
    explain: '頭城是宜蘭縣最北邊的鄉鎮，緊鄰雪山隧道出口，也是開車進入宜蘭的第一站。往南才依序是礁溪、宜蘭市、羅東。',
  },
  {
    category: '🌦️ 天氣知識',
    q: '宜蘭全年雨量特別高的主要原因是什麼？',
    options: ['緯度較低，氣溫高易降雨', '東北季風受中央山脈阻擋，在宜蘭形成豐沛降水', '宜蘭地形低窪，河流多蒸發量大', '受太平洋高壓影響，西南氣流頻繁'],
    answer: 1,
    explain: '宜蘭位於蘭陽平原，三面環山、東面向海。每年秋冬東北季風盛行，含濕氣的氣流受中央山脈阻擋抬升，大量降雨集中在宜蘭，是全台年雨量最高的地區之一。',
  },
  {
    category: '🏄 景點知識',
    q: '以下哪個景點「下雨天也完全適合」？',
    options: ['烏石港衝浪', '五峰旗瀑布', '國立傳統藝術中心', '東澳粉鳥林'],
    answer: 2,
    explain: '傳藝中心是超大型室內外結合的傳統藝術園區，內有傳統街道、展館、小吃，雨天完全不受影響，是宜蘭最強的全天候景點。其他三個選項都需要好天氣。',
  },
  {
    category: '🍜 飲食文化',
    q: '礁溪地區種植的蔬菜特別甜，是因為？',
    options: ['土壤富含特殊礦物質', '使用礁溪溫泉水灌溉', '種植品種特別稀有', '海拔高，日夜溫差大'],
    answer: 1,
    explain: '礁溪溫泉水中含有豐富的礦物質，用來灌溉蔬菜後，蔬菜吸收礦物質，甜度和風味都比一般蔬菜更好。「溫泉蔬菜」是礁溪餐廳的招牌菜。',
  },
  {
    category: '🚗 交通常識',
    q: '週六出發去宜蘭，以下哪個時段雪山隧道「最容易塞車」？',
    options: ['早上 06:00–08:00', '早上 10:00–12:00', '下午 14:00–16:00', '晚上 20:00–22:00'],
    answer: 1,
    explain: '週六南下（往宜蘭）的塞車尖峰通常在早上 09:00–12:00，這段時間大量出遊民眾湧入。週日北上（返台北）則在下午 16:00–20:00 最壅塞。',
  },
  {
    category: '🐢 地標常識',
    q: '「龜山島」是宜蘭的著名地標，以下關於它的描述哪項正確？',
    options: ['從礁溪步行可達', '在烏石港搭船才能前往', '全年開放自由登島', '島上有溫泉設施可使用'],
    answer: 1,
    explain: '龜山島距宜蘭海岸約 10 公里，需從烏石港搭乘觀光船前往，無法步行。登島名額受限且需提前預訂，旺季（夏天）尤其搶手。',
  },
]

const currentQ = computed(() => questions[currentIndex.value])
const isCorrect = computed(() => selectedAnswer.value === currentQ.value.answer)

function optionClass(i) {
  if (!answered.value) return ''
  if (i === currentQ.value.answer) return 'opt-correct'
  if (i === selectedAnswer.value) return 'opt-wrong'
  return 'opt-dim'
}

function startQuiz() {
  phase.value = 'quiz'
}

function answer(i) {
  if (answered.value) return
  selectedAnswer.value = i
  answered.value = true
  userAnswers.value.push(i)
  if (i === currentQ.value.answer) score.value++
}

function nextQuestion() {
  if (currentIndex.value < questions.length - 1) {
    currentIndex.value++
    selectedAnswer.value = null
    answered.value = false
  } else {
    phase.value = 'result'
  }
}

function restart() {
  phase.value = 'intro'
  currentIndex.value = 0
  score.value = 0
  selectedAnswer.value = null
  answered.value = false
  userAnswers.value = []
}

const resultData = computed(() => {
  const s = score.value
  if (s === 6) return { icon: '🏆', title: '宜蘭達人', desc: '全對！你對宜蘭的了解程度讓當地人都要讚嘆。行程規劃交給你，包準不踩雷。' }
  if (s >= 4) return { icon: '😎', title: '資深旅人', desc: '答得不錯！你對宜蘭有一定的認識，再去個幾次就能成為達人了。' }
  if (s >= 2) return { icon: '🌱', title: '宜蘭初心者', desc: '還有進步空間！建議先把旅遊攻略讀一遍，你的宜蘭之旅會更順利。' }
  return { icon: '🗺️', title: '宜蘭大門剛打開', desc: '沒關係，每個宜蘭達人都是從零開始的。看完攻略頁，下次再來挑戰！' }
})
</script>

<style scoped>
.quiz-page {
  max-width: 680px;
  margin: 0 auto;
  padding: 2rem 1.5rem 5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.quiz-hero {
  text-align: center;
  padding: 2.5rem 0 0;
}

.quiz-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
  background: linear-gradient(90deg, #f7d08a, #fc5c7d, #ffffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.75rem;
}

.quiz-sub {
  color: rgba(255,255,255,0.65);
  font-size: 1.05rem;
}

/* ── Intro ── */
.intro-box {
  padding: 3rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.intro-icon { font-size: 3.5rem; }
.intro-box h2 { font-size: 1.5rem; font-weight: 800; }
.intro-box p { color: rgba(255,255,255,0.7); line-height: 1.7; }

.intro-stats {
  display: flex;
  gap: 2.5rem;
  margin: 0.5rem 0;
}

.intro-stat { text-align: center; }
.stat-num { font-size: 1.6rem; font-weight: 900; color: #f7d08a; }
.stat-label { font-size: 0.78rem; color: rgba(255,255,255,0.5); margin-top: 0.2rem; }

.start-btn {
  padding: 0.85rem 2.5rem;
  background: linear-gradient(90deg, #f7d08a, #fc5c7d);
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 700;
  color: #0a2a4a;
  cursor: pointer;
  transition: all 0.2s ease;
}

.start-btn:hover { transform: translateY(-2px); filter: brightness(1.1); }

/* ── Quiz body ── */
.quiz-body { display: flex; flex-direction: column; gap: 1.25rem; }

.progress-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.progress-text {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.6);
  white-space: nowrap;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: rgba(255,255,255,0.15);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #f7d08a, #fc5c7d);
  border-radius: 3px;
  transition: width 0.4s ease;
}

.score-badge {
  font-size: 0.82rem;
  color: rgba(255,255,255,0.55);
  white-space: nowrap;
}

/* ── Question card ── */
.question-card {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.q-category {
  font-size: 0.8rem;
  color: #f7d08a;
  font-weight: 700;
}

.q-text {
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1.6;
}

.options { display: flex; flex-direction: column; gap: 0.6rem; }

.option-btn {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.85rem 1.25rem;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 12px;
  color: rgba(255,255,255,0.85);
  font-size: 0.9rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option-btn:not(:disabled):hover {
  background: rgba(255,255,255,0.14);
  border-color: rgba(255,255,255,0.3);
  color: #fff;
}

.option-btn:disabled { cursor: default; }

.option-btn.opt-correct {
  background: rgba(78,205,196,0.2);
  border-color: rgba(78,205,196,0.6);
  color: #fff;
}

.option-btn.opt-wrong {
  background: rgba(252,92,125,0.15);
  border-color: rgba(252,92,125,0.5);
  color: rgba(255,255,255,0.7);
}

.option-btn.opt-dim {
  opacity: 0.45;
}

.option-letter {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
  font-weight: 700;
  flex-shrink: 0;
}

.opt-correct .option-letter { background: rgba(78,205,196,0.4); }
.opt-wrong .option-letter { background: rgba(252,92,125,0.3); }

.option-text { flex: 1; }
.option-mark { margin-left: auto; font-size: 1rem; flex-shrink: 0; }
.correct-mark { color: #4ecdc4; }
.wrong-mark { color: #fc5c7d; }

/* ── Feedback ── */
.feedback {
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.feedback.correct {
  background: rgba(78,205,196,0.12);
  border: 1px solid rgba(78,205,196,0.35);
}

.feedback.wrong {
  background: rgba(247,208,138,0.1);
  border: 1px solid rgba(247,208,138,0.3);
}

.feedback-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.feedback-icon { font-size: 1.25rem; }
.feedback-label { font-weight: 700; font-size: 0.95rem; }
.feedback.correct .feedback-label { color: #4ecdc4; }
.feedback.wrong .feedback-label { color: #f7d08a; }

.feedback-explain {
  font-size: 0.87rem;
  color: rgba(255,255,255,0.75);
  line-height: 1.7;
}

.next-btn {
  align-self: flex-end;
  padding: 0.55rem 1.5rem;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 50px;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.next-btn:hover { background: rgba(255,255,255,0.2); }

/* ── Result ── */
.result-box {
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  text-align: center;
}

.result-icon { font-size: 4rem; }
.result-title { font-size: 1.6rem; font-weight: 900; }

.result-score {
  display: flex;
  align-items: baseline;
  gap: 0.3rem;
}

.score-big { font-size: 4rem; font-weight: 900; color: #f7d08a; line-height: 1; }
.score-divider { font-size: 2rem; color: rgba(255,255,255,0.4); }
.score-total { font-size: 2rem; color: rgba(255,255,255,0.6); }

.result-desc {
  color: rgba(255,255,255,0.7);
  line-height: 1.7;
  max-width: 460px;
}

.result-review {
  width: 100%;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.result-review h3 { font-size: 1rem; font-weight: 700; margin-bottom: 0.25rem; }

.review-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  background: rgba(255,255,255,0.06);
}

.review-correct { border-left: 3px solid #4ecdc4; }
.review-wrong { border-left: 3px solid #fc5c7d; }

.review-icon { font-size: 1rem; flex-shrink: 0; margin-top: 0.1rem; }
.review-correct .review-icon { color: #4ecdc4; }
.review-wrong .review-icon { color: #fc5c7d; }

.review-q { font-size: 0.87rem; font-weight: 600; line-height: 1.4; }
.review-a { font-size: 0.8rem; color: rgba(255,255,255,0.5); margin-top: 0.2rem; }

.result-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.restart-btn {
  padding: 0.7rem 1.5rem;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 50px;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.restart-btn:hover { background: rgba(255,255,255,0.18); }

.guide-link-btn {
  display: inline-block;
  padding: 0.7rem 1.5rem;
  background: rgba(78,205,196,0.15);
  border: 1px solid rgba(78,205,196,0.4);
  border-radius: 50px;
  color: #4ecdc4;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.guide-link-btn:hover { background: rgba(78,205,196,0.25); }

.explore-btn {
  display: inline-block;
  padding: 0.7rem 1.5rem;
  background: linear-gradient(90deg, #f7d08a, #fc5c7d);
  border-radius: 50px;
  color: #0a2a4a;
  font-size: 0.9rem;
  font-weight: 700;
  transition: all 0.2s ease;
}

.explore-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }

/* ── Transitions ── */
.slide-q-enter-active, .slide-q-leave-active { transition: all 0.3s ease; }
.slide-q-enter-from { opacity: 0; transform: translateX(30px); }
.slide-q-leave-to { opacity: 0; transform: translateX(-30px); }

.fade-in-enter-active { transition: opacity 0.35s ease, transform 0.35s ease; }
.fade-in-enter-from { opacity: 0; transform: translateY(10px); }
</style>
