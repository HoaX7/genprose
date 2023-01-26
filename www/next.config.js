/* eslint-disable no-undef */
/** @type {import('next').NextConfig} */
const nextConfig = {
	// reactStrictMode: true,
	env: { BACKEND_SERVICE: process.env.BACKEND_SERVICE }
};

module.exports = nextConfig;
