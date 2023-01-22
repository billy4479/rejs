module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: [
		'airbnb-typescript/base',
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'eslint-config-prettier',
		'plugin:import/typescript',
		'plugin:import/recommended'
	],
	plugins: ['svelte3', '@typescript-eslint', 'eslint-plugin-prettier', 'import'],
	ignorePatterns: ['*.cjs', '*.html'],
	overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
	settings: {
		'svelte3/typescript': () => require('typescript')
	},
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: ['./tsconfig.eslint.json'],
		sourceType: 'module',
		ecmaVersion: 2020
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	rules: {
		'prettier/prettier': 'error',
		'no-plusplus': 0,
		'import/extensions': ['error', { ts: 'never' }],
		'no-shadow': 'off',
		'@typescript-eslint/no-shadow': ['error'],
		'import/no-extraneous-dependencies': ['error', { devDependencies: true }]
	}
};
