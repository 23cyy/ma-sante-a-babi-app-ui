
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				inter: ['Inter', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(142, 76%, 36%)',
					foreground: 'hsl(0, 0%, 98%)',
					50: 'hsl(142, 76%, 96%)',
					100: 'hsl(142, 76%, 88%)',
					500: 'hsl(142, 76%, 36%)',
					600: 'hsl(142, 76%, 30%)',
					700: 'hsl(142, 76%, 24%)',
				},
				secondary: {
					DEFAULT: 'hsl(210, 40%, 96.1%)',
					foreground: 'hsl(222.2, 47.4%, 11.2%)'
				},
				accent: {
					DEFAULT: 'hsl(24, 100%, 50%)',
					foreground: 'hsl(0, 0%, 98%)',
					50: 'hsl(24, 100%, 96%)',
					100: 'hsl(24, 100%, 88%)',
					500: 'hsl(24, 100%, 50%)',
					600: 'hsl(24, 100%, 44%)',
				},
				health: {
					blue: 'hsl(217, 91%, 60%)',
					purple: 'hsl(262, 83%, 58%)',
					red: 'hsl(0, 84%, 60%)',
					yellow: 'hsl(45, 93%, 58%)',
					indigo: 'hsl(231, 48%, 48%)',
				},
				destructive: {
					DEFAULT: 'hsl(0, 84.2%, 60.2%)',
					foreground: 'hsl(210, 40%, 98%)'
				},
				muted: {
					DEFAULT: 'hsl(210, 40%, 96.1%)',
					foreground: 'hsl(215.4, 16.3%, 46.9%)'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-up': {
					'0%': {
						transform: 'translateY(100%)'
					},
					'100%': {
						transform: 'translateY(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-up': 'slide-up 0.3s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
