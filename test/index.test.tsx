import React from 'react'
import { fireEvent, render, renderHook } from '@testing-library/react'
import {
  KeyboardFocusRing,
  KeyboardFocusRingProvider,
  useKeyboardFocusRing,
  useKeyboardFocusRingEnabled,
} from '../src'

describe('keyboard-only-focus-ring', () => {
  describe('useKeyboardFocusRing hook', () => {
    test('defaults state to enabled, sets up the event listeners and relevant CSS classes on body', () => {
      const { result } = renderHook(() => useKeyboardFocusRing())
      expect(result.current).toEqual(true)
      expect(document.styleSheets[0].cssRules[0].cssText).toBe(
        '.js-no-focus-ring * {outline: none;}'
      )
      expect(document.body.className).toBe('js-focus-ring')

      fireEvent.click(document.body)
      expect(result.current).toEqual(false)
      expect(document.body.className).toBe('js-no-focus-ring')

      fireEvent.keyDown(document.body, { key: 'Tab', code: 'Tab' })
      expect(result.current).toEqual(true)
      expect(document.body.className).toBe('js-focus-ring')
    })

    test('allows initializing with disabled', () => {
      const { result } = renderHook(() =>
        useKeyboardFocusRing({ defaultEnabled: false })
      )
      expect(result.current).toEqual(false)
    })

    test('allows a custom stylesheet ID', () => {
      renderHook(() => useKeyboardFocusRing({ stylesheetId: 'customId' }))
      const customStyleElement = document.getElementById('customId')
      expect(customStyleElement).toBeTruthy()
      expect(customStyleElement?.tagName).toBe('STYLE')
    })
  })

  describe('KeyboardFocusRing component', () => {
    test('allows children as a function', async () => {
      const renderFunction = jest.fn(() => null)
      render(<KeyboardFocusRing>{renderFunction}</KeyboardFocusRing>)

      expect(renderFunction).toHaveBeenCalledWith({ enabled: true })
    })

    test('allows children as a React Node', async () => {
      const fn = jest.fn()
      const Child = (...args: any[]) => {
        fn(args)
        return null
      }

      render(
        <KeyboardFocusRing>
          <Child normal="prop" />
        </KeyboardFocusRing>
      )

      expect(fn).toHaveBeenCalledWith([
        { isKeyboardFocusRingEnabled: true, normal: 'prop' },
        {},
      ])
    })
  })

  describe('KeyboardFocusRingProvider component', () => {
    test('sets up the event listeners and relevant CSS classes on body', () => {
      render(<KeyboardFocusRingProvider />)
      expect(document.styleSheets[0].cssRules[0].cssText).toBe(
        '.js-no-focus-ring * {outline: none;}'
      )
      expect(document.body.className).toBe('js-focus-ring')

      fireEvent.click(document.body)
      expect(document.body.className).toBe('js-no-focus-ring')

      fireEvent.keyDown(document.body, { key: 'Tab', code: 'Tab' })
      expect(document.body.className).toBe('js-focus-ring')
    })
  })

  describe('useKeyboardFocusRingEnabled hook', () => {
    test('should return enabled state from context', () => {
      const fn = jest.fn()
      const TestComponent = () => {
        const enabled = useKeyboardFocusRingEnabled()
        fn(enabled)
        return null
      }
      render(
        <KeyboardFocusRingProvider defaultEnabled={false}>
          <TestComponent />
        </KeyboardFocusRingProvider>
      )
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenCalledWith(false)

      // Already false, click should do nothing
      fireEvent.click(document.body)
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn).toHaveBeenNthCalledWith(1, false)

      fireEvent.keyDown(document.body, { key: 'Tab', code: 'Tab' })
      expect(fn).toHaveBeenCalledTimes(2)
      expect(fn).toHaveBeenNthCalledWith(2, true)

      fireEvent.click(document.body)
      expect(fn).toHaveBeenCalledTimes(3)
      expect(fn).toHaveBeenNthCalledWith(3, false)
    })
  })
})
