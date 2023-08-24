<script>
	import '../app.postcss';

	/** @type {import('@sveltejs/adapter-vercel').Config} */
	export const config = {
		runtime: 'nodejs18.x'
	};
</script>

<slot />
<footer class="footer justify-center items-center p-4 bg-neutral text-neutral-content">
	<div class="items-center grid-flow-col">
	  
	  <p>Made with love by <a class="hover:underline" href="https://www.iamickdev.com">ICKDEV❤️</a></p>
	</div> 

  </footer>