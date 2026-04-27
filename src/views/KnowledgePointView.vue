<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useProgressStore } from '../stores/progress'
import { phases } from '../data/phases'
import hljs from 'highlight.js/lib/core'
import java from 'highlight.js/lib/languages/java'
import 'highlight.js/styles/github-dark.min.css'

hljs.registerLanguage('java', java)

const props = defineProps({
  kpId: { type: String, required: true }
})

const router = useRouter()
const progressStore = useProgressStore()

const noteText = ref('')
const showNote = ref(false)

// 从所有阶段中查找知识点
const knowledgePoint = computed(() => {
  for (const phase of phases) {
    for (const topic of phase.topics) {
      const kp = topic.knowledgePoints.find(k => k.id === props.kpId)
      if (kp) return { ...kp, phaseId: phase.id, phaseTitle: phase.title, topicId: topic.id, topicTitle: topic.title }
    }
  }
  return null
})

// 查找相邻知识点（用于上下导航）
const adjacentKps = computed(() => {
  const all = []
  for (const phase of phases) {
    for (const topic of phase.topics) {
      for (const kp of topic.knowledgePoints) {
        all.push(kp.id)
      }
    }
  }
  const idx = all.indexOf(props.kpId)
  return {
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null
  }
})

const isCompleted = computed(() => progressStore.isKpCompleted(props.kpId))

function toggleComplete() {
  if (isCompleted.value) {
    progressStore.markKpIncomplete(props.kpId)
  } else {
    progressStore.markKpComplete(props.kpId)
  }
}

function toggleNote() {
  showNote.value = !showNote.value
  if (showNote.value) {
    noteText.value = progressStore.getNote(props.kpId)
  }
}

function saveNote() {
  progressStore.saveNote(props.kpId, noteText.value)
  showNote.value = false
}

function navigateTo(kpId) {
  if (kpId) router.push(`/knowledge/${kpId}`)
}

function backToPhase() {
  if (knowledgePoint.value) {
    router.push(`/phase/${knowledgePoint.value.phaseId}`)
  }
}

onMounted(() => {
  window.scrollTo(0, 0)
})

watch(() => props.kpId, () => {
  window.scrollTo(0, 0)
  showNote.value = false
})
</script>

<template>
  <div v-if="knowledgePoint" class="kp-view">
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <span @click="router.push('/')" class="crumb-link">仪表盘</span>
      <span class="crumb-sep">/</span>
      <span @click="router.push('/roadmap')" class="crumb-link">学习路线</span>
      <span class="crumb-sep">/</span>
      <span @click="backToPhase" class="crumb-link">{{ knowledgePoint.phaseTitle }}</span>
      <span class="crumb-sep">/</span>
      <span>{{ knowledgePoint.topicTitle }}</span>
    </div>

    <!-- 知识点头部 -->
    <div class="kp-header card">
      <div class="kp-tags">
        <span v-for="tag in knowledgePoint.tags" :key="tag" class="badge badge-primary">{{ tag }}</span>
        <span class="kp-estimate">{{ knowledgePoint.estimatedMinutes }} 分钟</span>
      </div>
      <h2>{{ knowledgePoint.title }}</h2>

      <!-- 浅显描述 -->
      <div class="short-desc-box">
        <span class="short-desc-icon">💡</span>
        <p>{{ knowledgePoint.shortDesc }}</p>
      </div>

      <button
        :class="['btn', isCompleted ? 'btn-success' : 'btn-primary']"
        @click="toggleComplete"
        style="margin-top: 16px;"
      >
        {{ isCompleted ? '✓ 已理解' : '标记为已理解' }}
      </button>
    </div>

    <!-- 深度原理 -->
    <div class="card section-card">
      <h3 class="section-heading">🔍 深度原理</h3>
      <div class="principle-content" v-html="knowledgePoint.deepPrinciple"></div>
    </div>

    <!-- 业务场景 -->
    <div class="card section-card">
      <h3 class="section-heading">🏢 真实业务场景</h3>
      <div class="scenario-content">{{ knowledgePoint.scenario }}</div>
    </div>

    <!-- 代码示例 -->
    <div class="card section-card">
      <h3 class="section-heading">💻 代码示例</h3>
      <div class="code-wrapper">
        <pre><code class="language-java" v-text="knowledgePoint.codeExample"></code></pre>
        <button class="copy-btn" @click="navigator.clipboard.writeText(knowledgePoint.codeExample)">
          📋 复制
        </button>
      </div>
    </div>

    <!-- 笔记 -->
    <div class="card section-card">
      <div class="note-header" @click="toggleNote">
        <h3 class="section-heading" style="margin: 0;">📝 学习笔记</h3>
        <span class="note-toggle">{{ showNote ? '收起' : '展开' }}</span>
      </div>
      <Transition name="slide">
        <div v-if="showNote" class="note-body">
          <textarea
            v-model="noteText"
            placeholder="记录你的理解、疑问或总结..."
            class="note-textarea"
            rows="5"
          ></textarea>
          <button class="btn btn-primary btn-sm" @click="saveNote">保存笔记</button>
        </div>
      </Transition>
      <div v-if="!showNote && progressStore.getNote(props.kpId)" class="note-preview">
        {{ progressStore.getNote(props.kpId).slice(0, 100) }}{{ progressStore.getNote(props.kpId).length > 100 ? '...' : '' }}
      </div>
    </div>

    <!-- 上下导航 -->
    <div class="kp-nav">
      <button
        v-if="adjacentKps.prev"
        class="btn btn-outline"
        @click="navigateTo(adjacentKps.prev)"
      >
        ← 上一个知识点
      </button>
      <span v-else></span>
      <button
        v-if="adjacentKps.next"
        class="btn btn-outline"
        @click="navigateTo(adjacentKps.next)"
      >
        下一个知识点 →
      </button>
    </div>
  </div>

  <div v-else class="card empty-state">
    <h3>知识点未找到</h3>
    <p>请从 <router-link to="/roadmap">学习路线</router-link> 选择知识点。</p>
  </div>
</template>

<style scoped>
.kp-view {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.crumb-link {
  color: var(--color-primary);
  cursor: pointer;
}

.crumb-link:hover {
  text-decoration: underline;
}

.crumb-sep {
  color: var(--text-muted);
}

.kp-header {
  margin-bottom: 20px;
}

.kp-tags {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.kp-estimate {
  font-size: 12px;
  color: var(--text-muted);
}

.kp-header h2 {
  font-size: 26px;
  margin-bottom: 16px;
}

.short-desc-box {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #FFF7ED;
  border-radius: var(--border-radius);
  border-left: 4px solid var(--color-warning);
}

.short-desc-icon {
  font-size: 24px;
  flex-shrink: 0;
  margin-top: 2px;
}

.short-desc-box p {
  font-size: 15px;
  color: #92400E;
  line-height: 1.6;
}

.section-card {
  margin-bottom: 16px;
}

.section-heading {
  font-size: 18px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.principle-content {
  font-size: 15px;
  line-height: 1.8;
  color: var(--text-primary);
}

.principle-content :deep(p) {
  margin-bottom: 12px;
}

.principle-content :deep(strong) {
  color: var(--color-primary);
}

.principle-content :deep(ul),
.principle-content :deep(ol) {
  padding-left: 20px;
  margin-bottom: 12px;
}

.principle-content :deep(li) {
  margin-bottom: 6px;
}

.scenario-content {
  font-size: 15px;
  line-height: 1.8;
  color: var(--text-primary);
  white-space: pre-wrap;
}

.code-wrapper {
  position: relative;
}

.copy-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 10px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: background var(--transition);
}

.copy-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.note-toggle {
  font-size: 13px;
  color: var(--color-primary);
}

.note-body {
  margin-top: 12px;
}

.note-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  margin-bottom: 8px;
  line-height: 1.6;
}

.note-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.note-preview {
  margin-top: 8px;
  font-size: 13px;
  color: var(--text-muted);
  font-style: italic;
}

.kp-nav {
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
}

.empty-state {
  text-align: center;
  padding: 48px;
}

.empty-state h3 {
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .kp-header h2 {
    font-size: 20px;
  }

  .section-heading {
    font-size: 16px;
  }
}
</style>
