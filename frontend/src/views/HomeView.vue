<template>
  <section class="hero">
    <div class="container hero-inner">
      <div class="hero-text">
        <span class="tag">品种 · 行情 · 栽培</span>
        <h1>看得懂的葡萄信息<br />从选种到卖果一站查</h1>
        <p class="lead">
          汇总常见鲜食葡萄的成熟期、糖度与栽培要点，整理各产区不同规格的参考价格，
          把散落在各处的信息放在同一张表里对照着看。
        </p>
        <div class="hero-actions">
          <router-link class="btn" to="/varieties">浏览品种库</router-link>
          <router-link class="btn btn-ghost" to="/prices">查看参考行情</router-link>
        </div>
      </div>

      <div class="hero-stats">
        <div v-for="item in stats" :key="item.label" class="stat card">
          <strong>{{ item.value }}</strong>
          <span>{{ item.label }}</span>
        </div>
      </div>
    </div>
  </section>

  <section class="container block">
    <h2 class="section-title">热门品种</h2>
    <div v-if="loading" class="state">正在从后端接口加载数据…</div>
    <div v-else-if="error" class="state error">{{ error }}</div>
    <div v-else class="grid">
      <router-link
        v-for="item in varieties"
        :key="item.id"
        class="variety card"
        :to="`/varieties/${item.id}`"
      >
        <div class="variety-top">
          <span class="tag">{{ item.category }}</span>
          <time>{{ item.season }}</time>
        </div>
        <h3>{{ item.name }}</h3>
        <p class="desc">{{ item.summary }}</p>
        <div class="variety-foot">
          <span>糖度 {{ item.sugar }}</span>
          <span class="more">查看详情 →</span>
        </div>
      </router-link>
    </div>
  </section>

  <section class="container block">
    <h2 class="section-title">最近行情</h2>
    <div class="price-strip">
      <div v-for="row in prices" :key="row.id" class="price card">
        <div class="price-head">
          <h4>{{ row.variety }}</h4>
          <span class="trend" :class="row.trend">{{ trendText(row.trend) }}</span>
        </div>
        <p class="price-value">{{ row.price }} <em>{{ row.unit }}</em></p>
        <p class="price-meta">{{ row.region }} · {{ row.spec }}</p>
        <p class="price-meta">采集日期 {{ row.date }}</p>
      </div>
    </div>
    <p class="note">注：以上为演示用示例数据，不代表任何产区实际收购价。</p>
  </section>

  <section class="container block">
    <h2 class="section-title">栽培要点</h2>
    <div class="law-grid">
      <div v-for="item in knowledge" :key="item.id" class="law card">
        <h4>{{ item.title }}</h4>
        <p>{{ item.digest }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { api } from '../api'

const stats = ref([])
const varieties = ref([])
const prices = ref([])
const knowledge = ref([])
const loading = ref(true)
const error = ref('')

function trendText(trend) {
  return { up: '↑ 上行', down: '↓ 下行', flat: '— 持平' }[trend] || ''
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const [statsRes, varietyRes, priceRes, knowledgeRes] = await Promise.all([
      api.getStats(),
      api.getVarieties({ limit: 3 }),
      api.getPrices(),
      api.getKnowledge()
    ])
    stats.value = statsRes.items || []
    varieties.value = varietyRes.items || []
    prices.value = (priceRes.items || []).slice(0, 3)
    knowledge.value = (knowledgeRes.items || []).slice(0, 3)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, #23452c 0%, #2f5d3a 55%, #4a7d4f 100%);
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
  line-height: 1.4;
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
  color: #23452c;
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
  font-size: 26px;
  font-weight: 700;
}
.stat span {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}
.block {
  margin-top: 52px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 18px;
}
.variety {
  padding: 22px;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: transform 0.18s ease, box-shadow 0.22s ease;
}
.variety:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 30px rgba(31, 68, 41, 0.12);
}
.variety-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.variety-top time {
  font-size: 12px;
  color: var(--muted);
}
.variety h3 {
  font-size: 17px;
}
.desc {
  color: var(--muted);
  font-size: 13px;
  line-height: 1.85;
  flex: 1;
}
.variety-foot {
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
.price-strip {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}
.price {
  padding: 20px;
}
.price-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.price-head h4 {
  font-size: 15px;
}
.trend {
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 999px;
  background: #f3f0f6;
  color: #6b5b78;
}
.trend.up {
  background: #fdecec;
  color: #b0341f;
}
.trend.down {
  background: #eaf5ee;
  color: #1e7a45;
}
.price-value {
  margin: 12px 0 10px;
  font-size: 22px;
  font-weight: 700;
  color: var(--primary);
}
.price-value em {
  font-style: normal;
  font-size: 12px;
  font-weight: 400;
  color: var(--muted);
}
.price-meta {
  font-size: 12px;
  color: var(--muted);
  line-height: 1.8;
}
.note {
  margin-top: 14px;
  font-size: 12px;
  color: #8a7f93;
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
  line-height: 1.85;
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
