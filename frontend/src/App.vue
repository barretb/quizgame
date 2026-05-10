<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div class="app">
    <header class="app-header">
      <div class="header-inner">
        <RouterLink to="/" class="brand">
          <span class="brand-icon">🧠</span>
          <span class="brand-name">QuizGame</span>
        </RouterLink>
      </div>
    </header>
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: 0 1.5rem;
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
}

.header-inner {
  max-width: 1100px;
  margin: 0 auto;
  height: 64px;
  display: flex;
  align-items: center;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.brand-icon {
  font-size: 1.75rem;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.02em;
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
