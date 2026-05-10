import { describe, it, expect } from 'vitest'
// TODO: import { mount } from '@vue/test-utils'
// TODO: import AnswerOption from '../components/AnswerOption.vue'

/**
 * Unit tests for the AnswerOption component.
 *
 * AnswerOption state machine (per design decision):
 *   default → selected → correct | incorrect
 *   All options become non-interactive after any submission.
 *
 * Props (expected interface):
 *   - text: string           — option display text
 *   - index: number          — option index (0–3)
 *   - state: 'default' | 'selected' | 'correct' | 'incorrect'
 *   - disabled: boolean      — true after any answer submitted
 *
 * Events:
 *   - @select(index: number) — emitted when user clicks an enabled option
 *
 * All tests are stubs — implement once the component exists.
 */

describe('AnswerOption', () => {
  // -------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------

  it('renders_default_state: shows option text without feedback styling', () => {
    // TODO: implement when scaffold is available
    // const wrapper = mount(AnswerOption, {
    //   props: { text: 'Option A', index: 0, state: 'default', disabled: false }
    // })
    // expect(wrapper.text()).toContain('Option A')
    // expect(wrapper.classes()).not.toContain('correct')
    // expect(wrapper.classes()).not.toContain('incorrect')
    // expect(wrapper.find('button').element.disabled).toBe(false)
    expect(true).toBe(false) // Not implemented
  })

  // -------------------------------------------------------------------------
  // Correct answer feedback
  // -------------------------------------------------------------------------

  it('shows_correct_after_selection: applies correct styling when state is correct', () => {
    // TODO: implement when scaffold is available
    // const wrapper = mount(AnswerOption, {
    //   props: { text: 'Option B', index: 1, state: 'correct', disabled: true }
    // })
    // expect(wrapper.classes()).toContain('correct') // or check for green indicator
    // expect(wrapper.find('button').element.disabled).toBe(true)
    expect(true).toBe(false) // Not implemented
  })

  // -------------------------------------------------------------------------
  // Incorrect answer feedback
  // -------------------------------------------------------------------------

  it('shows_incorrect_after_wrong_selection: applies incorrect styling when state is incorrect', () => {
    // TODO: implement when scaffold is available
    // const wrapper = mount(AnswerOption, {
    //   props: { text: 'Option C', index: 2, state: 'incorrect', disabled: true }
    // })
    // expect(wrapper.classes()).toContain('incorrect') // or check for red indicator
    // expect(wrapper.find('button').element.disabled).toBe(true)
    expect(true).toBe(false) // Not implemented
  })

  // -------------------------------------------------------------------------
  // Disabled state (after any answer submitted)
  // -------------------------------------------------------------------------

  it('disables_after_selection: button is non-interactive when disabled prop is true', () => {
    // TODO: implement when scaffold is available
    // const wrapper = mount(AnswerOption, {
    //   props: { text: 'Option D', index: 3, state: 'default', disabled: true }
    // })
    // await wrapper.find('button').trigger('click')
    // expect(wrapper.emitted('select')).toBeFalsy() // no event emitted when disabled
    expect(true).toBe(false) // Not implemented
  })

  it('emits select event when clicked in default state', () => {
    // TODO: implement when scaffold is available
    // const wrapper = mount(AnswerOption, {
    //   props: { text: 'Option A', index: 0, state: 'default', disabled: false }
    // })
    // await wrapper.find('button').trigger('click')
    // expect(wrapper.emitted('select')).toBeTruthy()
    // expect(wrapper.emitted('select')![0]).toEqual([0])
    expect(true).toBe(false) // Not implemented
  })
})
