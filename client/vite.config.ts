import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
	server: {
		port: 50505,
		allowedHosts: ["localhost", "sputnik.grandpa.digital", "dev.sputnik.grandpa.digital"],
	},
	plugins: [
		vue(),
		// vueDevTools(),
	],

	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				api: "modern-compiler",
			},
		},
	},
	build: {
		minify: true,
		outDir: "dist",
		emptyOutDir: true,
		sourcemap: false,
		assetsDir: ".",
		rollupOptions: {
			treeshake: true,
		},
	},
});
