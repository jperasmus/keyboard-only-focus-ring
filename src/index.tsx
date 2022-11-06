import * as React from 'react'
import { STYLESHEET_ID } from './constants'
import { useInteractions } from './interactions'
import { useStylesheet } from './stylesheet'

export type UseKeyboardFocusRingProps = {
  defaultEnabled?: boolean
  stylesheetId?: string
}

export const useKeyboardFocusRing = ({
  defaultEnabled = true,
  stylesheetId = STYLESHEET_ID,
}: UseKeyboardFocusRingProps = {}) => {
  const { enabled } = useInteractions({ defaultEnabled })

  useStylesheet({ enabled, stylesheetId })

  return enabled
}

export type KeyboardFocusRingProps = UseKeyboardFocusRingProps & {
  children?:
    | React.ReactNode
    | ((props: { enabled: boolean }) => React.ReactNode)
}

export const KeyboardFocusRing = ({
  children = null,
  ...props
}: KeyboardFocusRingProps) => {
  const enabled = useKeyboardFocusRing(props)

  const node =
    typeof children === 'function'
      ? children({ enabled })
      : React.isValidElement(children)
      ? React.cloneElement(children as React.ReactElement, {
          isKeyboardFocusRingEnabled: enabled,
        })
      : children

  return <>{node}</>
}

export type KeyboardFocusRingProviderProps = React.PropsWithChildren<
  UseKeyboardFocusRingProps
>

export const KeyboardFocusRingContext = React.createContext(true)

export const useKeyboardFocusRingEnabled = () =>
  React.useContext(KeyboardFocusRingContext)

export const KeyboardFocusRingProvider = ({
  children,
  defaultEnabled,
  stylesheetId,
}: KeyboardFocusRingProviderProps) => {
  const enabled = useKeyboardFocusRing({ defaultEnabled, stylesheetId })

  return (
    <KeyboardFocusRingContext.Provider value={enabled}>
      {children}
    </KeyboardFocusRingContext.Provider>
  )
}
