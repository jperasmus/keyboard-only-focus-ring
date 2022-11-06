import * as React from 'react'
import {
  FOCUS_RING_DISABLED_CLASS_NAME,
  FOCUS_RING_ENABLED_CLASS_NAME,
} from './constants'

// This doesn't work in IE, but user can polyfill if needed
const addCSSRule = (sheet: CSSStyleSheet, rule: string, index = 0) => {
  if ('insertRule' in sheet) {
    sheet.insertRule(rule, index)
  }
}

const createStylesheet = ({ id }: { id: string }): CSSStyleSheet | null => {
  const style = document.createElement('style')

  style.setAttribute('media', 'screen')
  style.setAttribute('id', id)

  // WebKit hack :(
  style.appendChild(document.createTextNode(''))

  document.head.appendChild(style)

  return style.sheet
}

const removeStylesheet = ({ id }: { id: string }): void => {
  const sheet = document.getElementById(id)
  sheet?.parentNode?.removeChild(sheet)
}

export type UseStylesheetProps = {
  enabled: boolean
  stylesheetId: string
}

export function useStylesheet({ enabled, stylesheetId }: UseStylesheetProps) {
  React.useEffect(() => {
    const sheet = createStylesheet({ id: stylesheetId })

    if (sheet) {
      addCSSRule(
        sheet,
        `.${FOCUS_RING_DISABLED_CLASS_NAME} * { outline: none; }`
      )
    }

    return () => {
      removeStylesheet({ id: stylesheetId })
    }
  }, [stylesheetId])

  React.useEffect(() => {
    const bodyTags = document.getElementsByTagName('body')
    const body = bodyTags[0]

    if (body) {
      body.classList.add(
        enabled ? FOCUS_RING_ENABLED_CLASS_NAME : FOCUS_RING_DISABLED_CLASS_NAME
      )
    }

    return () => {
      body.classList.remove(
        FOCUS_RING_DISABLED_CLASS_NAME,
        FOCUS_RING_ENABLED_CLASS_NAME
      )
    }
  }, [enabled])
}
