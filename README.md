# Keyboard-only Focus-ring React Hook

## Why this library exist

Aesthetically a browser's default focus-ring (i.e. the blue outline) isn't always very pretty and many people do not want to see them. BUT, they are very important for keyboard users and play a crucial role in giving these users valuable feedback to show which element currently has focus.

This library aims to give you best of both worlds. It sets a specific CSS class on the webpage's `body` element to indicate whether a focus-ring should be shown or not, depending on whether the user interacts with the page via keyboard or a pointing device, like a mouse.

Essentially, you can think of it as, if the user <kbd>Tabs</kbd>, the `.js-focus-ring` class is set, and when they click anywhere, the `.js-no-focus-ring` class is set.

The library will by default set `outline: none;` for all elements on the page if the `.js-no-focus-ring` class exists. You can very easily override this for specific elements like form `<input>`s if you want by setting explicit focus states for these elements.

For instance:

```css
input:focus {
  outline: 2px solid blue;
}
```

## Installation

Install via NPM or Yarn

```bash
npm install keyboard-only-focus-ring
```

## Usage

Once you've installed the library, you can use it either as a React.js hook or component. Both options take the same **optional** props.

> It is recommended to use this component as close to your top-most React component (like your `App` component) and to use it only once.

### useKeyboardFocusRing hook

```typescript
import { useKeyboardFocusRing } from 'keyboard-only-focus-ring';

const App = () => {
  // Example shows default values for all props
  const enabled = useKeyboardFocusRing({
    defaultEnabled: true,
    stylesheetId: '__keyboardOnlyFocusRing__',
  });

  return <div>Focus ring enabled? {enabled ? 'Yes' : 'No'}</div>;
};
```

### KeyboardFocusRing component

```typescript
import { KeyboardFocusRing } from 'keyboard-only-focus-ring'

const App = () => {
  return (
    <KeyboardFocusRing defaultEnabled={true} stylesheetId="__keyboardOnlyFocusRing__">
      {({ enabled }) => (
        Focus ring enabled? {enabled ? 'Yes' : 'No'}
      )}
    </KeyboardFocusRing>
  );
}
```

## License

MIT
