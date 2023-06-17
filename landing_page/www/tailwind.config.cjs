/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			backgroundImage: { "site-gradient": "linear-gradient(81.02deg, #4d91ff -23.47%, #b14bf4 45.52%, #fa5560 114.8%)", }
		},
	},
	plugins: [],
}
