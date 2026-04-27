<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProgressStore } from '../stores/progress'

const router = useRouter()
const route = useRoute()
const progressStore = useProgressStore()

const progress = computed(() => progressStore.totalProgress)

const navItems = [
  { path: '/', label: '仪表盘' },
  { path: '/roadmap', label: '学习路线' },
  { path: '/resources', label: '学习资源' }
]

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function navigate(path) {
  router.push(path)
}
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <div class="header-brand" @click="navigate('/')">
        <span class="brand-icon">☕</span>
        <span class="brand-text">Java → AI 全栈路线图</span>
      </div>

      <nav class="header-nav">
        <button
          v-for="item in navItems"
          :key="item.path"
          :class="['nav-link', { active: isActive(item.path) }]"
          @click="navigate(item.path)"
        >
          {{ item.label }}
        </button>
      </nav>

      <div class="header-progress">
        <div class="progress-info">
          <span class="progress-label">总进度</span>
          <span class="progress-value">{{ progress }}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-bar-fill" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  height: 60px;
  gap: 32px;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
}

.brand-icon {
  font-size: 22px;
}

.brand-text {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
}

.header-nav {
  display: flex;
  gap: 4px;
  flex: 1;
}

.nav-link {
  padding: 6px 14px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-radius: var(--border-radius-sm);
  transition: all var(--transition);
}

.nav-link:hover {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.nav-link.active {
  background: #DBEAFE;
  color: var(--color-primary);
}

.header-progress {
  flex-shrink: 0;
  width: 180px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.progress-label {
  font-size: 12px;
  color: var(--text-muted);
}

.progress-value {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .header-inner {
    padding: 0 12px;
    gap: 12px;
  }

  .brand-text {
    font-size: 13px;
  }

  .nav-link {
    padding: 4px 8px;
    font-size: 12px;
  }

  .header-progress {
    width: 120px;
  }
}
</style>
