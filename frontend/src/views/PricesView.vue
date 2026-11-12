<template>
  <section class="container page">
    <header class="page-head">
      <h1>参考行情</h1>
      <p>由后端 <code>GET /api/prices</code> 返回的示例数据，可按品种和产区筛选，仅用于横向对比。</p>
    </header>

    <div class="toolbar card">
      <div class="filters">
        <button
          v-for="item in varieties"
          :key="item"
          type="button"
          class="chip"
          :class="{ active: variety === item }"
          @click="variety = item"
        >
          {{ item }}
        </button>
      </div>
      <input v-model.trim="region" class="search" type="search" placeholder="按产区筛选，如：新疆" />
    </div>

    <div v-if="loading" class="state">加载中…</div>
    <div v-else-if="error" class="state error">{{ error }}</div>
    <div v-else class="table card">
      <table>
        <thead>
          <tr>
            <th>品种</th>
            <th>产区</th>
            <th>规格</th>
            <th class="right">参考价</th>
            <th>走势</th>
            <th>采集日期</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in list" :key="row.id">
            <td>{{ row.variety }}</td>
            <td>{{ row.region }}</td>
            <td>{{ row.spec }}</td>
            <td class="right price">{{ row.price }} {{ row.unit }}</td>
            <td><span class="trend" :class="row.trend">{{ trendText(row.trend) }}</span></td>
            <td>{{ row.date }}</td>
          </tr>
          <tr v-if="!list.length">
            <td colspan="6" class="empty">没有符合条件的数据</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="note">注：以上为演示用示例数据，不代表任何产区实际收购价，请以当地收购点报价为准。</p>
  </section>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { api } from '../api'

const varieties = ['全部', '阳光玫瑰', '巨峰', '夏黑', '红地球', '玫瑰香']
const variety = ref('全部')
const region = ref('')
const list = ref([])
const loading = ref(true)
const error = ref('')

function trendText(trend) {
  return { up: '↑ 上行', down: '↓ 下行', flat: '— 持平' }[trend] || ''
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const res = await api.getPrices({
      variety: variety.value === '全部' ? undefined : variety.value,
      region: region.value || undefined
    })
    list.value = res.items || []
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

watch([variety, region], load)
onMounted(load)
</script>

<style scoped>
.page {
  padding-top: 44px;
}
.page-head h1 {
  font-size: 26px;
}
.page-head p {
  margin-top: 8px;
  color: var(--muted);
  font-size: 13px;
}
.page-head code {
  background: #fff;
  border: 1px solid var(--line);
  padding: 2px 6px;
  border-radius: 5px;
  font-size: 12px;
}
.toolbar {
  margin-top: 22px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.chip {
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid #d9e2ec;
  background: #fff;
  color: #4a4256;
  font-size: 13px;
  cursor: pointer;
}
.chip.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
}
.search {
  flex: 1;
  min-width: 200px;
  padding: 11px 14px;
  border: 1px solid #d9e2ec;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
}
.search:focus {
  border-color: var(--primary);
}
.table {
  margin-top: 20px;
  padding: 6px 0;
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
thead th {
  text-align: left;
  padding: 14px 18px;
  color: var(--primary);
  border-bottom: 1px solid var(--line);
  font-weight: 600;
  white-space: nowrap;
}
tbody td {
  padding: 14px 18px;
  border-bottom: 1px dashed var(--line);
  color: #423a4c;
}
tbody tr:last-child td {
  border-bottom: none;
}
.right {
  text-align: right;
}
.price {
  font-weight: 600;
  color: var(--primary);
  white-space: nowrap;
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
.empty {
  text-align: center;
  color: var(--muted);
}
.note {
  margin-top: 14px;
  font-size: 12px;
  color: #8a7f93;
}
</style>
