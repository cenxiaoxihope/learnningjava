<script setup>
import { ref, computed } from 'vue'
import { allResources } from '../data/resources'

const activeType = ref('all')
const activePhase = ref('all')
const activeDifficulty = ref('all')

const types = ['all', 'book', 'video', 'doc', 'github']
const difficulties = ['all', 'beginner', 'intermediate', 'advanced']
const typeLabels = { all: '全部', book: '书籍', video: '视频', doc: '文档', github: 'GitHub' }
const diffLabels = { all: '全部难度', beginner: '入门', intermediate: '进阶', advanced: '深入' }

const filteredResources = computed(() => {
  return allResources.filter(r => {
    if (activeType.value !== 'all' && r.type !== activeType.value) return false
    if (activeDifficulty.value !== 'all' && r.difficulty !== activeDifficulty.value) return false
    return true
  })
})

function setType(type) { activeType.value = type }
function setDifficulty(diff) { activeDifficulty.value = diff }
</script>

<template>
  <div class="resources">
    <h2 class="section-title">学习资源</h2>
    <p class="section-subtitle">精选 Java 与 AI 全栈学习资料，按需取用</p>

    <!-- 筛选栏 -->
    <div class="filters card">
      <div class="filter-row">
        <span class="filter-label">类型：</span>
        <div class="filter-options">
          <button
            v-for="t in types"
            :key="t"
            :class="['btn btn-sm', activeType === t ? 'btn-primary' : 'btn-outline']"
            @click="setType(t)"
          >
            {{ typeLabels[t] }}
          </button>
        </div>
      </div>
      <div class="filter-row" style="margin-top: 8px;">
        <span class="filter-label">难度：</span>
        <div class="filter-options">
          <button
            v-for="d in difficulties"
            :key="d"
            :class="['btn btn-sm', activeDifficulty === d ? 'btn-primary' : 'btn-outline']"
            @click="setDifficulty(d)"
          >
            {{ diffLabels[d] }}
          </button>
        </div>
      </div>
    </div>

    <!-- 资源列表 -->
    <div class="resource-grid">
      <div v-for="resource in filteredResources" :key="resource.title" class="card resource-card">
        <div class="resource-top">
          <span :class="['badge', resource.difficulty === 'beginner' ? 'badge-success' : resource.difficulty === 'intermediate' ? 'badge-warning' : 'badge-primary']">
            {{ diffLabels[resource.difficulty] }}
          </span>
          <span class="resource-type">{{ typeLabels[resource.type] }}</span>
        </div>
        <h4 class="resource-title">{{ resource.title }}</h4>
        <p class="resource-desc">{{ resource.description }}</p>
        <a :href="resource.url" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm resource-link">
          访问资源 →
        </a>
      </div>

      <div v-if="filteredResources.length === 0" class="card empty-state" style="grid-column: 1 / -1;">
        <p>没有匹配的资源。尝试调整筛选条件。</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.resources {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.filters {
  margin-bottom: 24px;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  white-space: nowrap;
}

.filter-options {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.resource-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.resource-type {
  font-size: 12px;
  color: var(--text-muted);
}

.resource-title {
  font-size: 16px;
  margin-bottom: 8px;
}

.resource-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 14px;
  flex: 1;
}

.resource-card {
  display: flex;
  flex-direction: column;
}

.resource-link {
  align-self: flex-start;
  margin-top: auto;
}

.empty-state {
  text-align: center;
  padding: 32px;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .resource-grid {
    grid-template-columns: 1fr;
  }
}
</style>
