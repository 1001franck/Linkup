// Configuration ESLint pour l'API Express
module.exports = {
	root: true,
	env: {
		es2022: true,
		node: true,
	},
	extends: [
		"standard",
		"plugin:prettier/recommended"
	],
	parserOptions: {
		ecmaVersion: 2022,
		sourceType: "module",
	},
	rules: {
		"no-console": "off"
	},
};

