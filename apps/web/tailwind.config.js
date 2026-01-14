/** @type {import('tailwindcss').Config} */
export default {
	content: [
		// './src/**/*.{html,js,svelte,ts}',
		// '../../packages/ui/src/**/*.{html,js,svelte,ts}'
		'./src/**/*.{html,js,svelte,ts}',
		'../../packages/**/src/**/*.{html,js,svelte,ts}'
	],
	theme: {
		extend: {
			colors: {
				// Shopify-inspired color palette
				primary: {
					50: '#f0fdf4',
					100: '#dcfce7',
					200: '#bbf7d0',
					300: '#86efac',
					400: '#4ade80',
					500: '#22c55e',
					600: '#16a34a',
					700: '#15803d',
					800: '#166534',
					900: '#14532d',
					950: '#052e16'
				},
				surface: {
					DEFAULT: '#ffffff',
					subdued: '#f9fafb',
					disabled: '#f3f4f6'
				},
				border: {
					DEFAULT: '#e5e7eb',
					subdued: '#f3f4f6',
					strong: '#d1d5db'
				},
				text: {
					DEFAULT: '#111827',
					subdued: '#6b7280',
					disabled: '#9ca3af'
				},
				critical: {
					DEFAULT: '#ef4444',
					subdued: '#fef2f2'
				},
				warning: {
					DEFAULT: '#f59e0b',
					subdued: '#fffbeb'
				},
				success: {
					DEFAULT: '#10b981',
					subdued: '#ecfdf5'
				},
				info: {
					DEFAULT: '#3b82f6',
					subdued: '#eff6ff'
				}
			},
			borderRadius: {
				lg: '0.5rem',
				md: '0.375rem',
				sm: '0.25rem'
			},
			boxShadow: {
				card: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
				'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
			}
		}
	},
	plugins: []
};
