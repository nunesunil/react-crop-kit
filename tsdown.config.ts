import { defineConfig } from "tsdown";

export default defineConfig({
	entry: "src/index.tsx",
	dts: true,
	exports: true,
	format: "esm",
	platform: "neutral",
	minify: true,
	deps: {
		neverBundle: ["react", "react-dom", "react/jsx-runtime"],
	},
	loader: {
		".js": "jsx",
	},
	css: {
		inject: true,
	},
});
