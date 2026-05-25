export function setupSecurity(toastCallback: (msg: string) => void) {
  let devToolsOpen = false;

  const threshold = 160;

  function detectDevTools() {
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    return widthThreshold || heightThreshold;
  }

  function checkDevTools() {
    const detected = detectDevTools();
    if (detected && !devToolsOpen) {
      devToolsOpen = true;
      document.dispatchEvent(new CustomEvent('devtools:open'));
    } else if (!detected && devToolsOpen) {
      devToolsOpen = false;
      document.dispatchEvent(new CustomEvent('devtools:close'));
    }
  }

  const interval = setInterval(checkDevTools, 1000);

  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    toastCallback('toast.rightclick');
  });

  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
      (e.ctrlKey && e.key.toUpperCase() === 'U')
    ) {
      e.preventDefault();
      document.dispatchEvent(new CustomEvent('devtools:open'));
    }
  });

  document.addEventListener('selectstart', (e) => e.preventDefault());
  document.addEventListener('dragstart', (e) => e.preventDefault());

  return () => {
    clearInterval(interval);
    document.removeEventListener('contextmenu', () => {});
    document.removeEventListener('keydown', () => {});
    document.removeEventListener('selectstart', () => {});
    document.removeEventListener('dragstart', () => {});
  };
}
