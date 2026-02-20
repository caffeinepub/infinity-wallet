import typography from '@tailwindcss/typography';
import containerQueries from '@tailwindcss/container-queries';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['index.html', 'src/**/*.{js,ts,jsx,tsx,html,css}'],
    theme: {
        container: {
            center: true,
            padding: '1.5rem',
            screens: {
                '2xl': '1200px'
            }
        },
        extend: {
            fontSize: {
                xs: ['0.7rem', { lineHeight: '1rem' }],
                sm: ['0.8125rem', { lineHeight: '1.25rem' }],
                base: ['0.875rem', { lineHeight: '1.5rem' }],
                lg: ['1rem', { lineHeight: '1.5rem' }],
                xl: ['1.125rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.375rem', { lineHeight: '2rem' }],
                '3xl': ['1.75rem', { lineHeight: '2.25rem' }],
                '4xl': ['2rem', { lineHeight: '2.5rem' }],
            },
            spacing: {
                '0.5': '0.1rem',
                '1': '0.2rem',
                '1.5': '0.3rem',
                '2': '0.4rem',
                '2.5': '0.5rem',
                '3': '0.6rem',
                '3.5': '0.7rem',
                '4': '0.8rem',
                '5': '1rem',
                '6': '1.2rem',
                '7': '1.4rem',
                '8': '1.6rem',
                '10': '2rem',
                '12': '2.4rem',
                '16': '3.2rem',
                '20': '4rem',
            },
            colors: {
                border: 'oklch(var(--border))',
                input: 'oklch(var(--input))',
                ring: 'oklch(var(--ring) / <alpha-value>)',
                background: 'oklch(var(--background))',
                foreground: 'oklch(var(--foreground))',
                primary: {
                    DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
                    foreground: 'oklch(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
                    foreground: 'oklch(var(--secondary-foreground))'
                },
                destructive: {
                    DEFAULT: 'oklch(var(--destructive) / <alpha-value>)',
                    foreground: 'oklch(var(--destructive-foreground))'
                },
                muted: {
                    DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
                    foreground: 'oklch(var(--muted-foreground) / <alpha-value>)'
                },
                accent: {
                    DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
                    foreground: 'oklch(var(--accent-foreground))'
                },
                popover: {
                    DEFAULT: 'oklch(var(--popover))',
                    foreground: 'oklch(var(--popover-foreground))'
                },
                card: {
                    DEFAULT: 'oklch(var(--card))',
                    foreground: 'oklch(var(--card-foreground))'
                },
                chart: {
                    1: 'oklch(var(--chart-1))',
                    2: 'oklch(var(--chart-2))',
                    3: 'oklch(var(--chart-3))',
                    4: 'oklch(var(--chart-4))',
                    5: 'oklch(var(--chart-5))'
                }
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            fontFamily: {
                sans: [
                    'Inter',
                    'system-ui',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'Segoe UI',
                    'Roboto',
                    'sans-serif'
                ],
                mono: [
                    'JetBrains Mono',
                    'Fira Code',
                    'Consolas',
                    'Monaco',
                    'monospace'
                ]
            },
            boxShadow: {
                xs: '0 1px 2px 0 rgba(0,0,0,0.05)',
                'glow-sm': '0 0 8px oklch(var(--primary) / 0.25)',
                'glow': '0 0 12px oklch(var(--primary) / 0.3), 0 0 24px oklch(var(--primary) / 0.15)',
                'glow-lg': '0 0 20px oklch(var(--primary) / 0.4), 0 0 40px oklch(var(--primary) / 0.2)',
                'glow-purple': '0 0 12px oklch(var(--secondary) / 0.3), 0 0 24px oklch(var(--secondary) / 0.15)',
                'glow-accent': '0 0 12px oklch(var(--accent) / 0.3), 0 0 24px oklch(var(--accent) / 0.15)',
                'neon': '0 0 4px oklch(var(--primary)), 0 0 8px oklch(var(--primary) / 0.8), 0 0 12px oklch(var(--primary) / 0.6)'
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-cosmic': 'radial-gradient(circle at 50% 50%, oklch(0.20 0.08 195 / 0.2), transparent 70%)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                },
                'glow-pulse': {
                    '0%, 100%': { 
                        boxShadow: '0 0 12px oklch(var(--primary) / 0.3), 0 0 24px oklch(var(--primary) / 0.15)' 
                    },
                    '50%': { 
                        boxShadow: '0 0 20px oklch(var(--primary) / 0.5), 0 0 40px oklch(var(--primary) / 0.25)' 
                    }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'glow-pulse': 'glow-pulse 2s ease-in-out infinite'
            }
        }
    },
    plugins: [typography, containerQueries, animate]
};
