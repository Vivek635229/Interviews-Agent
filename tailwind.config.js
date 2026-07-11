/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      /* ── DESIGN.md Color Tokens ── */
      colors: {
        primary: 'var(--color-primary)',
        'on-primary': 'var(--color-on-primary)',
        ink: 'var(--color-ink)',
        'ink-deep': 'var(--color-ink-deep)',
        charcoal: 'var(--color-charcoal)',
        body: 'var(--color-body)',
        mute: 'var(--color-mute)',
        canvas: 'var(--color-canvas)',
        'surface-soft': 'var(--color-surface-soft)',
        'surface-card': 'var(--color-surface-card)',
        hairline: 'var(--color-hairline)',
        'hairline-strong': 'var(--color-hairline-strong)',
        'on-dark': '#ffffff',
        'on-dark-mute': 'rgba(255,255,255,0.7)',
        'surface-dark': '#171717',
        'focus-ring': 'rgba(59,130,246,0.5)',
        link: 'var(--color-ink)',
        'link-mute': 'var(--color-body)',
        'terminal-red': '#ff5f56',
        'terminal-yellow': '#ffbd2e',
        'terminal-green': '#27c93f',
        /* AI SaaS accent — derived from DESIGN.md focus-ring blue */
        accent: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
        },
        success: '#27c93f',
        warning: '#ffbd2e',
        danger: '#ff5f56',
      },

      /* ── DESIGN.md Spacing Tokens ── */
      spacing: {
        xxs: '2px',
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        xxl: '32px',
        section: '88px',
        'section-tablet': '64px',
        'section-mobile': '48px',
      },

      /* ── DESIGN.md Border Radius Tokens ── */
      borderRadius: {
        none: '0px',
        sm: '6px',
        md: '8px',
        lg: '12px',
        full: '9999px',
      },

      /* ── DESIGN.md Typography ── */
      fontFamily: {
        display: ['Nunito', 'SF Pro Rounded', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        'display-xl': ['36px', { lineHeight: '1.11', fontWeight: '500' }],
        'display-lg': ['30px', { lineHeight: '1.2', fontWeight: '500' }],
        'heading-lg': ['24px', { lineHeight: '1.33', fontWeight: '600' }],
        'heading-md': ['20px', { lineHeight: '1.4', fontWeight: '500' }],
        'heading-sm': ['18px', { lineHeight: '1.56', fontWeight: '500' }],
        'body-md': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-strong': ['16px', { lineHeight: '1.5', fontWeight: '500' }],
        'body-sm': ['14px', { lineHeight: '1.43', fontWeight: '400' }],
        'body-sm-strong': ['14px', { lineHeight: '1.43', fontWeight: '500' }],
        'caption-sm': ['12px', { lineHeight: '1.33', fontWeight: '400' }],
        'code-md': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'code-sm': ['14px', { lineHeight: '1.43', fontWeight: '400' }],
        'button-md': ['14px', { lineHeight: '1', fontWeight: '500' }],
      },

      /* ── Layout ── */
      maxWidth: {
        content: '720px',
        dashboard: '1200px',
        wide: '1400px',
      },

      /* ── DESIGN.md: No shadows, only hairline borders ── */
      boxShadow: {
        none: 'none',
        'soft': '0 1px 2px rgba(0,0,0,0.04)',
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
      },

      /* ── Animation ── */
      transitionDuration: {
        fast: '150ms',
        base: '250ms',
        slow: '400ms',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },

      /* ── Nav / Sidebar Heights ── */
      height: {
        nav: '56px',
        'input-md': '40px',
        'btn-md': '36px',
        'snippet': '48px',
      },
    },
  },
  plugins: [],
};
