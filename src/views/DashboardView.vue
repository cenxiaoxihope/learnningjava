<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProgressStore } from '../stores/progress'
import { phases } from '../data/phases'

const router = useRouter()
const progressStore = useProgressStore()

const totalKps = computed(() => {
  let count = 0
  phases.forEach(p => p.topics.forEach(t => count += t.knowledgePoints.length))
  return count
})

const completedCount = computed(() => progressStore.completedKpCount)

const progress = computed(() => {
  if (totalKps.value === 0) return 0
  return Math.round((completedCount.value / totalKps.value) * 100)
})

const currentPhase = computed(() => {
  return phases.find(p => progressStore.getPhaseProgress(p.id, p.topics.map(t => t.id)) < 100) || phases[0]
})

const currentPhaseProgress = computed(() => {
  const p = currentPhase.value
  return progressStore.getPhaseProgress(p.id, p.topics.map(t => t.id))
})

const todayTasks = computed(() => {
  const todayDone = new Set(progressStore.getTodayLog())
  const tasks = []
  for (const phase of phases) {
    for (const topic of phase.topics) {
      for (const kp of topic.knowledgePoints) {
        if (!todayDone.has(kp.id) && !progressStore.isKpCompleted(kp.id)) {
          tasks.push({ ...kp, phaseId: phase.id, phaseTitle: phase.title, topicTitle: topic.title })
          if (tasks.length >= 5) return tasks
        }
      }
    }
  }
  return tasks
})

const stats = computed(() => {
  let totalMinutes = 0
  let completedTopics = 0
  let totalTopics = 0
  phases.forEach(p => {
    p.topics.forEach(t => {
      totalTopics++
      if (progressStore.isTopicCompleted(t.id)) completedTopics++
      t.knowledgePoints.forEach(kp => {
        totalMinutes += kp.estimatedMinutes
      })
    })
  })
  return {
    totalHours: Math.round(totalMinutes / 60),
    completedTopics,
    totalTopics,
    streak: Object.keys(progressStore.learningLog).length
  }
})

function goToPhase(phaseId) {
  router.push(`/phase/${phaseId}`)
}

function goToKp(kpId) {
  router.push(`/knowledge/${kpId}`)
}

function goToRoadmap() {
  router.push('/roadmap')
}

const radius = 80
const circumference = 2 * Math.PI * radius
const dashOffset = computed(() => circumference - (progress.value / 100) * circumference)
</script>

<template>
  <div class="dashboard">
    <h2 class="section-title">学习仪表盘</h2>
    <p class="section-subtitle">追踪你的 Java → AI 全栈学习进度</p>

    <div class="dashboard-grid">
      <!-- 进度环 -->
      <div class="card progress-card">
        <h3>总体进度</h3>
        <div class="progress-ring-container">
          <svg class="progress-ring" viewBox="0 0 200 200">
            <circle class="ring-bg" :r="radius" cx="100" cy="100" />
            <circle
              class="ring-fill"
              :r="radius"
              cx="100"
              cy="100"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="dashOffset"
            />
          </svg>
          <div class="ring-text">
            <span class="ring-percent">{{ progress }}%</span>
            <span class="ring-detail">{{ completedCount }}/{{ totalKps }} 知识点</span>
          </div>
        </div>
      </div>

      <!-- 当前阶段 -->
      <div class="card phase-card" @click="goToPhase(currentPhase.id)">
        <div class="phase-card-header">
          <span class="badge badge-primary">Phase {{ currentPhase.order }}</span>
          <span class="phase-weeks">预计 {{ currentPhase.estimatedWeeks }} 周</span>
        </div>
        <h3>{{ currentPhase.title }}</h3>
        <p class="phase-goal">{{ currentPhase.goal }}</p>
        <div class="progress-bar" style="margin-top: 12px;">
          <div class="progress-bar-fill" :style="{ width: currentPhaseProgress + '%' }"></div>
        </div>
        <span class="phase-progress-text">{{ currentPhaseProgress }}% 完成</span>
      </div>

      <!-- 快速统计 -->
      <div class="card stats-card">
        <h3>学习统计</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-value">{{ stats.totalHours }}</span>
            <span class="stat-label">总学时(h)</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ stats.completedTopics }}/{{ stats.totalTopics }}</span>
            <span class="stat-label">已完成主题</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ stats.streak }}</span>
            <span class="stat-label">学习天数</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 今日推荐 -->
    <div class="today-section">
      <h3 class="section-title" style="font-size: 18px;">今日推荐学习</h3>
      <div class="today-list">
        <div
          v-for="task in todayTasks"
          :key="task.id"
          class="card today-item"
          @click="goToKp(task.id)"
        >
          <div class="today-item-left">
            <span class="badge badge-warning">{{ task.phaseTitle }}</span>
            <span class="today-title">{{ task.title }}</span>
            <span class="today-desc">{{ task.shortDesc }}</span>
          </div>
          <div class="today-item-right">
            <span class="today-time">{{ task.estimatedMinutes }} min</span>
            <span class="today-arrow">→</span>
          </div>
        </div>
        <div v-if="todayTasks.length === 0" class="card empty-state">
          <p>🎉 今天的任务都已完成！去 <a href="#" @click.prevent="goToRoadmap">学习路线</a> 继续学习吧。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 20px;
  margin-bottom: 32px;
}

.progress-card {
  text-align: center;
}

.progress-card h3 {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.progress-ring-container {
  position: relative;
  width: 160px;
  height: 160px;
  margin: 0 auto;
}

.progress-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-bg {
  fill: none;
  stroke: var(--border-color);
  stroke-width: 12;
}

.ring-fill {
  fill: none;
  stroke: var(--color-primary);
  stroke-width: 12;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.6s ease;
}

.ring-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.ring-percent {
  display: block;
  font-size: 32px;
  font-weight: 700;
  color: var(--color-primary);
}

.ring-detail {
  font-size: 12px;
  color: var(--text-muted);
}

.phase-card {
  cursor: pointer;
}

.phase-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.phase-weeks {
  font-size: 12px;
  color: var(--text-muted);
}

.phase-card h3 {
  font-size: 20px;
  margin-bottom: 8px;
}

.phase-goal {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.phase-progress-text {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: var(--text-muted);
}

.stats-card h3 {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 12px;
  color: var(--text-muted);
}

.today-section {
  margin-top: 8px;
}

.today-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
}

.today-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.today-item-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.today-title {
  font-weight: 600;
  font-size: 15px;
  white-space: nowrap;
}

.today-desc {
  color: var(--text-muted);
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.today-item-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.today-time {
  font-size: 12px;
  color: var(--text-muted);
}

.today-arrow {
  color: var(--color-primary);
  font-size: 18px;
}

.empty-state {
  text-align: center;
  padding: 32px;
  color: var(--text-secondary);
}

@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .progress-ring-container {
    width: 120px;
    height: 120px;
  }

  .ring-percent {
    font-size: 24px;
  }
}
</style>
