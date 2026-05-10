<script setup lang="ts">
type AnswerState = 'default' | 'selected' | 'correct' | 'incorrect'

const props = defineProps<{
  label: string
  text: string
  state: AnswerState
  disabled: boolean
}>()

const emit = defineEmits<{
  select: []
}>()

function handleClick() {
  if (!props.disabled && props.state === 'default') {
    emit('select')
  }
}
</script>

<template>
  <button
    class="answer-option"
    :class="[`state-${state}`]"
    :disabled="disabled"
    @click="handleClick"
  >
    <span class="option-label">{{ label }}</span>
    <span class="option-text">{{ text }}</span>
    <span class="option-icon" aria-hidden="true">
      <template v-if="state === 'correct'">✓</template>
      <template v-else-if="state === 'incorrect'">✗</template>
    </span>
  </button>
</template>

<style scoped>
.answer-option {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-2);
  color: var(--color-text);
  font-size: 1rem;
  text-align: left;
  transition: border-color var(--transition), background var(--transition), transform var(--transition);
  cursor: pointer;
}

.answer-option:not(:disabled):hover {
  border-color: var(--color-primary);
  background: rgba(108, 99, 255, 0.08);
  transform: translateX(4px);
}

.answer-option:disabled {
  cursor: not-allowed;
}

.answer-option.state-correct {
  border-color: var(--color-success);
  background: rgba(67, 217, 143, 0.12);
  color: var(--color-success);
}

.answer-option.state-incorrect {
  border-color: var(--color-error);
  background: rgba(255, 92, 108, 0.12);
  color: var(--color-error);
}

.answer-option.state-selected {
  border-color: var(--color-primary);
  background: rgba(108, 99, 255, 0.12);
}

.option-label {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid currentColor;
  font-size: 0.8rem;
  font-weight: 700;
  flex-shrink: 0;
  opacity: 0.7;
}

.state-correct .option-label,
.state-incorrect .option-label {
  opacity: 1;
}

.option-text {
  flex: 1;
  line-height: 1.4;
}

.option-icon {
  font-size: 1.1rem;
  font-weight: 700;
  flex-shrink: 0;
  min-width: 1.25rem;
  text-align: center;
}
</style>
