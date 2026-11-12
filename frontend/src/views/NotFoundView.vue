<template>
  <section class="container page">
    <h1>404</h1>
    <p>这个页面不存在，可能是链接已失效。</p>
    <router-link class="btn" to="/">返回首页</router-link>
  </section>
</template>

<style scoped>
.page {
  padding: 90px 24px;
  text-align: center;
}
.page h1 {
  font-size: 48px;
}
.page p {
  margin: 12px 0 24px;
  color: var(--muted);
}
</style>
