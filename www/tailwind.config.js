// eslint-disable-next-line no-undef
module.exports = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx}",
		"./src/components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			keyframes: {
				slideLeftEnter: {
					"0%": { transform: "translateX(50px)" },
					"100%": { transform: "translateX(0)" }
				},
				slideLeftLeave: {
					"0%": { transform: "translateX(0)" },
					"100%": { transform: "translateX(-50px)" }
				},
			},
			animation: {
				"slide-left-enter": "slideLeftEnter .3s ease-in-out",
				"slide-left-leave": "slideLeftLeave .3s ease-in-out",
			},
			colors: {
				"site-purple": "#5d3fd3",
				"site-pink": "#fde3e9",
				"site-blue": "#e3f2fd",
				"site-transparent": "#ffffff33",
				"site-secondary-transparent": "#cccccc33"
			},
			// eslint-disable-next-line max-len
			backgroundImage: { "site-gradient": "linear-gradient(81.02deg, #4d91ff -23.47%, #b14bf4 45.52%, #fa5560 114.8%)", }
		},
	},
	plugins: [],
	darkMode: "class"
};
