<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  shareText: string
}>()

const emit = defineEmits<{ close: [] }>()

const appUrl = import.meta.env.VITE_APP_URL || window.location.origin

const fullShareText = computed(() => `${props.shareText}\nPlay at: ${appUrl}`)

const blueskyUrl = computed(() => {
  return `https://bsky.app/intent/compose?text=${encodeURIComponent(fullShareText.value)}`
})

const mastodonUrl = computed(() => {
  return `https://mastodon.social/share?text=${encodeURIComponent(fullShareText.value)}`
})

async function shareNative() {
  if (navigator.share) {
    try {
      await navigator.share({ title: "Barret's Quiz Game", text: fullShareText.value, url: appUrl })
    } catch {
      // user cancelled — no-op
    }
  }
}

const canNativeShare = typeof navigator !== 'undefined' && !!navigator.share
</script>

<template>
  <Teleport to="body">
    <div class="modal-backdrop" @click.self="emit('close')">
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="share-title">
        <button class="modal-close" @click="emit('close')" aria-label="Close">✕</button>
        <h2 id="share-title" class="modal-title">Share Your Score 🎉</h2>
        <p class="share-preview">{{ fullShareText }}</p>
        <div class="share-actions">
          <button v-if="canNativeShare" class="share-btn native" @click="shareNative">
            <span>📤</span> Share
          </button>
          <a :href="blueskyUrl" target="_blank" rel="noopener" class="share-btn bluesky">
            <span>🦋</span> Post on Bluesky
          </a>
          <a :href="mastodonUrl" target="_blank" rel="noopener" class="share-btn mastodon">
            <span>🐘</span> Share on Mastodon
          </a>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 500;
  padding: 1rem;
  backdrop-filter: blur(4px);
  animation: fade-in 0.15s ease;
}

@keyframes fade-in {
  from { opacity: 0; }
}

.modal {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 2rem;
  max-width: 480px;
  width: 100%;
  position: relative;
  animation: slide-up 0.2s ease;
}

@keyframes slide-up {
  from { transform: translateY(24px); opacity: 0; }
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: 1rem;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  transition: color var(--transition);
}

.modal-close:hover {
  color: var(--color-text);
}

.modal-title {
  font-size: 1.4rem;
  color: var(--color-text);
  margin-bottom: 1rem;
}

.share-preview {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 0.75rem 1rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.share-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.share-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border-radius: var(--radius-md);
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  border: none;
  transition: opacity var(--transition), transform var(--transition);
  font-family: inherit;
}

.share-btn:hover {
  opacity: 0.85;
  transform: translateY(-1px);
}

.share-btn.native {
  background: var(--color-primary);
  color: #fff;
}

.share-btn.bluesky {
  background: #0085ff;
  color: #fff;
}

.share-btn.mastodon {
  background: #6364ff;
  color: #fff;
}
</style>
