// ESLint v9 flat config for TypeScript + React project
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsparser = require('@typescript-eslint/parser');
const react = require('eslint-plugin-react');
const globals = require('globals');

module.exports = [
	// Ignore patterns
	{
		ignores: ['node_modules/**', 'dist/**', 'build/**', '*.config.js']
	},
	{
		files: ['**/*.{js,mjs,cjs,ts,tsx}'],
		languageOptions: {
			parser: tsparser,
			parserOptions: {
				ecmaVersion: 2022,
				sourceType: 'module',
				ecmaFeatures: { jsx: true }
			},
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2021,
				...globals.jest
			}
		},
		plugins: {
			'@typescript-eslint': tseslint,
			'react': react
		},
		rules: {
			// ESLint recommended rules
			...require('@eslint/js').configs.recommended.rules,
			// TypeScript recommended rules
			...tseslint.configs.recommended.rules,
			// React recommended rules
			...react.configs.recommended.rules,
			
			// Project-specific overrides
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': [
				'warn', 
				{ 
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_'
				}
			],
			'@typescript-eslint/no-explicit-any': 'warn',
			'react/prop-types': 'off', // using TypeScript for types
			'react/react-in-jsx-scope': 'off', // Not needed in React 17+
			'no-console': ['warn', { allow: ['warn', 'error'] }]
		},
		settings: {
			react: {
				version: 'detect'
			}
		}
	}
];

