<template>
  <section class="container page">
    <header class="page-head">
      <h1>品种库</h1>
      <p>数据由 Python 后端 <code>GET /api/varieties</code> 提供，支持按关键词和类别筛选。</p>
    </header>

    <div class="toolbar card">
      <input v-model.trim="keyword" class="search" type="search" placeholder="输入关键词，如：早熟、无核、玫瑰香" />
      <div class="filters">
        <button
          v-for="item in categories"
          :key="item"
          type="button"
          class="chip"
          :class="{ active: category === item }"
          @click="category = item"
        >
          {{ item }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="state">加载中…</div>
    <div v-else-if="error" class="state error">{{ error }}</div>
    <div v-else-if="!list.length" class="state">没有符合条件的品种，换个关键词试试。</div>
    <div v-else class="list">
      <article v-for="item in list" :key="item.id" class="row card">
        <div class="row-main">
          <div class="row-head">
            <span class="tag">{{ item.category }}</span>
            <time>成熟期 {{ item.season }}</time>
          </div>
          <h2>{{ item.name }}</h2>
          <p>{{ item.summary }}</p>
          <div class="meta">
            <span>糖度：{{ item.sugar }}</span>
            <span v-for="tag in item.tags" :key="tag" class="mini">{{ tag }}</span>
          </div>
        </div>
        <router-link class="btn btn-ghost" :to="`/varieties/${item.id}`">查看详情</router-link>
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { api } from '../api'

const keyword = ref('')
const category = ref('全部')
const categories = ['全部', '鲜食 · 早熟', '鲜食 · 中熟', '鲜食 · 晚熟', '鲜食 · 晚熟耐贮', '鲜食 · 中晚熟']
const list = ref([])
const loading = ref(true)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    const res = await api.getVarieties({
      keyword: keyword.value || undefined,
      category: category.value === '全部' ? undefined : category.value
    })
    list.value = res.items || []
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

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
.search {
  flex: 1;
  min-width: 240px;
  padding: 11px 14px;
  border: 1px solid #d9e2ec;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
}
.search:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(47, 93, 58, 0.1);
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
.list {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.row {
  padding: 22px 24px;
  display: flex;
  gap: 24px;
  align-items: center;
  justify-content: space-between;
}
.row-main {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.row-head {
  display: flex;
  align-items: center;
  gap: 12px;
}
.row-head time {
  font-size: 12px;
  color: var(--muted);
}
.row-main h2 {
  font-size: 17px;
}
.row-main p {
  color: var(--muted);
  font-size: 13px;
  line-height: 1.85;
}
.meta {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 12px;
  color: #51637a;
  border-top: 1px dashed var(--line);
  padding-top: 12px;
}
.mini {
  padding: 2px 8px;
  border-radius: 6px;
  background: #f4f1f7;
  color: #5b4a68;
}

@media (max-width: 720px) {
  .row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
