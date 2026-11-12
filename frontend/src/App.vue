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
        <p>尤鲁都斯巴格司法所 · 普法宣传站</p>
        <p class="footer-sub">地址：新疆阿克苏地区新和县尤鲁都斯巴格镇　联系电话：0997-XXXXXXX</p>
        <p class="footer-sub">本站为 Vue3 + Vite + Python 全栈示例项目，数据由本地后端接口提供。</p>
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
  background: #0f2b4d;
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
