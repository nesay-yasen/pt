<template>
  <header class="nav">
    <div class="nav-inner">
      <router-link to="/" class="brand">
        <span class="brand-mark">法</span>
        <span class="brand-text">
          <strong>尤鲁都斯巴格司法所</strong>
          <em>普法宣传站</em>
        </span>
      </router-link>

      <nav class="links">
        <router-link
          v-for="item in menus"
          :key="item.path"
          :to="item.path"
          class="link"
          active-class="active"
        >
          {{ item.label }}
        </router-link>
      </nav>

      <button class="menu-toggle" type="button" @click="open = !open" aria-label="展开菜单">
        {{ open ? '收起' : '菜单' }}
      </button>
    </div>

    <div v-if="open" class="mobile-links">
      <router-link
        v-for="item in menus"
        :key="item.path"
        :to="item.path"
        class="mobile-link"
        active-class="active"
        @click="open = false"
      >
        {{ item.label }}
      </router-link>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const open = ref(false)
const menus = [
  { path: '/', label: '首页' },
  { path: '/activities', label: '培训活动' },
  { path: '/laws', label: '法律知识' },
  { path: '/about', label: '关于我们' }
]
</script>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 20;
  background: #ffffff;
  border-bottom: 1px solid #e6ebf2;
  box-shadow: 0 1px 10px rgba(15, 43, 77, 0.06);
}
.nav-inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}
.brand-mark {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #123a6b;
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 18px;
  font-weight: 700;
  font-family: 'KaiTi', 'STKaiti', serif;
}
.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}
.brand-text strong {
  color: #123a6b;
  font-size: 16px;
  letter-spacing: 0.5px;
}
.brand-text em {
  font-style: normal;
  font-size: 12px;
  color: #7a8899;
  letter-spacing: 2px;
}
.links {
  display: flex;
  align-items: center;
  gap: 8px;
}
.link {
  padding: 9px 16px;
  border-radius: 999px;
  font-size: 14px;
  color: #33465c;
  text-decoration: none;
  transition: all 0.2s ease;
}
.link:hover {
  background: #f2f6fb;
  color: #123a6b;
}
.link.active {
  background: #123a6b;
  color: #fff;
}
.menu-toggle {
  display: none;
  border: 1px solid #d7e0ea;
  background: #fff;
  color: #123a6b;
  border-radius: 8px;
  padding: 7px 12px;
  font-size: 13px;
  cursor: pointer;
}
.mobile-links {
  display: none;
  flex-direction: column;
  padding: 6px 20px 14px;
  gap: 6px;
  border-top: 1px solid #eef2f7;
}
.mobile-link {
  padding: 10px 12px;
  border-radius: 8px;
  color: #33465c;
  text-decoration: none;
  font-size: 14px;
}
.mobile-link.active {
  background: #f2f6fb;
  color: #123a6b;
  font-weight: 600;
}

@media (max-width: 720px) {
  .links {
    display: none;
  }
  .menu-toggle {
    display: inline-block;
  }
  .mobile-links {
    display: flex;
  }
}
</style>
