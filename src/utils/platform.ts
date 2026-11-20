// Platform detection utilities for Mac OS, iOS, Windows & Linux

export const isMac = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  const platform = navigator.platform || '';
  const ua = navigator.userAgent || '';
  return /Mac|iPhone|iPad|iPod/i.test(platform) || /Macintosh|Mac OS/i.test(ua);
};

export const isIOS = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent || '');
};

export const getModifierKey = (): string => {
  return isMac() ? '⌘' : 'Ctrl';
};

export const isModifierPressed = (e: KeyboardEvent | React.KeyboardEvent): boolean => {
  return isMac() ? e.metaKey : e.ctrlKey;
};
