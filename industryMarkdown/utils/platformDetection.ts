/**
 * Platform detection utilities for handling web vs React Native environments
 */

/**
 * Detects if the code is running in a React Native environment
 */
export function isReactNative(): boolean {
  return typeof navigator !== 'undefined' && navigator.product === 'ReactNative';
}

/**
 * Detects if the code is running in a web browser environment
 */
export function isWeb(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined' && !isReactNative();
}

/**
 * Checks if DOM-dependent features are available
 */
export function hasDOMSupport(): boolean {
  return isWeb();
}

/**
 * Checks if ReactDOM features like portals are available
 */
export function hasReactDOMSupport(): boolean {
  if (!isWeb()) return false;

  try {
    // Try to import ReactDOM to check if it's available
    // This is a runtime check that won't fail in React Native
    return typeof document !== 'undefined' && typeof document.body !== 'undefined';
  } catch {
    return false;
  }
}
