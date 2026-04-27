<script setup>
import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <div class="app-container">
    <AppHeader />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
}

.main-content {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 24px 20px 48px;
}
</style>
