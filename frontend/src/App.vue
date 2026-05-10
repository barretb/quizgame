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
        <a
          href="https://github.com/barretb/quizgame"
          target="_blank"
          rel="noopener noreferrer"
          class="github-link"
          aria-label="View source on GitHub"
        >
          <svg class="github-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
          </svg>
          <span class="github-label">GitHub</span>
        </a>
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

.github-link {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  text-decoration: none;
  color: var(--color-text-muted, #888);
  font-size: 0.875rem;
  transition: color 0.15s ease;
}

.github-link:hover {
  color: var(--color-text);
}

.github-icon {
  width: 1.125rem;
  height: 1.125rem;
  flex-shrink: 0;
}

.github-label {
  font-weight: 500;
  letter-spacing: 0.01em;
}
</style>
