// ═══════════════════════════════════════════════════════════════
// Utility: Conditional Class Name Joiner
// ═══════════════════════════════════════════════════════════════

export function cn(...args) {
  return args
    .flat()
    .filter((x) => typeof x === 'string' && x.trim() !== '')
    .join(' ');
}
