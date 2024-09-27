import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
	plugins: [react()],
	test: {
		environment: 'jsdom',
		reporters:
			process.env.CI === 'yes' ? ['dot', 'github-actions'] : ['verbose'],
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
			exclude: [
				'node_modules',
				'test/**/*',
				'app/**/*.test.*',
				'app/**/page.tsx',
				'app/**/layout.tsx',
				'app/core/components/svg',
				'app/component-examples',
				'app/core/components/__tests__/redux/mocks',
				'app/types',
				'app/core/components/checkout/StripeForm.tsx',
				'app/environment',
				'app/core/components/filters',
				'app/services/sumup/sumupWidget.tsx',
				'app/core/components/sumupPayment/sumupPayment.tsx',
				'app/core/components/paymentSelection/PaymentSelection.tsx',
			],
			reporter: ['text', 'html', 'json'],
		},
		setupFiles: [
			'./app/core/components/__tests__/redux/mocks/test.setup.ts',
			'./app/core/components/__tests__/__mocks__/next/router.ts',
		],
	},
})
