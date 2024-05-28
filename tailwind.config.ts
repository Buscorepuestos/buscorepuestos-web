import type { Config } from 'tailwindcss'

const config: Config = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		fontSize: {
			'title-1': '5.6rem',
			'title-2': '4.8rem',
			'title-3': '2.4rem',
			base: '1.6rem',
			sm: '1.4rem',
			xs: '1.2rem',
		},
		extend: {
			screens: {
				mobile: 'var(--mobile-breakpoint)',
				tablet: 'var(--tablet-breakpoint)',
				desktop: 'var(--desktop-breakpoint)',
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
