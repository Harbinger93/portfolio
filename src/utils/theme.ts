import { useState, useEffect } from 'react';

type Theme = 'dark' | 'light';

let currentTheme: Theme = 'dark';
const listeners = new Set<(theme: Theme) => void>();

// Initialize theme from localStorage or default to dark
if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem('theme') as Theme;
  if (savedTheme === 'light' || savedTheme === 'dark') {
    currentTheme = savedTheme;
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    currentTheme = 'light';
  }
  
  if (currentTheme === 'light') {
    document.documentElement.classList.add('light');
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(currentTheme);

  useEffect(() => {
    listeners.add(setThemeState);
    return () => {
      listeners.delete(setThemeState);
    };
  }, []);

  const setTheme = (newTheme: Theme) => {
    currentTheme = newTheme;
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
      if (newTheme === 'light') {
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
      }
    }
    listeners.forEach((listener) => listener(newTheme));
  };

  const toggleTheme = () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  return { theme, setTheme, toggleTheme };
}
