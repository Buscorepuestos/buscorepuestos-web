import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
	plugins: [react()],
	test: {
		environment: 'jsdom',
		reporters: process.env.CI === 'yes' ? ['dot', 'github-actions'] : ['verbose'],
		coverage: {
			thresholds: {
				statements: 90,
				branches: 90,
				functions: 90,
				lines: 90,
			},
			provider: 'v8',
			ignoreEmptyLines: true,
			include: ['app/**/*'],
			exclude: ['node_modules', 'test/**/*', 'app/**/*.test.*', 'app/**/page.tsx', 'app/**/layout.tsx' , 'app/core/components/svg', 'app/component-examples'],
			reporter: ['text', 'html', 'json'],
		},
	},
})
