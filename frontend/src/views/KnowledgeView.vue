<template>
  <section class="container page">
    <header class="page-head">
      <h1>栽培知识</h1>
      <p>由后端 <code>GET /api/knowledge</code> 返回的技术条目，按环节分类查看。</p>
    </header>

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

    <div v-if="loading" class="state">加载中…</div>
    <div v-else-if="error" class="state error">{{ error }}</div>
    <div v-else class="cards">
      <article v-for="item in filtered" :key="item.id" class="card item">
        <div class="item-head">
          <h2>{{ item.title }}</h2>
          <span class="tag">{{ item.category }}</span>
        </div>
        <p class="digest">{{ item.digest }}</p>
        <ul>
          <li v-for="point in item.points" :key="point">{{ point }}</li>
        </ul>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { api } from '../api'

const items = ref([])
const loading = ref(true)
const error = ref('')
const category = ref('全部')

const categories = computed(() => ['全部', ...new Set(items.value.map((i) => i.category))])
const filtered = computed(() =>
  category.value === '全部' ? items.value : items.value.filter((i) => i.category === category.value)
)

onMounted(async () => {
  try {
    const res = await api.getKnowledge()
    items.value = res.items || []
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})
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
.filters {
  margin: 22px 0;
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
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 18px;
}
.item {
  padding: 24px;
}
.item-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.item-head h2 {
  font-size: 16px;
}
.digest {
  margin: 12px 0 14px;
  font-size: 13px;
  line-height: 1.85;
  color: var(--muted);
}
.item ul {
  margin: 0;
  padding-left: 18px;
  font-size: 13px;
  line-height: 1.95;
  color: #423a4c;
}
</style>
