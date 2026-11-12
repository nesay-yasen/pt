<template>
  <section class="container page">
    <header class="page-head">
      <h1>关于本站</h1>
      <p>{{ about.name }} · 数据来源 <code>GET /api/about</code></p>
    </header>

    <div v-if="loading" class="state">加载中…</div>
    <div v-else-if="error" class="state error">{{ error }}</div>
    <div v-else class="grid">
      <div class="card panel">
        <h2 class="section-title">站点简介</h2>
        <p>{{ about.intro }}</p>
        <ul>
          <li v-for="item in about.duties" :key="item">{{ item }}</li>
        </ul>
      </div>

      <div class="card panel">
        <h2 class="section-title">说明</h2>
        <dl>
          <div v-for="item in about.contacts" :key="item.label">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
        </dl>

        <h2 class="section-title small">在线留言</h2>
        <form @submit.prevent="submit">
          <input v-model.trim="form.name" placeholder="您的称呼" required />
          <textarea v-model.trim="form.message" rows="3" placeholder="想补充的品种、产区信息（提交到 POST /api/messages）" required></textarea>
          <button class="btn" type="submit" :disabled="sending">
            {{ sending ? '提交中…' : '提交留言' }}
          </button>
          <p v-if="tip" class="tip" :class="{ error: tipError }">{{ tip }}</p>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { api } from '../api'

const about = ref({ name: '', intro: '', duties: [], contacts: [] })
const loading = ref(true)
const error = ref('')
const sending = ref(false)
const tip = ref('')
const tipError = ref(false)
const form = reactive({ name: '', message: '' })

onMounted(async () => {
  try {
    about.value = await api.getAbout()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
})

async function submit() {
  sending.value = true
  tip.value = ''
  try {
    const res = await api.sendMessage({ ...form })
    tip.value = res.message || '提交成功'
    tipError.value = false
    form.name = ''
    form.message = ''
  } catch (e) {
    tip.value = e.message
    tipError.value = true
  } finally {
    sending.value = false
  }
}
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
.grid {
  margin-top: 24px;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 20px;
}
.panel {
  padding: 26px;
}
.panel p {
  font-size: 14px;
  line-height: 1.95;
  color: #423a4c;
}
.panel ul {
  margin: 14px 0 0;
  padding-left: 18px;
  font-size: 13px;
  line-height: 1.95;
  color: #423a4c;
}
.panel dl {
  margin: 0;
}
.panel dl div {
  display: flex;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px dashed var(--line);
  font-size: 13px;
}
.panel dt {
  width: 72px;
  color: var(--muted);
  flex: none;
}
.panel dd {
  margin: 0;
  color: #423a4c;
}
.section-title.small {
  font-size: 16px;
  margin-top: 24px;
}
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
form input,
form textarea {
  padding: 11px 13px;
  border: 1px solid #d9e2ec;
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  resize: vertical;
}
form input:focus,
form textarea:focus {
  border-color: var(--primary);
}
form button {
  align-self: flex-start;
}
.tip {
  font-size: 13px;
  color: #1e7a45;
}
.tip.error {
  color: var(--accent);
}

@media (max-width: 860px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
