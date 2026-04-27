<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProgressStore } from '../stores/progress'
import { phases } from '../data/phases'

const props = defineProps({
  phaseId: { type: String, required: true }
})

const router = useRouter()
const progressStore = useProgressStore()

const expandedTopics = ref({})

const phase = computed(() => phases.find(p => p.id === props.phaseId))

const prevPhase = computed(() => {
  if (!phase.value) return null
  return phases.find(p => p.order === phase.value.order - 1) || null
})

const nextPhase = computed(() => {
  if (!phase.value) return null
  return phases.find(p => p.order === phase.value.order + 1) || null
})

function getTopicProgress(topic) {
  const total = topic.knowledgePoints.length
  const done = topic.knowledgePoints.filter(kp => progressStore.isKpCompleted(kp.id)).length
  return total === 0 ? 0 : Math.round((done / total) * 100)
}

function getPhaseProgress() {
  if (!phase.value) return 0
  return progressStore.getPhaseProgress(phase.value.id, phase.value.topics.map(t => t.id))
}

function toggleTopic(topicId) {
  expandedTopics.value[topicId] = !expandedTopics.value[topicId]
}

function goToKp(kpId) {
  router.push(`/knowledge/${kpId}`)
}

function goToPhase(id) {
  router.push(`/phase/${id}`)
}

function markTopicComplete(topic) {
  const allDone = topic.knowledgePoints.every(kp => progressStore.isKpCompleted(kp.id))
  if (allDone) {
    progressStore.markTopicComplete(topic.id)
  }
}

const phaseProgress = computed(() => getPhaseProgress())
</script>

<template>
  <div v-if="phase" class="phase-detail">
    <!-- 阶段头部 -->
    <div class="phase-header card">
      <div class="phase-nav">
        <button v-if="prevPhase" class="btn btn-outline btn-sm" @click="goToPhase(prevPhase.id)">
          ← {{ prevPhase.title }}
        </button>
        <span v-else></span>
        <button v-if="nextPhase" class="btn btn-outline btn-sm" @click="goToPhase(nextPhase.id)">
          {{ nextPhase.title }} →
        </button>
      </div>

      <div class="phase-header-main">
        <span class="badge badge-primary">Phase {{ phase.order }}</span>
        <h2>{{ phase.title }}</h2>
        <p class="phase-subtitle-text">{{ phase.subtitle }}</p>
      </div>

      <div class="phase-header-meta">
        <div class="meta-item">
          <span class="meta-value">{{ phase.estimatedWeeks }} 周</span>
          <span class="meta-label">预计时长</span>
        </div>
        <div class="meta-item">
          <span class="meta-value">{{ phase.topics.length }}</span>
          <span class="meta-label">主题数</span>
        </div>
        <div class="meta-item">
          <span class="meta-value">{{ phaseProgress }}%</span>
          <span class="meta-label">完成度</span>
        </div>
      </div>

      <div class="progress-bar">
        <div
          :class="['progress-bar-fill', phaseProgress === 100 ? 'success' : '']"
          :style="{ width: phaseProgress + '%' }"
        ></div>
      </div>

      <div class="phase-goal-box">
        <h4>学习目标</h4>
        <p>{{ phase.goal }}</p>
      </div>
    </div>

    <!-- 主题手风琴列表 -->
    <div class="topics-list">
      <div
        v-for="topic in phase.topics"
        :key="topic.id"
        class="topic-accordion card"
      >
        <div class="topic-header" @click="toggleTopic(topic.id)">
          <div class="topic-header-left">
            <span
              :class="['topic-status', getTopicProgress(topic) === 100 ? 'done' : '']"
            >
              {{ getTopicProgress(topic) === 100 ? '✓' : '○' }}
            </span>
            <div>
              <h4>{{ topic.title }}</h4>
              <p class="topic-desc-text">{{ topic.description }}</p>
            </div>
          </div>
          <div class="topic-header-right">
            <span class="topic-estimate">{{ topic.estimatedHours }}h</span>
            <span class="topic-arrow">{{ expandedTopics[topic.id] ? '▲' : '▼' }}</span>
          </div>
        </div>

        <div class="topic-progress-mini-bar">
          <div class="progress-bar">
            <div
              :class="['progress-bar-fill', getTopicProgress(topic) === 100 ? 'success' : '']"
              :style="{ width: getTopicProgress(topic) + '%' }"
            ></div>
          </div>
        </div>

        <Transition name="slide">
          <div v-if="expandedTopics[topic.id]" class="topic-body">
            <div
              v-for="kp in topic.knowledgePoints"
              :key="kp.id"
              :class="['kp-item', { completed: progressStore.isKpCompleted(kp.id) }]"
              @click="goToKp(kp.id)"
            >
              <div class="kp-item-left">
                <span :class="['kp-check', { done: progressStore.isKpCompleted(kp.id) }]">
                  {{ progressStore.isKpCompleted(kp.id) ? '✓' : '○' }}
                </span>
                <div>
                  <span class="kp-title">{{ kp.title }}</span>
                  <span class="kp-short">{{ kp.shortDesc }}</span>
                </div>
              </div>
              <div class="kp-item-right">
                <span class="kp-time">{{ kp.estimatedMinutes }} min</span>
                <span class="kp-arrow">→</span>
              </div>
            </div>

            <button
              v-if="getTopicProgress(topic) < 100"
              class="btn btn-outline btn-sm mark-topic-btn"
              @click.stop="markTopicComplete(topic)"
            >
              标记本主题全部完成
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </div>

  <div v-else class="card empty-state">
    <h3>阶段未找到</h3>
    <p>请从 <router-link to="/roadmap">学习路线</router-link> 选择阶段。</p>
  </div>
</template>

<style scoped>
.phase-detail {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.phase-header {
  margin-bottom: 24px;
}

.phase-nav {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.phase-header-main {
  text-align: center;
  margin-bottom: 20px;
}

.phase-header-main h2 {
  font-size: 28px;
  margin: 8px 0;
}

.phase-subtitle-text {
  color: var(--text-secondary);
  font-size: 15px;
}

.phase-header-meta {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 16px;
}

.meta-item {
  text-align: center;
}

.meta-value {
  display: block;
  font-size: 22px;
  font-weight: 700;
  color: var(--color-primary);
}

.meta-label {
  font-size: 12px;
  color: var(--text-muted);
}

.phase-goal-box {
  margin-top: 16px;
  padding: 16px;
  background: #F0F9FF;
  border-radius: var(--border-radius);
}

.phase-goal-box h4 {
  font-size: 13px;
  color: var(--color-primary);
  margin-bottom: 4px;
}

.phase-goal-box p {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.topics-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.topic-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.topic-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.topic-status {
  font-size: 20px;
  color: var(--text-muted);
  transition: color var(--transition);
}

.topic-status.done {
  color: var(--color-success);
}

.topic-header-left h4 {
  font-size: 16px;
}

.topic-desc-text {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 2px;
}

.topic-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.topic-estimate {
  font-size: 12px;
  color: var(--text-muted);
}

.topic-arrow {
  font-size: 12px;
  color: var(--text-muted);
}

.topic-progress-mini-bar {
  margin-top: 10px;
}

.topic-body {
  margin-top: 16px;
  border-top: 1px solid var(--border-color);
  padding-top: 12px;
}

.kp-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 8px;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: background var(--transition);
}

.kp-item:hover {
  background: #F8FAFC;
}

.kp-item.completed {
  background: #F0FDF4;
}

.kp-item-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1;
}

.kp-check {
  font-size: 16px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.kp-check.done {
  color: var(--color-success);
}

.kp-title {
  display: block;
  font-weight: 500;
  font-size: 14px;
}

.kp-short {
  display: block;
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
}

.kp-item-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.kp-time {
  font-size: 12px;
  color: var(--text-muted);
}

.kp-arrow {
  color: var(--color-primary);
}

.mark-topic-btn {
  margin-top: 12px;
  width: 100%;
}

.empty-state {
  text-align: center;
  padding: 48px;
}

.empty-state h3 {
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .phase-header-main h2 {
    font-size: 22px;
  }

  .phase-header-meta {
    gap: 16px;
  }

  .meta-value {
    font-size: 18px;
  }
}
</style>
