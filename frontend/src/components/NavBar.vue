<template>
  <header class="nav">
    <div class="nav-inner">
      <router-link to="/" class="brand">
        <span class="brand-mark">葡</span>
        <span class="brand-text">
          <strong>葡萄产业信息站</strong>
          <em>品种 · 行情 · 栽培</em>
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
  { path: '/varieties', label: '品种库' },
  { path: '/prices', label: '参考行情' },
  { path: '/knowledge', label: '栽培知识' },
  { path: '/about', label: '关于本站' }
]
</script>

<style scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 20;
  background: #ffffff;
  border-bottom: 1px solid var(--line);
  box-shadow: 0 1px 10px rgba(31, 68, 41, 0.06);
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
  background: var(--primary);
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 18px;
  font-weight: 700;
}
.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}
.brand-text strong {
  color: var(--primary);
  font-size: 16px;
  letter-spacing: 0.5px;
}
.brand-text em {
  font-style: normal;
  font-size: 12px;
  color: #7a8899;
  letter-spacing: 1px;
}
.links {
  display: flex;
  align-items: center;
  gap: 6px;
}
.link {
  padding: 9px 15px;
  border-radius: 999px;
  font-size: 14px;
  color: #34463b;
  text-decoration: none;
  transition: all 0.2s ease;
}
.link:hover {
  background: #f1f6f2;
  color: var(--primary);
}
.link.active {
  background: var(--primary);
  color: #fff;
}
.menu-toggle {
  display: none;
  border: 1px solid #d7e0da;
  background: #fff;
  color: var(--primary);
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
  border-top: 1px solid #eef3ef;
}
.mobile-link {
  padding: 10px 12px;
  border-radius: 8px;
  color: #34463b;
  text-decoration: none;
  font-size: 14px;
}
.mobile-link.active {
  background: #f1f6f2;
  color: var(--primary);
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
