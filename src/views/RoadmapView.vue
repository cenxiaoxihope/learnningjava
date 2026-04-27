<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProgressStore } from '../stores/progress'
import { phases } from '../data/phases'

const router = useRouter()
const progressStore = useProgressStore()

const expandedPhases = ref({})

function toggleExpand(phaseId) {
  expandedPhases.value[phaseId] = !expandedPhases.value[phaseId]
}

function goToPhase(phaseId) {
  router.push(`/phase/${phaseId}`)
}

function goToKp(kpId) {
  router.push(`/knowledge/${kpId}`)
}

function getPhaseProgress(phase) {
  return progressStore.getPhaseProgress(phase.id, phase.topics.map(t => t.id))
}

function getTopicProgress(topic) {
  const total = topic.knowledgePoints.length
  const done = topic.knowledgePoints.filter(kp => progressStore.isKpCompleted(kp.id)).length
  return total === 0 ? 0 : Math.round((done / total) * 100)
}

const totalProgress = computed(() => progressStore.totalProgress)
</script>

<template>
  <div class="roadmap">
    <h2 class="section-title">学习路线图</h2>
    <p class="section-subtitle">12 个阶段，约 31 周，从 Java 基础到 AI 全栈</p>

    <!-- 总体进度 -->
    <div class="overall-progress card">
      <div class="overall-info">
        <span>总进度</span>
        <span class="overall-percent">{{ totalProgress }}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-bar-fill" :style="{ width: totalProgress + '%' }"></div>
      </div>
    </div>

    <!-- 时间线 -->
    <div class="timeline">
      <div
        v-for="phase in phases"
        :key="phase.id"
        class="timeline-item"
      >
        <!-- 时间线节点 -->
        <div class="timeline-node">
          <div
            :class="[
              'node-circle',
              getPhaseProgress(phase) === 100 ? 'completed' : '',
              expandedPhases[phase.id] ? 'expanded' : ''
            ]"
          >
            <span v-if="getPhaseProgress(phase) === 100">✓</span>
            <span v-else>{{ phase.order }}</span>
          </div>
          <div class="node-line"></div>
        </div>

        <!-- 阶段卡片 -->
        <div class="timeline-content">
          <div class="card phase-card-item" @click="goToPhase(phase.id)">
            <div class="phase-card-top">
              <span class="badge badge-primary">Phase {{ phase.order }}</span>
              <span class="phase-duration">{{ phase.estimatedWeeks }} 周</span>
            </div>
            <h3>{{ phase.title }}</h3>
            <p class="phase-subtitle-text">{{ phase.subtitle }}</p>
            <p class="phase-goal-text">{{ phase.goal }}</p>

            <div class="progress-bar" style="margin: 12px 0 6px;">
              <div
                :class="['progress-bar-fill', getPhaseProgress(phase) === 100 ? 'success' : '']"
                :style="{ width: getPhaseProgress(phase) + '%' }"
              ></div>
            </div>
            <div class="phase-meta">
              <span>{{ getPhaseProgress(phase) }}% 完成</span>
              <span>{{ phase.topics.length }} 个主题</span>
            </div>
          </div>

          <!-- 展开查看主题 -->
          <button class="expand-toggle" @click.stop="toggleExpand(phase.id)">
            {{ expandedPhases[phase.id] ? '收起主题 ▲' : '展开主题 ▼' }}
          </button>

          <Transition name="slide">
            <div v-if="expandedPhases[phase.id]" class="topics-panel">
              <div
                v-for="topic in phase.topics"
                :key="topic.id"
                class="topic-row card"
              >
                <div class="topic-info">
                  <h4 class="topic-name">{{ topic.title }}</h4>
                  <p class="topic-desc">{{ topic.description }}</p>
                  <div class="topic-kps">
                    <span
                      v-for="kp in topic.knowledgePoints"
                      :key="kp.id"
                      :class="['kp-tag', { done: progressStore.isKpCompleted(kp.id) }]"
                      @click.stop="goToKp(kp.id)"
                    >
                      {{ kp.title }}
                    </span>
                  </div>
                </div>
                <div class="topic-progress-mini">
                  <span class="topic-pct">{{ getTopicProgress(topic) }}%</span>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.roadmap {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.overall-progress {
  margin-bottom: 32px;
}

.overall-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--text-secondary);
}

.overall-percent {
  font-weight: 700;
  color: var(--color-primary);
}

.timeline {
  position: relative;
}

.timeline-item {
  display: flex;
  gap: 20px;
}

.timeline-item:last-child .node-line {
  display: none;
}

.timeline-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 40px;
}

.node-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--border-color);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  transition: all var(--transition);
  flex-shrink: 0;
}

.node-circle.completed {
  background: var(--color-success);
  color: #fff;
}

.node-circle.expanded {
  background: var(--color-primary);
  color: #fff;
}

.node-line {
  width: 2px;
  flex: 1;
  background: var(--border-color);
  min-height: 24px;
}

.timeline-content {
  flex: 1;
  padding-bottom: 24px;
  min-width: 0;
}

.phase-card-item {
  cursor: pointer;
}

.phase-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.phase-duration {
  font-size: 12px;
  color: var(--text-muted);
}

.phase-card-item h3 {
  font-size: 18px;
  margin-bottom: 4px;
}

.phase-subtitle-text {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.phase-goal-text {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.phase-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-muted);
}

.expand-toggle {
  margin-top: 8px;
  padding: 4px 12px;
  border: none;
  background: transparent;
  color: var(--color-primary);
  font-size: 13px;
  cursor: pointer;
  transition: color var(--transition);
}

.expand-toggle:hover {
  color: var(--color-primary-dark);
}

.topics-panel {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.topic-row {
  padding: 16px;
}

.topic-name {
  font-size: 15px;
  margin-bottom: 4px;
}

.topic-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.topic-kps {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.kp-tag {
  padding: 3px 10px;
  border-radius: 999px;
  background: #F1F5F9;
  color: var(--text-secondary);
  font-size: 12px;
  cursor: pointer;
  transition: all var(--transition);
}

.kp-tag:hover {
  background: #DBEAFE;
  color: var(--color-primary);
}

.kp-tag.done {
  background: var(--color-success-light);
  color: #065F46;
}

.topic-progress-mini {
  margin-top: 8px;
  text-align: right;
}

.topic-pct {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .timeline-item {
    gap: 12px;
  }

  .timeline-node {
    width: 28px;
  }

  .node-circle {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }
}
</style>
