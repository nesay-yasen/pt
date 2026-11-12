<template>
  <section class="hero">
    <div class="container hero-inner">
      <div class="hero-text">
        <span class="tag">学法用法示范户 · 法律明白人</span>
        <h1>把法律送到群众身边<br />把矛盾化解在基层一线</h1>
        <p class="lead">
          尤鲁都斯巴格司法所围绕社会稳定和长治久安总目标，持续开展人民调解员、学法用法示范户、法律明白人培训，
          以法治方式服务乡村振兴和基层治理。
        </p>
        <div class="hero-actions">
          <router-link class="btn" to="/activities">查看培训活动</router-link>
          <router-link class="btn btn-ghost" to="/laws">学习法律知识</router-link>
        </div>
      </div>

      <div class="hero-stats">
        <div v-for="item in stats" :key="item.label" class="stat card">
          <strong>{{ item.value }}</strong>
          <span>{{ item.label }}</span>
        </div>
        <p v-if="statsError" class="state error">{{ statsError }}</p>
      </div>
    </div>
  </section>

  <section class="container block">
    <h2 class="section-title">最新培训活动</h2>
    <div v-if="loading" class="state">正在从后端接口加载数据…</div>
    <div v-else-if="error" class="state error">{{ error }}</div>
    <div v-else class="grid">
      <router-link
        v-for="item in activities"
        :key="item.id"
        class="activity card"
        :to="`/activities/${item.id}`"
      >
        <div class="activity-top">
          <span class="tag">{{ item.category }}</span>
          <time>{{ item.date }}</time>
        </div>
        <h3>{{ item.title }}</h3>
        <p class="desc">{{ item.summary }}</p>
        <div class="activity-foot">
          <span>{{ item.location }}</span>
          <span class="more">查看详情 →</span>
        </div>
      </router-link>
    </div>
  </section>

  <section class="container block">
    <h2 class="section-title">普法重点</h2>
    <div class="law-grid">
      <div v-for="law in laws" :key="law.id" class="law card">
        <h4>{{ law.name }}</h4>
        <p>{{ law.digest }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { api } from '../api'

const stats = ref([])
const statsError = ref('')
const activities = ref([])
const laws = ref([])
const loading = ref(true)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    const [statsRes, activityRes, lawRes] = await Promise.all([
      api.getStats(),
      api.getActivities({ limit: 3 }),
      api.getLaws()
    ])
    stats.value = statsRes.items || []
    activities.value = activityRes.items || []
    laws.value = (lawRes.items || []).slice(0, 3)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

async function loadStats() {
  try {
    const res = await api.getStats()
    stats.value = res.items || []
  } catch (e) {
    statsError.value = e.message
  }
}

onMounted(() => {
  load()
  if (!stats.value.length) loadStats()
})
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, #123a6b 0%, #1c4f8a 55%, #2a6aa8 100%);
  color: #fff;
  padding: 64px 0 56px;
}
.hero-inner {
  display: flex;
  gap: 48px;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}
.hero-text {
  max-width: 560px;
}
.hero-text .tag {
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
}
.hero-text h1 {
  color: #fff;
  font-size: 34px;
  line-height: 1.35;
  margin: 18px 0 16px;
  letter-spacing: 1px;
}
.lead {
  color: rgba(255, 255, 255, 0.82);
  font-size: 15px;
  line-height: 1.85;
}
.hero-actions {
  display: flex;
  gap: 12px;
  margin-top: 26px;
}
.hero-actions .btn {
  background: #fff;
  color: #123a6b;
}
.hero-actions .btn-ghost {
  background: transparent;
  color: #fff;
  border-color: rgba(255, 255, 255, 0.5);
}
.hero-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(120px, 1fr));
  gap: 14px;
  min-width: 292px;
}
.stat {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.22);
  padding: 18px 16px;
  text-align: center;
  color: #fff;
  box-shadow: none;
}
.stat strong {
  display: block;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.stat span {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.78);
}
.block {
  margin-top: 52px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 18px;
}
.activity {
  padding: 22px;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: transform 0.18s ease, box-shadow 0.22s ease;
}
.activity:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 30px rgba(15, 43, 77, 0.1);
}
.activity-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.activity-top time {
  font-size: 12px;
  color: var(--muted);
}
.activity h3 {
  font-size: 16px;
  line-height: 1.6;
}
.desc {
  color: var(--muted);
  font-size: 13px;
  line-height: 1.8;
  flex: 1;
}
.activity-foot {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--muted);
  border-top: 1px dashed var(--line);
  padding-top: 12px;
}
.more {
  color: var(--primary);
}
.law-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
.law {
  padding: 20px;
}
.law h4 {
  font-size: 15px;
  margin-bottom: 8px;
}
.law p {
  font-size: 13px;
  color: var(--muted);
  line-height: 1.8;
}

@media (max-width: 860px) {
  .hero-text h1 {
    font-size: 26px;
  }
  .hero-stats {
    width: 100%;
  }
}
</style>
