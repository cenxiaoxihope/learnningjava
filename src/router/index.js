import { createRouter, createWebHashHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import RoadmapView from '../views/RoadmapView.vue'
import PhaseDetailView from '../views/PhaseDetailView.vue'
import KnowledgePointView from '../views/KnowledgePointView.vue'
import ResourcesView from '../views/ResourcesView.vue'

const routes = [
  { path: '/', name: 'dashboard', component: DashboardView },
  { path: '/roadmap', name: 'roadmap', component: RoadmapView },
  { path: '/phase/:phaseId', name: 'phase', component: PhaseDetailView, props: true },
  { path: '/knowledge/:kpId', name: 'knowledge', component: KnowledgePointView, props: true },
  { path: '/resources', name: 'resources', component: ResourcesView }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
