export const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","global.css"]),
	mimeTypes: {".png":"image/png",".css":"text/css"},
	_: {
		entry: {"file":"_app/immutable/start-8432eb09.js","imports":["_app/immutable/start-8432eb09.js","_app/immutable/chunks/index-b9a47a54.js","_app/immutable/chunks/singletons-ed68d3cf.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			() => import('./nodes/0.js'),
			() => import('./nodes/1.js'),
			() => import('./nodes/2.js')
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				names: [],
				types: [],
				optional: [],
				page: { layouts: [0], errors: [1], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
};
