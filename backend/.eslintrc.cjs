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
		"no-console": "off",
		"camelcase": ["error", {
			"ignoreDestructuring": true,
			"ignoreImports": true,
			"properties": "never",
			"allow": [
				"^id_",
				"^file_",
				"^recruiter_",
				"^founded_",
				"^employees_",
				"^zip_",
				"^is_",
				"^send_",
				"^read_",
				"^uploaded_",
				"^expires_",
				"^token_",
				"^user_",
				"^job_",
				"^application_",
				"^company_",
				"^bio_",
				"^linkedin_",
				"^portfolio_",
				"^experience_",
				"^other_user",
				"^password_",
				"^document_",
				"^interview_",
				"^contract_",
				"^working_",
				"^formation_",
				"^filter_"
			]
		}]
	},
};

