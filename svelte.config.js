import { vitePreprocess } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-vercel';

const config = {
	kit: {
		adapter: adapter({
		  // see the 'Deployment configuration' section below
		})
	  },
	preprocess: [vitePreprocess({})]
};

export default config;
