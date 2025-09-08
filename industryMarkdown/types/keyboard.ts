export interface KeyboardModifiers {
  shift?: boolean;
  ctrl?: boolean;
  alt?: boolean;
  meta?: boolean;
}

export type KeyboardAction =
  | 'next'
  | 'prev'
  | 'toggleFullscreen'
  | 'copy'
  | 'custom'
  | 'scrollUp'
  | 'scrollDown'
  | 'pageUp'
  | 'pageDown'
  | 'toggleTableOfContents';

export interface KeyboardBinding {
  key: string;
  modifiers?: KeyboardModifiers;
  action: KeyboardAction;
  customHandler?: (e: KeyboardEvent) => void;
  preventDefault?: boolean;
  stopPropagation?: boolean;
}

// Default keyboard bindings
export const defaultKeyboardBindings: KeyboardBinding[] = [
  { key: ' ', action: 'next', preventDefault: true },
  { key: ' ', modifiers: { shift: true }, action: 'prev', preventDefault: true },
  { key: 'ArrowRight', action: 'next' },
  { key: 'ArrowLeft', action: 'prev' },
  { key: 'f', action: 'toggleFullscreen' },
  { key: 'F', action: 'toggleFullscreen' },
  { key: 't', action: 'toggleTableOfContents', preventDefault: true },
  { key: 'T', action: 'toggleTableOfContents', preventDefault: true },
];

// Default scroll keyboard bindings (can be added to main bindings if desired)
export const defaultScrollKeyboardBindings: KeyboardBinding[] = [
  { key: 'ArrowUp', action: 'scrollUp', preventDefault: true, stopPropagation: true },
  { key: 'ArrowDown', action: 'scrollDown', preventDefault: true, stopPropagation: true },
  { key: 'PageUp', action: 'pageUp', preventDefault: true, stopPropagation: true },
  { key: 'PageDown', action: 'pageDown', preventDefault: true, stopPropagation: true },
];
