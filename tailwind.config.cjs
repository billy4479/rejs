/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{js,ts,css,svelte}'],
	theme: {
		extend: {}
	},
	plugins: [],
	safelist: [
		{
			pattern: /ml-(2|4|6|8)/
		}
	]
};
