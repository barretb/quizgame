<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
</script>

<template>
  <div class="app">
    <header class="app-header">
      <div class="header-inner">
        <RouterLink to="/" class="brand">
          <span class="brand-icon">🧠</span>
          <span class="brand-name">Barret's Quiz Game</span>
        </RouterLink>
        <nav class="external-links" aria-label="External links">
          <a
            href="https://barretblake.dev"
            target="_blank"
            rel="noopener noreferrer"
            class="external-link"
            aria-label="Visit Barret Blake's developer blog"
          >
            Blog
          </a>
          <a
            href="https://github.com/barretb/quizgame"
            target="_blank"
            rel="noopener noreferrer"
            class="external-link"
            aria-label="View source on GitHub"
          >
            Repo
          </a>
        </nav>
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

.external-links {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.external-link {
  text-decoration: none;
  color: var(--color-text-muted, #888);
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  padding: 0.35rem 0.6rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  transition: color 0.15s ease, border-color 0.15s ease, background-color 0.15s ease;
}

.external-link:hover {
  color: var(--color-text);
  border-color: var(--color-primary);
  background: rgba(108, 99, 255, 0.08);
}

@media (max-width: 640px) {
  .header-inner {
    height: auto;
    min-height: 64px;
    padding: 0.625rem 0;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .external-links {
    margin-left: 0;
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
