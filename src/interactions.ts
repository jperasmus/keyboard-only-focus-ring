import * as React from 'react'

export type UseInteractionsProps = {
  defaultEnabled: boolean
}

export function useInteractions({ defaultEnabled }: UseInteractionsProps) {
  const [enabled, setEnabled] = React.useState(defaultEnabled)

  const handleKeyPress = React.useCallback((event: KeyboardEvent) => {
    if (event.code === 'Tab' || event.key === 'Tab') {
      setEnabled(true)
    }
  }, [])

  const handleClick = React.useCallback((_: MouseEvent) => {
    setEnabled(false)
  }, [])

  React.useEffect(() => {
    if (enabled) {
      document.addEventListener('click', handleClick)
      document.addEventListener('dblclick', handleClick)
      document.addEventListener('auxclick', handleClick)
      document.addEventListener('contextmenu', handleClick)
    } else {
      document.addEventListener('keydown', handleKeyPress)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress)
      document.removeEventListener('click', handleClick)
      document.removeEventListener('dblclick', handleClick)
      document.removeEventListener('auxclick', handleClick)
      document.removeEventListener('contextmenu', handleClick)
    }
  }, [enabled, handleKeyPress, handleClick])

  return { enabled }
}
