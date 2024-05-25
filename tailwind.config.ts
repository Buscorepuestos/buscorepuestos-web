import type { Config } from 'tailwindcss'

const config: Config = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		screens: {
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
		},
		fontSize: {
			'title-1': '6.4rem',
			'title-2': '4rem',
			'title-3': '2.4rem',
			base: '1.6rem',
			sm: '1.4rem',
			xs: '1.2rem',
		},
		extend: {
			backgroundImage: {
				'mecanic-banner': "url('/banner-motor.webp')",
			},
			boxShadow: {
				inter: '0px 6px 13px -4px #424242 inset',
			},
			colors: {
				background: 'var(--background)',
				foreground: 'var(--foreground)',
				'custom-white': 'var(--custom-white)',
				'custom-black': 'var(--custom-black)',
				'primary-blue': 'var(--primary-blue)',
				'secondary-blue': 'var(--secondary-blue)',
				warning: 'var(--warning)',
				'dark-grey': 'var(--dark-grey)',
				'light-grey': 'var(--light-grey)',
			},
			fontFamily: {
				'primary-font': ['var(--font-work-sans)'],
				'secondary-font': ['var(--font-bebas-neue)'],
			},
		},
	},
	plugins: [],
}
export default config
