import type { Config } from 'tailwindcss'

const config: Config = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		fontSize: {
			'title-1': '5.6rem',
			'title-2': '4.8rem',
			'title-3': '2.4rem',
			'title-4': '1.8rem',
			base: '1.6rem',
			sm: '1.4rem',
			xs: '1.2rem',
			lg: '3rem',
			xl: '4rem',
			'8xl': '6rem',
			'9xl': '8rem',
		},
		extend: {
			screens: {
				mobile: {max: '639px'},
				tablet: {min:'640px', max: '1439px'},
				desktop: '1440px',
			},
			boxShadow: {
				inter: '0px 6px 13px -4px #424242 inset',
			},
			colors: {
				background: 'var(--background)',
				foreground: 'var(--foreground)',
				'custom-white': 'var(--custom-white)',
				'custom-black': 'var(--custom-black)',
				'custom-grey': 'var(--custom-grey)',
				'primary-blue': 'var(--primary-blue)',
				'primary-blue-2': 'var(--primary-blue-2)',
				'primary-lila': 'var(--primary-lila)',
				'secondary-blue': 'var(--secondary-blue)',
				warning: 'var(--warning)',
				'dark-grey': 'var(--dark-grey)',
				'light-grey': 'var(--light-grey)',
				'neutro-100': 'var(--neutro100)',
				'neutro-grey': 'var(--neutro-grey)',
				'custom-orange': 'var(--custom-orange)',
				'alter-grey': 'var(--alter-grey)',
			},
			fontFamily: {
				'primary-font': ['var(--font-work-sans)'],
				'secondary-font': ['var(--font-bebas-neue)'],
				'tertiary-font': ['var(--font-family-popins)'],
			},
			gridTemplateColumns: {
				'custom-layout': '60% 30% 10%',
				'custom-layout-mobile': '80% 20%'
			}
		},
	},
	plugins: [],
}
export default config
