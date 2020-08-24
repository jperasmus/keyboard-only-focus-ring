import * as React from 'react';

const STYLESHEET_ID = '__keyboardOnlyFocusRing__';

// This doesn't work in IE, but user can polyfill if needed
const addCSSRule = (sheet: CSSStyleSheet, rule: string, index = 0) => {
  if ('insertRule' in sheet) {
    sheet.insertRule(rule, index);
  }
};

const createStylesheet = ({
  id = STYLESHEET_ID,
}: {
  id?: string;
}): CSSStyleSheet | null => {
  const style = document.createElement('style');

  style.setAttribute('media', 'screen');
  style.setAttribute('id', id);

  // WebKit hack :(
  style.appendChild(document.createTextNode(''));

  document.head.appendChild(style);

  return style.sheet;
};

const removeStylesheet = ({ id = STYLESHEET_ID }: { id?: string }): void => {
  const sheet = document.getElementById(id);
  sheet?.parentNode?.removeChild(sheet);
};

export type KeyboardFocusRingProps = {
  defaultEnabled?: boolean;
  stylesheetId?: string;
};

export const useKeyboardFocusRing = ({
  defaultEnabled = true,
  stylesheetId = STYLESHEET_ID,
}: KeyboardFocusRingProps = {}) => {
  const [enabled, setEnabled] = React.useState(defaultEnabled);

  React.useEffect(() => {
    const sheet = createStylesheet({ id: stylesheetId });

    if (sheet) {
      addCSSRule(sheet, `.js-no-focus-ring * { outline: none; }`);
    }

    return () => {
      removeStylesheet({ id: stylesheetId });
    };
  }, [stylesheetId]);

  const handleTabKey = React.useCallback((event: KeyboardEvent) => {
    if (event.code === 'Tab' || event.key === 'Tab') {
      setEnabled(true);
    }
  }, []);

  const handleMouseClick = React.useCallback((_: MouseEvent) => {
    setEnabled(false);
  }, []);

  React.useEffect(() => {
    if (enabled) {
      document.addEventListener('click', handleMouseClick);
      document.addEventListener('dblclick', handleMouseClick);
      document.addEventListener('auxclick', handleMouseClick);
      document.addEventListener('contextmenu', handleMouseClick);
    } else {
      document.addEventListener('keydown', handleTabKey);
    }

    return () => {
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('click', handleMouseClick);
      document.removeEventListener('dblclick', handleMouseClick);
      document.removeEventListener('auxclick', handleMouseClick);
      document.removeEventListener('contextmenu', handleMouseClick);
    };
  }, [enabled, handleTabKey, handleMouseClick]);

  React.useEffect(() => {
    const bodies = document.getElementsByTagName('body');
    const body = bodies[0];

    if (body) {
      body.classList.add(enabled ? 'js-focus-ring' : 'js-no-focus-ring');
    }

    return () => {
      body.classList.remove('js-no-focus-ring', 'js-focus-ring');
    };
  }, [enabled]);

  return enabled;
};

export const KeyboardFocusRing: React.FC<KeyboardFocusRingProps> = ({
  children,
  ...props
}) => {
  const enabled = useKeyboardFocusRing(props);

  return typeof children === 'function'
    ? children({ enabled })
    : React.isValidElement(children)
    ? React.cloneElement(children, { isKeyboardFocusRingEnabled: enabled })
    : children;
};
