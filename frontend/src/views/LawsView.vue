<template>
  <section class="container page">
    <header class="page-head">
      <h1>法律知识</h1>
      <p>由后端 <code>GET /api/laws</code> 返回的普法知识条目，可按类别过滤。</p>
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
      <article v-for="law in filtered" :key="law.id" class="card item">
        <div class="item-head">
          <h2>{{ law.name }}</h2>
          <span class="tag">{{ law.category }}</span>
        </div>
        <p class="digest">{{ law.digest }}</p>
        <ul>
          <li v-for="point in law.points" :key="point">{{ point }}</li>
        </ul>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { api } from '../api'

const laws = ref([])
const loading = ref(true)
const error = ref('')
const category = ref('全部')
const categories = computed(() => ['全部', ...new Set(laws.value.map((l) => l.category))])
const filtered = computed(() =>
  category.value === '全部' ? laws.value : laws.value.filter((l) => l.category === category.value)
)

onMounted(async () => {
  try {
    const res = await api.getLaws()
    laws.value = res.items || []
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
  color: #33465c;
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
  color: #33465c;
}
</style>
