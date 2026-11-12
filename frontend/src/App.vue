<template>
  <div class="layout">
    <NavBar />
    <main class="main">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </main>
    <footer class="footer">
      <div class="footer-inner">
        <p>葡萄产业信息站 · 品种 / 行情 / 栽培</p>
        <p class="footer-sub">站内数值均为演示用示例数据，非实时行情，请以当地实际报价与技术指导为准。</p>
        <p class="footer-sub">Vue 3 + Vite + vue-router + axios 前端，FastAPI 后端，GitHub Pages 静态部署。</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.main {
  flex: 1;
}
.footer {
  background: #1f3d29;
  color: rgba(255, 255, 255, 0.86);
  padding: 32px 24px;
  margin-top: 48px;
}
.footer-inner {
  max-width: 1120px;
  margin: 0 auto;
  text-align: center;
  font-size: 13px;
  line-height: 1.9;
}
.footer-sub {
  color: rgba(255, 255, 255, 0.6);
}
</style>
