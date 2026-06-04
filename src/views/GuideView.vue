<template>
  <main class="guide">
    <section class="guide-hero">
      <h1 class="guide-title">宜蘭旅遊攻略</h1>
      <p class="guide-sub">出發前花三分鐘讀完這頁，讓你的宜蘭行少走冤枉路</p>
      <div class="tab-bar glass">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-btn"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
        </button>
      </div>
    </section>

    <Transition name="fade-tab" mode="out-in">

      <!-- ─── 地理速覽 ─── -->
      <section v-if="activeTab === 'geo'" key="geo" class="tab-content">
        <h2 class="section-title">宜蘭地理速覽</h2>
        <p class="section-desc">
          很多人以為宜蘭是「一個地方」，其實它涵蓋 12 個鄉鎮市。<br>
          從雪山隧道出來後往南開，景色完全不同——掌握這份地圖，行程不再隨機亂槍打鳥。
        </p>
        <div class="district-grid">
          <div
            v-for="district in districts"
            :key="district.name"
            class="district-card glass"
            :class="{ selected: selectedDistrict?.name === district.name }"
            @click="toggleDistrict(district)"
          >
            <div class="district-header">
              <span class="district-emoji">{{ district.emoji }}</span>
              <div>
                <div class="district-name">{{ district.name }}</div>
                <div class="district-km">距北宜出口約 {{ district.km }} 分鐘車程</div>
              </div>
            </div>
            <div class="district-tags">
              <span v-for="tag in district.highlights" :key="tag" class="d-tag">{{ tag }}</span>
            </div>
          </div>
        </div>
        <Transition name="slide-down">
          <div v-if="selectedDistrict" class="district-detail glass">
            <div class="detail-header">
              <span class="detail-emoji">{{ selectedDistrict.emoji }}</span>
              <div>
                <h3>{{ selectedDistrict.name }}</h3>
                <p class="detail-sub">{{ selectedDistrict.tagline }}</p>
              </div>
              <button class="close-btn" @click="selectedDistrict = null">✕</button>
            </div>
            <div class="detail-tips">
              <div v-for="tip in selectedDistrict.tips" :key="tip" class="tip-item">
                <span class="tip-dot">›</span><span>{{ tip }}</span>
              </div>
            </div>
            <div class="related-spots">
              <span class="related-label">本站收錄景點：</span>
              <span v-for="spot in relatedSpots" :key="spot.id" class="spot-chip">{{ spot.emoji }} {{ spot.name }}</span>
              <span v-if="relatedSpots.length === 0" class="no-spot">（暫無收錄）</span>
            </div>
          </div>
        </Transition>
        <div class="tip-box glass">
          <span class="tip-box-icon">💡</span>
          <p><strong>新手建議：</strong>第一次去宜蘭，以「礁溪 → 宜蘭市 → 羅東」為主軸最不容易跑空車。頭城在入口處順路，蘇澳/南澳留給下次再戰。</p>
        </div>
      </section>

      <!-- ─── 天氣解析 ─── -->
      <section v-else-if="activeTab === 'weather'" key="weather" class="tab-content">
        <h2 class="section-title">宜蘭天氣大解析</h2>
        <p class="section-desc">
          「宜蘭下雨」不是謠言，而是事實。東北季風讓宜蘭全年雨量高居全台前幾名。<br>
          但這不代表下雨就不能去——只是你要懂得看天行事。
        </p>
        <div class="weather-cards">
          <div
            v-for="card in weatherGuide"
            :key="card.season"
            class="weather-card glass"
            @click="expandedWeather = expandedWeather === card.season ? null : card.season"
          >
            <div class="weather-card-top">
              <div class="weather-left">
                <span class="weather-emoji">{{ card.emoji }}</span>
                <div>
                  <div class="weather-season">{{ card.season }}</div>
                  <div class="weather-period">{{ card.period }}</div>
                </div>
              </div>
              <div class="weather-score-group">
                <div class="weather-score" :style="{ color: card.color }">出遊評分 {{ card.score }}/5</div>
                <div class="score-bar">
                  <div class="score-fill" :style="{ width: (card.score / 5 * 100) + '%', background: card.color }"></div>
                </div>
              </div>
              <span class="expand-icon">{{ expandedWeather === card.season ? '▲' : '▼' }}</span>
            </div>
            <Transition name="slide-down">
              <div v-if="expandedWeather === card.season" class="weather-detail">
                <p class="weather-desc">{{ card.desc }}</p>
                <div class="weather-do-dont">
                  <div class="do-list">
                    <div class="list-title do">✓ 適合安排</div>
                    <div v-for="item in card.doList" :key="item" class="list-item">{{ item }}</div>
                  </div>
                  <div class="dont-list">
                    <div class="list-title dont">✗ 避免安排</div>
                    <div v-for="item in card.dontList" :key="item" class="list-item">{{ item }}</div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
        <div class="tip-box glass">
          <span class="tip-box-icon">☔</span>
          <p><strong>萬用口訣：</strong>「晴天往北走（頭城、礁溪海邊），雨天往南去（羅東夜市、傳藝中心）」。室內景點基本上全天候都適合，別讓天氣打亂你的計畫。</p>
        </div>
      </section>

      <!-- ─── 行程規劃 ─── -->
      <section v-else-if="activeTab === 'plan'" key="plan" class="tab-content">
        <h2 class="section-title">三步驟行程規劃術</h2>
        <p class="section-desc">不想動腦的你，只需要跟著這三步，就能規劃出不踩雷的宜蘭行程。</p>
        <div class="steps">
          <div
            v-for="(step, index) in planSteps"
            :key="step.title"
            class="step glass"
            @click="activeStep = activeStep === index ? -1 : index"
          >
            <div class="step-header">
              <div class="step-number" :style="{ background: step.color }">{{ index + 1 }}</div>
              <div class="step-info">
                <div class="step-title">{{ step.title }}</div>
                <div class="step-hint">{{ step.hint }}</div>
              </div>
              <span class="expand-icon">{{ activeStep === index ? '▲' : '▼' }}</span>
            </div>
            <Transition name="slide-down">
              <div v-if="activeStep === index" class="step-detail">
                <p class="step-desc">{{ step.desc }}</p>
                <div class="step-example glass-inner">
                  <div class="example-label">實際範例</div>
                  <p>{{ step.example }}</p>
                </div>
                <div v-if="step.warning" class="step-warning">
                  <span>⚠️</span><span>{{ step.warning }}</span>
                </div>
              </div>
            </Transition>
          </div>
        </div>
        <div class="sample-itinerary glass">
          <h3 class="sample-title">📍 懶人範本行程</h3>
          <p class="sample-sub">從淡水出發，禮拜六一日遊（晴天版）</p>
          <div class="timeline">
            <div v-for="item in sampleItinerary" :key="item.time" class="timeline-item">
              <div class="timeline-time">{{ item.time }}</div>
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <div class="timeline-title">{{ item.emoji }} {{ item.title }}</div>
                <div class="timeline-note">{{ item.note }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="tip-box glass">
          <span class="tip-box-icon">🗺️</span>
          <p><strong>距離防呆：</strong>本站的行程清單會在你加入相距過遠的景點時自動提醒你。頭城到蘇澳開車約 40 分鐘，全排進去需要留夠時間。</p>
        </div>
      </section>

      <!-- ─── 如何使用 ─── -->
      <section v-else-if="activeTab === 'howto'" key="howto" class="tab-content">
        <h2 class="section-title">如何使用這個網站</h2>
        <p class="section-desc">
          這個網站設計的核心概念是「零輸入、純點擊」。<br>
          你只需要回答兩個問題：天氣如何？你想要什麼？
        </p>
        <div class="howto-steps">
          <div v-for="(step, i) in howtoSteps" :key="i" class="howto-step glass">
            <div class="howto-number">{{ i + 1 }}</div>
            <div class="howto-body">
              <div class="howto-title">{{ step.title }}</div>
              <p class="howto-desc">{{ step.desc }}</p>
              <div class="howto-tags" v-if="step.options">
                <span v-for="opt in step.options" :key="opt" class="howto-tag">{{ opt }}</span>
              </div>
            </div>
          </div>
        </div>
        <h3 class="features-title">網站亮點功能</h3>
        <div class="features-grid">
          <div v-for="feat in features" :key="feat.title" class="feature-card glass">
            <span class="feat-icon">{{ feat.icon }}</span>
            <div class="feat-title">{{ feat.title }}</div>
            <p class="feat-desc">{{ feat.desc }}</p>
          </div>
        </div>
        <div class="cta-box glass">
          <p>準備好了嗎？</p>
          <RouterLink to="/" class="cta-btn">開始探索景點 →</RouterLink>
        </div>
      </section>

      <!-- ─── 交通指南 ─── -->
      <section v-else-if="activeTab === 'transport'" key="transport" class="tab-content">
        <h2 class="section-title">宜蘭交通指南</h2>
        <p class="section-desc">
          從淡水到宜蘭頭城，距離只有 70 公里，但若遇上假日雪山隧道，可能變成 3 小時地獄。<br>
          挑對交通方式，把時間留給景點，不要留給塞車。
        </p>

        <div class="transport-methods">
          <div
            v-for="method in transportMethods"
            :key="method.id"
            class="method-card glass"
            :class="{ active: selectedMethod === method.id }"
            @click="selectedMethod = method.id"
          >
            <div class="method-top">
              <span class="method-icon">{{ method.icon }}</span>
              <div class="method-info">
                <div class="method-name">{{ method.name }}</div>
                <div class="method-time">{{ method.time }}</div>
              </div>
              <div class="method-tags">
                <span
                  v-for="tag in method.tags"
                  :key="tag.label"
                  class="method-tag"
                  :class="tag.type"
                >{{ tag.label }}</span>
              </div>
            </div>
            <Transition name="slide-down">
              <div v-if="selectedMethod === method.id" class="method-detail">
                <p class="method-desc">{{ method.desc }}</p>
                <div class="method-steps">
                  <div v-for="step in method.steps" :key="step" class="method-step">
                    <span class="step-arrow">→</span>
                    <span>{{ step }}</span>
                  </div>
                </div>
                <div class="method-pros-cons">
                  <div>
                    <div class="pros-title">優點</div>
                    <div v-for="pro in method.pros" :key="pro" class="pro-item">✓ {{ pro }}</div>
                  </div>
                  <div>
                    <div class="cons-title">缺點</div>
                    <div v-for="con in method.cons" :key="con" class="con-item">✗ {{ con }}</div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <h3 class="sub-title">⏰ 雪山隧道塞車時段參考</h3>
        <div class="traffic-table glass">
          <div class="traffic-header">
            <div>時段</div><div>週六往宜蘭</div><div>週日返台北</div>
          </div>
          <div v-for="row in trafficData" :key="row.time" class="traffic-row">
            <div class="traffic-time">{{ row.time }}</div>
            <div class="traffic-cell" :class="row.sat">
              <span class="traffic-dot" :class="row.sat"></span>{{ trafficLabel[row.sat] }}
            </div>
            <div class="traffic-cell" :class="row.sun">
              <span class="traffic-dot" :class="row.sun"></span>{{ trafficLabel[row.sun] }}
            </div>
          </div>
        </div>

        <h3 class="sub-title">🅿️ 主要景點停車資訊</h3>
        <div class="parking-grid">
          <div v-for="p in parkingSpots" :key="p.area" class="parking-card glass">
            <div class="parking-area">{{ p.area }}</div>
            <div class="parking-info">{{ p.info }}</div>
            <div class="parking-tip">💡 {{ p.tip }}</div>
          </div>
        </div>

        <div class="tip-box glass">
          <span class="tip-box-icon">🚗</span>
          <p><strong>最省時策略：</strong>週六早上 07:00 前出發（雪隧幾乎不塞），傍晚 16:00 前返程。避開 09:00–12:00 南下、14:00–20:00 北上這兩個地獄時段。</p>
        </div>
      </section>

      <!-- ─── 必吃美食 ─── -->
      <section v-else-if="activeTab === 'food'" key="food" class="tab-content">
        <h2 class="section-title">宜蘭必吃美食地圖</h2>
        <p class="section-desc">
          宜蘭的食物就像宜蘭的景點——看起來普通，吃下去才知道有多驚豔。<br>
          選個地區，找出你行程附近的必吃清單。
        </p>

        <div class="food-filter">
          <button
            v-for="district in foodDistricts"
            :key="district"
            class="food-filter-btn"
            :class="{ active: selectedFoodDistrict === district }"
            @click="selectedFoodDistrict = district"
          >{{ district }}</button>
        </div>

        <p class="food-count">
          顯示 <strong>{{ filteredFoods.length }}</strong> 道推薦美食
        </p>

        <TransitionGroup name="cards" tag="div" class="food-grid">
          <div v-for="food in filteredFoods" :key="food.name" class="food-card glass">
            <div class="food-top">
              <span class="food-emoji">{{ food.emoji }}</span>
              <div>
                <div class="food-name">{{ food.name }}</div>
                <div class="food-district-label">{{ food.district }}</div>
              </div>
              <div class="food-price">{{ food.price }}</div>
            </div>
            <p class="food-desc">{{ food.desc }}</p>
            <div class="food-where">📍 {{ food.where }}</div>
          </div>
        </TransitionGroup>

        <div class="tip-box glass">
          <span class="tip-box-icon">🍜</span>
          <p><strong>購買伴手禮：</strong>宜蘭餅（牛舌餅）是最安全的送禮選擇，各大超市都有賣，但到「宜蘭餅發明館」現場做的最好吃、最有紀念意義。</p>
        </div>
      </section>

      <!-- ─── 踩雷FAQ ─── -->
      <section v-else-if="activeTab === 'faq'" key="faq" class="tab-content">
        <h2 class="section-title">初訪宜蘭常見踩雷</h2>
        <p class="section-desc">
          這些是第一次去宜蘭的人最常犯的錯誤，每一條都是血淚教訓。<br>
          看完這頁，你的宜蘭行失敗機率直接降低 80%。
        </p>

        <div class="faq-list">
          <div
            v-for="item in faqItems"
            :key="item.id"
            class="faq-item glass"
            :class="{ open: openFaqId === item.id }"
            @click="openFaqId = openFaqId === item.id ? null : item.id"
          >
            <div class="faq-q">
              <span class="faq-tag" :class="item.type">{{ item.typeLabel }}</span>
              <span class="faq-question">{{ item.q }}</span>
              <span class="faq-chevron">{{ openFaqId === item.id ? '▲' : '▼' }}</span>
            </div>
            <Transition name="slide-down">
              <div v-if="openFaqId === item.id" class="faq-a">
                <p>{{ item.a }}</p>
                <div v-if="item.tip" class="faq-tip">
                  <span>✅ 正確做法：</span>{{ item.tip }}
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <div class="tip-box glass">
          <span class="tip-box-icon">🧠</span>
          <p><strong>總結一句話：</strong>宜蘭的精華在「礁溪到羅東這條走廊」，新手把這段搞熟，其他地方留給第二次。第一次想跑太遠，通常會後悔。</p>
        </div>
      </section>

    </Transition>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { attractions } from '../data/attractions'

const activeTab = ref('geo')
const selectedDistrict = ref(null)
const expandedWeather = ref(null)
const activeStep = ref(0)
const selectedMethod = ref('car')
const selectedFoodDistrict = ref('全部')
const openFaqId = ref(null)

const tabs = [
  { id: 'geo',       icon: '🗺️', label: '地理速覽' },
  { id: 'weather',   icon: '🌤️', label: '天氣解析' },
  { id: 'plan',      icon: '📋', label: '行程規劃' },
  { id: 'transport', icon: '🚗', label: '交通指南' },
  { id: 'food',      icon: '🍜', label: '必吃美食' },
  { id: 'faq',       icon: '❓', label: '踩雷FAQ' },
  { id: 'howto',     icon: '🔍', label: '如何使用' },
]

// ── 地理速覽資料 ──
const districts = [
  { name: '頭城', emoji: '🏄', km: 10, tagline: '宜蘭的大門，進隧道就到',
    highlights: ['衝浪', '海灘', '老街', '烏石港'],
    tips: ['北關海潮退潮時去最壯觀', '龜山島搭船需提前預訂', '頭城老街停車不易，建議平日去'] },
  { name: '礁溪', emoji: '♨️', km: 15, tagline: '泡湯聖地，宜蘭人的後花園',
    highlights: ['溫泉', '瀑布', '夜市'],
    tips: ['礁溪溫泉公園戶外泡腳池免費', '五峰旗瀑布從礁溪市區開車 10 分鐘', '礁溪夜市週末人超多，建議平日'] },
  { name: '宜蘭市', emoji: '🎨', km: 25, tagline: '文化藝術集散地',
    highlights: ['幾米廣場', '文化', '美食'],
    tips: ['幾米廣場白天晚上都適合去', '宜蘭餅發明館可以自己動手做', '停車場在附近，開車較方便'] },
  { name: '羅東', emoji: '🍢', km: 30, tagline: '夜市與文化的完美組合',
    highlights: ['夜市', '林業園區', '文青'],
    tips: ['羅東夜市建議 18:00 後去，攤販全開', '林業文化園區週末有市集', '兩者步行可達，很適合排在一起'] },
  { name: '冬山', emoji: '🛶', km: 35, tagline: '親水活動天堂',
    highlights: ['親水公園', '梅花湖', '獨木舟'],
    tips: ['冬山河親水公園夏天去最值回票價', '梅花湖可以租腳踏車環湖', '兩個景點相距約 10 分鐘車程，可以排在一起'] },
  { name: '五結', emoji: '🏮', km: 35, tagline: '傳統文化重鎮',
    highlights: ['傳藝中心', '文化體驗'],
    tips: ['國立傳統藝術中心是雨天首選', '內部有傳統小吃，可以當一頓飯', '假日人多，建議平日前往'] },
  { name: '蘇澳', emoji: '🐟', km: 45, tagline: '漁港鮮味、秘境溫泉',
    highlights: ['漁港', '海鮮', '冷泉'],
    tips: ['南方澳早上 06:00 有魚貨拍賣', '蘇澳冷泉全台僅有，別錯過', '武荖坑適合下午去烤肉戲水'] },
  { name: '南澳', emoji: '🕊️', km: 60, tagline: '世外桃源，值得專程跑一趟',
    highlights: ['粉鳥林', '秘境海灘', '原住民文化'],
    tips: ['東澳粉鳥林只能開車到達，需要有車', '海水是夢幻翡翠綠，天晴才值得去', '建議留半天時間，加上往返車程'] },
]

function toggleDistrict(district) {
  selectedDistrict.value = selectedDistrict.value?.name === district.name ? null : district
}

const relatedSpots = computed(() => {
  if (!selectedDistrict.value) return []
  return attractions.filter(a => a.district === selectedDistrict.value.name)
})

// ── 天氣資料 ──
const weatherGuide = [
  { season: '春季（梅雨期）', period: '3月～5月', emoji: '🌦️', score: 3, color: '#a8d8ea',
    desc: '春天宜蘭氣溫舒適，但梅雨季帶來間歇性降雨。天氣不穩定，出發前一定要查當日預報。',
    doList: ['室內文化景點', '礁溪溫泉（雨天最舒服）', '傳藝中心', '蘭陽博物館'],
    dontList: ['海灘、衝浪', '高山行程（雲霧遮景）', '烤肉活動'] },
  { season: '夏季（颱風旺季）', period: '6月～8月', emoji: '☀️', score: 4, color: '#f7d08a',
    desc: '宜蘭夏天豔陽高照，戶外活動最過癮。但颱風季需注意，龜山島搭船、山區景點遇颱風要即時取消。',
    doList: ['龜山島搭船', '衝浪、戲水', '冬山河親水公園', '東澳粉鳥林'],
    dontList: ['颱風前後 48 小時出遊', '山區行程（土石流風險）'] },
  { season: '秋季（東北季風來）', period: '9月～11月', emoji: '🌧️', score: 2, color: '#b5c4de',
    desc: '東北季風報到，宜蘭進入多雨期。這段時間是宜蘭雨量最多的季節，要有下雨的心理準備。',
    doList: ['全室內行程', '宜蘭餅發明館', '蘭陽博物館', '傳藝中心'],
    dontList: ['海灘', '山區行程', '任何戶外需要曬太陽的行程'] },
  { season: '冬季（但溫泉超香）', period: '12月～2月', emoji: '🌨️', score: 3, color: '#d4e8f0',
    desc: '冬天宜蘭陰冷多雨，但這正是礁溪溫泉最當季的時候。冷颼颼的天氣泡溫泉，反而成了最棒的體驗。',
    doList: ['礁溪溫泉（冬天必訪）', '室內文化景點', '南方澳吃海鮮暖身'],
    dontList: ['高山（可能結冰）', '水上活動', '長距離戶外健行'] },
]

// ── 行程規劃資料 ──
const planSteps = [
  { title: '先看天氣，決定大方向', hint: '天氣決定你能去哪一類景點', color: '#4ecdc4',
    desc: '宜蘭天氣善變，出發前一天確認當日天氣比週預報更準。天晴就往戶外跑，下雨就往室內躲。',
    example: '禮拜六預報有雨？直接把行程設定為「蘭陽博物館 + 傳藝中心 + 礁溪溫泉」這條室內路線。',
    warning: null },
  { title: '依地理位置串路線，別跳來跳去', hint: '同區景點一起排，減少開車時間', color: '#f7d08a',
    desc: '宜蘭南北縱深很長。頭城到蘇澳約 40 分鐘，如果上午頭城、中午蘇澳、下午礁溪，光在路上就耗掉一半時間。',
    example: '晴天一日遊：頭城（北關 + 烏石港）→ 礁溪（瀑布 + 溫泉）→ 宜蘭市（幾米廣場）。同在北宜蘭，車程流暢。',
    warning: '加入行程時注意「距離較遠」的提示，這代表路線可能需要超過 40 分鐘車程。' },
  { title: '預留緩衝時間，別把行程排滿', hint: '每個景點比你想的更容易超時', color: '#fc5c7d',
    desc: '景點卡片上有預估停留時間，但實際上加上「找停車位 + 吃飯 + 拍照」，通常會多 30 分鐘到 1 小時。',
    example: '礁溪溫泉公園標示 1.5 小時，實際算上泡腳、散步、找攤販吃東西，2.5 小時不算誇張。',
    warning: null },
]

const sampleItinerary = [
  { time: '08:30', emoji: '🚗', title: '從淡水出發', note: '走國道五號，雪山隧道，約 50 分鐘抵達頭城' },
  { time: '09:30', emoji: '🌊', title: '北關海潮公園', note: '退潮時最壯觀，步道平緩約 1 小時' },
  { time: '11:00', emoji: '🏄', title: '烏石港海灘', note: '踩浪花、拍照，無需衝浪技術' },
  { time: '12:30', emoji: '🍜', title: '礁溪市區吃午餐', note: '蔥油餅、溫泉蔬菜，宜蘭必吃' },
  { time: '14:00', emoji: '💦', title: '五峰旗瀑布', note: '從礁溪市區開車 10 分鐘，步道輕鬆' },
  { time: '15:30', emoji: '♨️', title: '礁溪溫泉公園', note: '免費泡腳池，旅途最佳收尾' },
  { time: '17:30', emoji: '🚗', title: '返程', note: '避開下班尖峰，錯開車潮' },
]

// ── 如何使用資料 ──
const howtoSteps = [
  { title: '選擇今日天氣',
    desc: '點選「晴天出遊」或「雨天備案」，讓系統自動過濾掉不適合當天天氣的景點。不確定就選「不限天氣」。',
    options: ['🌤️ 不限天氣', '☀️ 晴天出遊', '🌧️ 雨天備案'] },
  { title: '選擇你的心情標籤',
    desc: '標籤可以多選。系統會找出同時符合所有條件的景點。選越多條件，結果越精準；選太多可能會沒有結果。',
    options: ['🌊 看海', '🌲 山林', '🏠 室內', '📸 拍美照', '🍜 覓食', '🎭 文化體驗'] },
  { title: '瀏覽景點卡片',
    desc: '每張卡片顯示景點名稱、推薦理由、預估停留時間與門票資訊。點擊「加入行程」可以收藏。',
    options: null },
  { title: '前往「我的行程」查看',
    desc: '行程頁面會顯示你選取的所有景點、總停留時間，以及相鄰景點的距離提示，幫你評估行程是否合理。',
    options: null },
]

const features = [
  { icon: '⚡', title: '即時篩選', desc: '選完標籤，景點列表立即更新，不需要按送出' },
  { icon: '✨', title: '動態動畫', desc: '景點卡片淡入淡出，清楚看到哪些景點被篩掉' },
  { icon: '📋', title: '行程收藏', desc: '點擊加入行程，自動累計停留時間' },
  { icon: '⚠️', title: '距離提醒', desc: '行程中相距過遠的景點會自動顯示警示' },
  { icon: '💾', title: '自動存檔', desc: '關閉瀏覽器也不怕，行程自動儲存在本機' },
  { icon: '📱', title: '手機友善', desc: '版面自動適應手機螢幕，躺在床上也能規劃' },
]

// ── 交通指南資料 ──
const transportMethods = [
  { id: 'car', icon: '🚗', name: '自駕（最推薦）', time: '淡水出發約 50–60 分鐘（順暢）',
    tags: [{ label: '最靈活', type: 'tag-good' }, { label: '需要有車', type: 'tag-neutral' }],
    desc: '宜蘭景點分散，自駕是最有效率的方式。雪山隧道通車後，假日不塞車的話 50 分鐘就到。',
    steps: ['淡水 → 國道一號南下', '接國道五號（汐五高架）', '雪山隧道（單程 $130）', '出隧道即到頭城，往南依序是礁溪、宜蘭市、羅東'],
    pros: ['行動自由，想停哪停哪', '可帶大量行李或露營裝備', '景點間移動時間短'],
    cons: ['假日雪隧可能塞 1–2 小時', '需要支付過路費與停車費', '駕駛需要休息，不能一路玩到嗨'] },
  { id: 'train', icon: '🚂', name: '火車（宜蘭線）', time: '台北到宜蘭約 1.5–2 小時',
    tags: [{ label: '沿途風景美', type: 'tag-good' }, { label: '景點需轉乘', type: 'tag-neutral' }],
    desc: '台鐵宜蘭線穿越山區，沿途風景漂亮，不輸到宜蘭本身。但下車後景點間需要搭計程車或騎 YouBike。',
    steps: ['台北車站 → 搭區間車或莒光號', '途經八堵、瑞芳（可看山景）', '抵達礁溪、宜蘭、羅東', '下車後可租機車或叫計程車'],
    pros: ['不用擔心塞車', '沿途風景是一大亮點', '可以喝酒不怕開車'],
    cons: ['景點大多需要轉乘', '行動範圍受限', '假日車票要提前買'] },
  { id: 'bus', icon: '🚌', name: '葛瑪蘭客運', time: '台北到宜蘭約 1.5–2 小時',
    tags: [{ label: '最省錢', type: 'tag-good' }, { label: '班次固定', type: 'tag-neutral' }],
    desc: '葛瑪蘭、首都客運等都有台北直達羅東的班次，票價只要 $130 左右。沒有車的最佳選擇。',
    steps: ['台北市府轉運站或三重客運站搭車', '直達羅東轉運站（約 1.5 小時）', '羅東轉運站可搭宜蘭縣公車或叫 Uber'],
    pros: ['票價便宜（$130 左右）', '不需要開車或轉乘火車', '可在路上睡覺'],
    cons: ['下車後移動不便', '回程假日常客滿，需提前訂票', '無法帶大行李'] },
]

const trafficLabel = { free: '暢通', light: '稍壅', heavy: '壅塞', jam: '地獄' }
const trafficData = [
  { time: '06:00–08:00', sat: 'free',   sun: 'light' },
  { time: '08:00–10:00', sat: 'heavy',  sun: 'free' },
  { time: '10:00–12:00', sat: 'jam',    sun: 'free' },
  { time: '12:00–14:00', sat: 'heavy',  sun: 'light' },
  { time: '14:00–16:00', sat: 'light',  sun: 'heavy' },
  { time: '16:00–18:00', sat: 'free',   sun: 'jam' },
  { time: '18:00–20:00', sat: 'free',   sun: 'heavy' },
]

const parkingSpots = [
  { area: '礁溪溫泉區', info: '礁溪溫泉公園旁有收費停車場，假日 $30/小時', tip: '建議停在外圍路邊，走 5 分鐘進去' },
  { area: '烏石港 / 頭城', info: '烏石港停車場假日常客滿，建議 09:00 前到', tip: '附近有幾個私人停車場，可導航查詢' },
  { area: '羅東夜市', info: '周邊路邊停車位，晚上 6 點後開始難找', tip: '建議停在羅東文化工場停車場步行過去' },
  { area: '傳藝中心', info: '園區內有大型停車場，$50/次', tip: '可停在這裡，再搭接駁車去其他景點' },
]

// ── 必吃美食資料 ──
const foodItems = [
  { name: '礁溪蔥油餅', emoji: '🧅', district: '礁溪', price: '$40–60', where: '礁溪市區各攤販',
    desc: '三星蔥是宜蘭最知名的農產品，蔥油餅是最直接的吃法。外皮酥脆、蔥味濃郁，剛出爐最好吃。' },
  { name: '溫泉空心菜', emoji: '🥬', district: '礁溪', price: '$80–120', where: '礁溪各熱炒店',
    desc: '用礁溪溫泉水澆灌的蔬菜，甜度異常高。看起來普通，吃完會驚呼「蔬菜可以這麼甜」。' },
  { name: '花生捲冰淇淋', emoji: '🍦', district: '羅東', price: '$60–80', where: '羅東夜市花生捲攤',
    desc: '花生糖刨成薄片，包住冰淇淋加香菜，台灣人覺得正常、外國人看了傻眼。一定要試。' },
  { name: '羊肉爐', emoji: '🍲', district: '羅東', price: '$200–400/人', where: '羅東鎮各羊肉爐店',
    desc: '羅東的羊肉爐是宜蘭最強招牌之一，尤其秋冬來吃補氣驅寒，湯底鮮甜無膻味。' },
  { name: '宜蘭牛舌餅', emoji: '🥮', district: '宜蘭市', price: '$50/包', where: '宜蘭市各餅舖、發明館',
    desc: '超薄、硬脆的宜蘭名產，原料只有麵粉和糖。去宜蘭餅發明館可以自己體驗手工製作。' },
  { name: '糕渣', emoji: '🍮', district: '宜蘭市', price: '$50–80', where: '宜蘭市傳統小吃店',
    desc: '外表像炸豆腐，咬下去瞬間噴出滾燙內餡，超容易燙傷。這是宜蘭人最引以為傲的隱藏版小吃。' },
  { name: '現撈海鮮', emoji: '🦞', district: '蘇澳', price: '$300–800/人', where: '南方澳漁港周邊海鮮餐廳',
    desc: '南方澳是台灣三大漁港，凌晨進港的漁獲直送餐廳，中午吃到的海鮮可能早上還在海裡。' },
  { name: '蘇澳羊羹', emoji: '🍡', district: '蘇澳', price: '$100–200/盒', where: '蘇澳市區各老店',
    desc: '台灣日治時期留下的羊羹文化，蘇澳是全台羊羹最有名的地方，口感細緻、甜而不膩，是頂級伴手禮。' },
  { name: '羅東夜市一串心', emoji: '🍢', district: '羅東', price: '$25–35/串', where: '羅東夜市固定攤',
    desc: '豬心串燒，聽起來奇怪，但這是羅東夜市排隊最長的攤位之一。Q 彈口感加上獨門醬汁，上癮等級。' },
  { name: '傳藝中心古早味零食', emoji: '🍭', district: '五結', price: '各異', where: '國立傳統藝術中心內',
    desc: '麥芽糖、龍鬚糖、爆米花⋯⋯進去傳藝中心就是一條小吃街，每樣都想買，錢包會哭。' },
  { name: '冬山蜜餞', emoji: '🍑', district: '冬山', price: '$80–150/包', where: '冬山鄉農特產店',
    desc: '冬山是宜蘭農業重鎮，楊桃蜜餞、梅子製品遠近馳名，可以在梅花湖周邊的農特產店購買。' },
  { name: '龜山島船上海釣', emoji: '🐟', district: '頭城', price: '依行程', where: '烏石港搭船',
    desc: '繞龜山島的觀光船有些會提供釣魚體驗，自己釣、船家直接幫你料理，新鮮到沒話說。' },
]

const foodDistricts = computed(() => {
  const all = ['全部', ...new Set(foodItems.map(f => f.district))]
  return all
})

const filteredFoods = computed(() => {
  if (selectedFoodDistrict.value === '全部') return foodItems
  return foodItems.filter(f => f.district === selectedFoodDistrict.value)
})

// ── 踩雷FAQ資料 ──
const faqItems = [
  { id: 1, type: 'route', typeLabel: '路線規劃', q: '頭城、礁溪、羅東、蘇澳全部排在同一天？',
    a: '這是新手最常犯的錯誤。宜蘭南北縱深超過 50 公里，頭城到蘇澳開車要 40 分鐘以上，全排在一天等於有一半時間在開車。',
    tip: '第一次去宜蘭，選一個「區域」集中玩：北部（頭城＋礁溪）或中部（宜蘭市＋羅東）二選一。' },
  { id: 2, type: 'traffic', typeLabel: '交通', q: '週六早上 10 點才從台北出發，會塞車嗎？',
    a: '幾乎可以確定會。週六 09:00–12:00 是雪山隧道最壅塞的時段，從台北到礁溪可能要 2–3 小時，塞到你想哭。',
    tip: '週六出發時間要在 07:00 前，或改搭火車、客運。' },
  { id: 3, type: 'weather', typeLabel: '天氣', q: '週預報說週六晴天，結果到了宜蘭下雨？',
    a: '這很正常。宜蘭的天氣和台北完全不同，週預報只能當參考。宜蘭受東北季風影響，即使台北大晴天，宜蘭可能在下雨。',
    tip: '出發前一天晚上查「宜蘭縣今日天氣」，比週預報準確多了。也順手查一個雨天備案景點。' },
  { id: 4, type: 'booking', typeLabel: '預訂', q: '沒有事先訂龜山島船票，直接去烏石港能買到嗎？',
    a: '假日幾乎不可能現場買到。龜山島每日登島人數有限制，旺季（6–9月）和連假往往一票難求，要提前數天到數週預訂。',
    tip: '確定要去龜山島，至少提前 3–7 天在網路訂票。若已確定天氣好，越早訂越好。' },
  { id: 5, type: 'parking', typeLabel: '停車', q: '直接開車到礁溪溫泉區，路邊停好停嗎？',
    a: '假日礁溪市區停車位非常搶手，旺季開車繞半小時找不到位子很常見。',
    tip: '建議使用 Google Maps 搜尋「礁溪停車場」，選離景點稍遠但有位子的停車場，走幾分鐘路就好。' },
  { id: 6, type: 'route', typeLabel: '路線規劃', q: '東澳粉鳥林可以搭公車去嗎？',
    a: '不行。東澳粉鳥林是宜蘭相對偏遠的秘境，沒有直達的大眾運輸，只能開車或租機車前往。',
    tip: '這個景點一定要自駕。天晴時才值得去，下雨或陰天翡翠綠海水的顏色會大打折扣。' },
  { id: 7, type: 'food', typeLabel: '飲食', q: '去羅東夜市，幾點去比較好？',
    a: '太早去（17:00 前）很多攤販還沒開始營業，人少但選擇也少；太晚去（21:00 後）精華攤位可能已經賣完。',
    tip: '最佳時段是 18:30–20:00，攤販全開、人潮熱鬧但還不到擁擠。' },
  { id: 8, type: 'season', typeLabel: '季節', q: '秋冬去宜蘭，還有什麼好玩的？',
    a: '很多人以為秋冬宜蘭沒什麼好去，但其實這是礁溪溫泉最香的季節，傳藝中心、蘭陽博物館這些室內景點也完全不受影響。',
    tip: '秋冬行程主軸：礁溪溫泉 + 室內文化景點 + 海鮮熱食。把沙灘留給夏天，把溫泉留給冬天。' },
]
</script>

<style scoped>
.guide {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1.5rem 5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.guide-hero {
  text-align: center;
  padding: 2.5rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.guide-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
  background: linear-gradient(90deg, #4ecdc4, #a8edea, #ffffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.guide-sub {
  color: rgba(255,255,255,0.7);
  line-height: 1.7;
}

.tab-bar {
  display: flex;
  gap: 0.4rem;
  padding: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  color: rgba(255,255,255,0.65);
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
}

.tab-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
.tab-btn.active {
  background: rgba(78, 205, 196, 0.25);
  border: 1px solid rgba(78, 205, 196, 0.5);
  color: #4ecdc4;
}

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-title { font-size: 1.5rem; font-weight: 800; }
.section-desc { color: rgba(255,255,255,0.7); line-height: 1.8; }
.sub-title { font-size: 1.1rem; font-weight: 700; margin-top: 0.5rem; }

/* ── 地理 ── */
.district-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 0.75rem;
}

.district-card { padding: 1rem; cursor: pointer; transition: all 0.2s ease; }
.district-card:hover, .district-card.selected {
  border-color: rgba(78, 205, 196, 0.6);
  background: rgba(78, 205, 196, 0.1);
}

.district-header { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.6rem; }
.district-emoji { font-size: 1.5rem; }
.district-name { font-weight: 700; }
.district-km { font-size: 0.75rem; color: rgba(255,255,255,0.5); }
.district-tags { display: flex; flex-wrap: wrap; gap: 0.35rem; }
.d-tag { font-size: 0.72rem; background: rgba(255,255,255,0.12); padding: 0.15rem 0.5rem; border-radius: 50px; color: rgba(255,255,255,0.8); }

.district-detail { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
.detail-header { display: flex; align-items: flex-start; gap: 1rem; }
.detail-emoji { font-size: 2rem; }
.detail-header h3 { font-size: 1.2rem; font-weight: 700; }
.detail-sub { font-size: 0.85rem; color: rgba(255,255,255,0.6); margin-top: 0.2rem; }
.close-btn { margin-left: auto; background: none; border: none; color: rgba(255,255,255,0.5); font-size: 1rem; cursor: pointer; }
.close-btn:hover { color: #fff; }
.detail-tips { display: flex; flex-direction: column; gap: 0.5rem; }
.tip-item { display: flex; gap: 0.5rem; font-size: 0.9rem; color: rgba(255,255,255,0.8); }
.tip-dot { color: #4ecdc4; font-weight: 700; }
.related-spots { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; }
.related-label { font-size: 0.8rem; color: rgba(255,255,255,0.5); }
.spot-chip { font-size: 0.8rem; background: rgba(78,205,196,0.15); border: 1px solid rgba(78,205,196,0.3); padding: 0.2rem 0.6rem; border-radius: 50px; }
.no-spot { font-size: 0.8rem; color: rgba(255,255,255,0.4); }

/* ── 天氣 ── */
.weather-cards { display: flex; flex-direction: column; gap: 0.75rem; }
.weather-card { padding: 1.25rem 1.5rem; cursor: pointer; }
.weather-card-top { display: flex; align-items: center; gap: 1rem; }
.weather-left { display: flex; align-items: center; gap: 0.75rem; flex: 1; }
.weather-emoji { font-size: 1.8rem; flex-shrink: 0; }
.weather-season { font-weight: 700; }
.weather-period { font-size: 0.8rem; color: rgba(255,255,255,0.55); }
.weather-score-group { display: flex; flex-direction: column; align-items: flex-end; gap: 0.35rem; min-width: 120px; }
.weather-score { font-size: 0.8rem; font-weight: 600; }
.score-bar { width: 100%; height: 4px; background: rgba(255,255,255,0.15); border-radius: 2px; overflow: hidden; }
.score-fill { height: 100%; border-radius: 2px; transition: width 0.5s ease; }
.expand-icon { color: rgba(255,255,255,0.4); font-size: 0.75rem; flex-shrink: 0; }
.weather-detail { margin-top: 1.25rem; display: flex; flex-direction: column; gap: 1rem; }
.weather-desc { font-size: 0.9rem; color: rgba(255,255,255,0.75); line-height: 1.7; }
.weather-do-dont { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.list-title { font-size: 0.8rem; font-weight: 700; margin-bottom: 0.5rem; }
.list-title.do { color: #4ecdc4; }
.list-title.dont { color: #fc5c7d; }
.list-item { font-size: 0.85rem; color: rgba(255,255,255,0.75); padding: 0.2rem 0; }

/* ── 行程規劃 ── */
.steps { display: flex; flex-direction: column; gap: 0.75rem; }
.step { padding: 1.25rem 1.5rem; cursor: pointer; }
.step-header { display: flex; align-items: center; gap: 1rem; }
.step-number { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 1rem; color: #0a2a4a; flex-shrink: 0; }
.step-title { font-weight: 700; }
.step-hint { font-size: 0.8rem; color: rgba(255,255,255,0.55); margin-top: 0.15rem; }
.step-info { flex: 1; }
.step-detail { margin-top: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; }
.step-desc { font-size: 0.9rem; color: rgba(255,255,255,0.75); line-height: 1.7; }
.glass-inner { padding: 1rem 1.25rem; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; }
.example-label { font-size: 0.75rem; color: #4ecdc4; font-weight: 700; margin-bottom: 0.4rem; }
.glass-inner p { font-size: 0.88rem; color: rgba(255,255,255,0.75); line-height: 1.6; }
.step-warning { display: flex; gap: 0.5rem; font-size: 0.85rem; color: #f7d08a; background: rgba(247,208,138,0.1); border: 1px solid rgba(247,208,138,0.25); border-radius: 8px; padding: 0.75rem 1rem; }

.sample-itinerary { padding: 1.5rem; }
.sample-title { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.3rem; }
.sample-sub { font-size: 0.8rem; color: rgba(255,255,255,0.5); margin-bottom: 1.25rem; }
.timeline { display: flex; flex-direction: column; }
.timeline-item { display: grid; grid-template-columns: 56px 16px 1fr; gap: 0 0.75rem; align-items: start; padding-bottom: 1rem; position: relative; }
.timeline-time { font-size: 0.78rem; color: #4ecdc4; font-weight: 700; padding-top: 0.15rem; text-align: right; }
.timeline-dot { width: 10px; height: 10px; background: #4ecdc4; border-radius: 50%; margin-top: 0.25rem; position: relative; z-index: 1; }
.timeline-item:not(:last-child) .timeline-dot::after { content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); width: 2px; height: calc(100% + 1.75rem); background: rgba(78,205,196,0.25); }
.timeline-title { font-size: 0.9rem; font-weight: 600; }
.timeline-note { font-size: 0.8rem; color: rgba(255,255,255,0.55); margin-top: 0.2rem; }

/* ── 如何使用 ── */
.howto-steps { display: flex; flex-direction: column; gap: 1rem; }
.howto-step { display: flex; gap: 1.25rem; padding: 1.25rem 1.5rem; align-items: flex-start; }
.howto-number { width: 32px; height: 32px; background: rgba(78,205,196,0.25); border: 1px solid rgba(78,205,196,0.5); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #4ecdc4; flex-shrink: 0; font-size: 0.9rem; }
.howto-title { font-weight: 700; margin-bottom: 0.4rem; }
.howto-desc { font-size: 0.88rem; color: rgba(255,255,255,0.7); line-height: 1.7; margin-bottom: 0.75rem; }
.howto-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.howto-tag { font-size: 0.8rem; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 0.2rem 0.65rem; border-radius: 50px; }
.features-title { font-size: 1.1rem; font-weight: 700; margin-top: 0.5rem; }
.features-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 0.75rem; }
.feature-card { padding: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; }
.feat-icon { font-size: 1.5rem; }
.feat-title { font-weight: 700; font-size: 0.95rem; }
.feat-desc { font-size: 0.83rem; color: rgba(255,255,255,0.65); line-height: 1.5; }
.cta-box { text-align: center; padding: 2rem; display: flex; flex-direction: column; align-items: center; gap: 1.25rem; background: rgba(78,205,196,0.08); border-color: rgba(78,205,196,0.3) !important; }
.cta-box p { font-size: 1.1rem; color: rgba(255,255,255,0.8); }
.cta-btn { display: inline-block; padding: 0.75rem 2rem; background: #4ecdc4; color: #0a2a4a; font-weight: 700; border-radius: 50px; font-size: 0.95rem; transition: all 0.2s ease; }
.cta-btn:hover { background: #38bdb5; transform: translateY(-2px); }

/* ── 交通指南 ── */
.transport-methods { display: flex; flex-direction: column; gap: 0.75rem; }
.method-card { padding: 1.25rem 1.5rem; cursor: pointer; transition: all 0.2s ease; }
.method-card.active { border-color: rgba(78,205,196,0.5); background: rgba(78,205,196,0.07); }
.method-top { display: flex; align-items: center; gap: 1rem; }
.method-icon { font-size: 1.8rem; flex-shrink: 0; }
.method-name { font-weight: 700; }
.method-time { font-size: 0.8rem; color: rgba(255,255,255,0.55); margin-top: 0.1rem; }
.method-info { flex: 1; }
.method-tags { display: flex; gap: 0.4rem; flex-wrap: wrap; }
.method-tag { font-size: 0.75rem; padding: 0.2rem 0.6rem; border-radius: 50px; }
.tag-good { background: rgba(78,205,196,0.2); color: #4ecdc4; border: 1px solid rgba(78,205,196,0.3); }
.tag-neutral { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.7); border: 1px solid rgba(255,255,255,0.2); }
.method-detail { margin-top: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem; }
.method-desc { font-size: 0.9rem; color: rgba(255,255,255,0.75); line-height: 1.7; }
.method-steps { display: flex; flex-direction: column; gap: 0.35rem; }
.method-step { display: flex; gap: 0.5rem; font-size: 0.85rem; color: rgba(255,255,255,0.75); }
.step-arrow { color: #4ecdc4; }
.method-pros-cons { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 0.5rem; }
.pros-title { font-size: 0.8rem; font-weight: 700; color: #4ecdc4; margin-bottom: 0.4rem; }
.cons-title { font-size: 0.8rem; font-weight: 700; color: #fc5c7d; margin-bottom: 0.4rem; }
.pro-item, .con-item { font-size: 0.82rem; color: rgba(255,255,255,0.7); padding: 0.15rem 0; }

.traffic-table { overflow: hidden; }
.traffic-header { display: grid; grid-template-columns: 130px 1fr 1fr; padding: 0.75rem 1.25rem; font-size: 0.8rem; font-weight: 700; color: rgba(255,255,255,0.5); border-bottom: 1px solid rgba(255,255,255,0.1); }
.traffic-row { display: grid; grid-template-columns: 130px 1fr 1fr; padding: 0.65rem 1.25rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
.traffic-row:last-child { border-bottom: none; }
.traffic-time { font-size: 0.82rem; color: rgba(255,255,255,0.6); }
.traffic-cell { display: flex; align-items: center; gap: 0.4rem; font-size: 0.82rem; }
.traffic-cell.free { color: #4ecdc4; }
.traffic-cell.light { color: #f7d08a; }
.traffic-cell.heavy { color: #f09050; }
.traffic-cell.jam { color: #fc5c7d; }
.traffic-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.traffic-dot.free { background: #4ecdc4; }
.traffic-dot.light { background: #f7d08a; }
.traffic-dot.heavy { background: #f09050; }
.traffic-dot.jam { background: #fc5c7d; }

.parking-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.75rem; }
.parking-card { padding: 1rem; display: flex; flex-direction: column; gap: 0.4rem; }
.parking-area { font-weight: 700; font-size: 0.95rem; }
.parking-info { font-size: 0.82rem; color: rgba(255,255,255,0.65); line-height: 1.5; }
.parking-tip { font-size: 0.8rem; color: rgba(78,205,196,0.9); }

/* ── 必吃美食 ── */
.food-filter { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.food-filter-btn { padding: 0.45rem 1rem; border: 1px solid rgba(255,255,255,0.2); background: transparent; color: rgba(255,255,255,0.7); border-radius: 50px; font-size: 0.85rem; cursor: pointer; transition: all 0.2s ease; }
.food-filter-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
.food-filter-btn.active { background: rgba(78,205,196,0.2); border-color: rgba(78,205,196,0.5); color: #4ecdc4; }
.food-count { font-size: 0.85rem; color: rgba(255,255,255,0.5); }
.food-count strong { color: #4ecdc4; }
.food-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 0.75rem; position: relative; }
.food-card { padding: 1.25rem; display: flex; flex-direction: column; gap: 0.6rem; }
.food-top { display: flex; align-items: flex-start; gap: 0.75rem; }
.food-emoji { font-size: 1.75rem; flex-shrink: 0; }
.food-name { font-weight: 700; font-size: 0.95rem; }
.food-district-label { font-size: 0.75rem; color: rgba(255,255,255,0.5); margin-top: 0.1rem; }
.food-price { margin-left: auto; font-size: 0.78rem; color: #4ecdc4; font-weight: 600; white-space: nowrap; }
.food-desc { font-size: 0.85rem; color: rgba(255,255,255,0.7); line-height: 1.6; }
.food-where { font-size: 0.78rem; color: rgba(255,255,255,0.45); }

/* ── 踩雷 FAQ ── */
.faq-list { display: flex; flex-direction: column; gap: 0.65rem; }
.faq-item { padding: 1.1rem 1.5rem; cursor: pointer; transition: all 0.2s ease; }
.faq-item.open { border-color: rgba(78,205,196,0.4); }
.faq-q { display: flex; align-items: center; gap: 0.75rem; }
.faq-tag { font-size: 0.7rem; font-weight: 700; padding: 0.15rem 0.6rem; border-radius: 50px; flex-shrink: 0; }
.faq-tag.route   { background: rgba(78,205,196,0.2); color: #4ecdc4; }
.faq-tag.traffic { background: rgba(247,208,138,0.2); color: #f7d08a; }
.faq-tag.weather { background: rgba(168,216,234,0.2); color: #a8d8ea; }
.faq-tag.booking { background: rgba(252,92,125,0.15); color: #fc5c7d; }
.faq-tag.parking { background: rgba(160,210,100,0.2); color: #a0d264; }
.faq-tag.food    { background: rgba(240,144,80,0.2); color: #f09050; }
.faq-tag.season  { background: rgba(180,130,230,0.2); color: #c09be8; }
.faq-question { font-weight: 600; font-size: 0.92rem; flex: 1; line-height: 1.5; }
.faq-chevron { color: rgba(255,255,255,0.4); font-size: 0.75rem; flex-shrink: 0; }
.faq-a { margin-top: 1rem; display: flex; flex-direction: column; gap: 0.75rem; }
.faq-a p { font-size: 0.88rem; color: rgba(255,255,255,0.7); line-height: 1.7; }
.faq-tip { font-size: 0.85rem; color: #4ecdc4; background: rgba(78,205,196,0.08); border-left: 3px solid #4ecdc4; padding: 0.65rem 1rem; border-radius: 0 8px 8px 0; }
.faq-tip span { font-weight: 700; }

/* ── Tip box ── */
.tip-box { display: flex; align-items: flex-start; gap: 1rem; padding: 1.25rem 1.5rem; background: rgba(78,205,196,0.08); border-color: rgba(78,205,196,0.3) !important; }
.tip-box-icon { font-size: 1.5rem; flex-shrink: 0; }
.tip-box p { font-size: 0.92rem; color: rgba(255,255,255,0.8); line-height: 1.7; }

/* ── Transitions ── */
.fade-tab-enter-active, .fade-tab-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.fade-tab-enter-from { opacity: 0; transform: translateY(12px); }
.fade-tab-leave-to { opacity: 0; transform: translateY(-8px); }
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.3s ease; overflow: hidden; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; max-height: 0; }
.slide-down-enter-to, .slide-down-leave-from { opacity: 1; max-height: 800px; }
</style>
