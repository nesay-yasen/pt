<template>
  <section class="container page">
    <router-link class="back" to="/activities">← 返回活动列表</router-link>

    <div v-if="loading" class="state">加载中…</div>
    <div v-else-if="error" class="state error">{{ error }}</div>

    <article v-else-if="detail" class="detail card">
      <header class="detail-head">
        <span class="tag">{{ detail.category }}</span>
        <h1>{{ detail.title }}</h1>
        <div class="meta">
          <span>时间：{{ detail.date }}</span>
          <span>地点：{{ detail.location }}</span>
          <span>参加人数：{{ detail.attendees }} 人</span>
          <span>主讲：{{ detail.speaker }}</span>
        </div>
      </header>

      <div class="content">
        <p v-for="(para, index) in detail.content" :key="index">{{ para }}</p>
      </div>

      <div class="points">
        <h2 class="section-title">培训要点</h2>
        <ul>
          <li v-for="point in detail.points" :key="point">{{ point }}</li>
        </ul>
      </div>

      <footer class="detail-foot">
        <span v-for="tag in detail.tags" :key="tag" class="tag">{{ tag }}</span>
      </footer>
    </article>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '../api'

const route = useRoute()
const detail = ref(null)
const loading = ref(true)
const error = ref('')

async function load(id) {
  loading.value = true
  error.value = ''
  detail.value = null
  try {
    detail.value = await api.getActivity(id)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

watch(
  () => route.params.id,
  (id) => {
    if (id) load(id)
  },
  { immediate: true }
)
</script>

<style scoped>
.page {
  padding-top: 32px;
}
.back {
  display: inline-block;
  margin-bottom: 16px;
  color: var(--muted);
  font-size: 13px;
  text-decoration: none;
}
.back:hover {
  color: var(--primary);
}
.detail {
  padding: 34px 38px;
}
.detail-head h1 {
  margin: 14px 0 16px;
  font-size: 24px;
  line-height: 1.5;
}
.meta {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--muted);
  padding-bottom: 18px;
  border-bottom: 1px solid var(--line);
}
.content {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.content p {
  font-size: 15px;
  line-height: 2;
  color: #33465c;
  text-indent: 2em;
}
.points {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--line);
}
.points ul {
  margin: 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 14px;
  color: #33465c;
  line-height: 1.9;
}
.detail-foot {
  margin-top: 28px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

@media (max-width: 720px) {
  .detail {
    padding: 24px 20px;
  }
}
</style>
