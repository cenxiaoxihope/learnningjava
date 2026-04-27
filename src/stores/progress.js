import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'java-roadmap-progress'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.warn('Failed to load progress from localStorage:', e)
  }
  return null
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.warn('Failed to save progress to localStorage:', e)
  }
}

export const useProgressStore = defineStore('progress', () => {
  const saved = loadFromStorage()

  const completedKps = ref(saved?.completedKps || {})
  const completedTopics = ref(saved?.completedTopics || {})
  const notes = ref(saved?.notes || {})
  const learningLog = ref(saved?.learningLog || {})

  function persist() {
    saveToStorage({
      completedKps: completedKps.value,
      completedTopics: completedTopics.value,
      notes: notes.value,
      learningLog: learningLog.value
    })
  }

  const completedKpCount = computed(() => Object.keys(completedKps.value).length)

  function markKpComplete(kpId) {
    completedKps.value = { ...completedKps.value, [kpId]: true }
    const today = new Date().toISOString().split('T')[0]
    const todayLog = learningLog.value[today] || []
    if (!todayLog.includes(kpId)) {
      learningLog.value = { ...learningLog.value, [today]: [...todayLog, kpId] }
    }
    persist()
  }

  function markKpIncomplete(kpId) {
    const next = { ...completedKps.value }
    delete next[kpId]
    completedKps.value = next
    persist()
  }

  function isKpCompleted(kpId) {
    return !!completedKps.value[kpId]
  }

  function markTopicComplete(topicId) {
    completedTopics.value = { ...completedTopics.value, [topicId]: true }
    persist()
  }

  function isTopicCompleted(topicId) {
    return !!completedTopics.value[topicId]
  }

  function saveNote(kpId, note) {
    notes.value = { ...notes.value, [kpId]: note }
    persist()
  }

  function getNote(kpId) {
    return notes.value[kpId] || ''
  }

  function getPhaseProgress(phaseId, topicIds) {
    if (!topicIds || topicIds.length === 0) return 0
    const completed = topicIds.filter(id => completedTopics.value[id]).length
    return Math.round((completed / topicIds.length) * 100)
  }

  function getTodayLog() {
    const today = new Date().toISOString().split('T')[0]
    return learningLog.value[today] || []
  }

  function resetProgress() {
    completedKps.value = {}
    completedTopics.value = {}
    notes.value = {}
    learningLog.value = {}
    persist()
  }

  return {
    completedKps,
    completedTopics,
    notes,
    learningLog,
    completedKpCount,
    markKpComplete,
    markKpIncomplete,
    isKpCompleted,
    markTopicComplete,
    isTopicCompleted,
    saveNote,
    getNote,
    getPhaseProgress,
    getTodayLog,
    resetProgress
  }
})
