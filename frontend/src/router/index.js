import { route } from 'quasar/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'

/*
 * When a user logs in or out from a Pinia store, we want to be able to
 * programmatically navigate them to a different page. To do this, the
 * store needs access to the router instance.
 *
 * By creating the router instance here in the module scope (outside the
 * default export function), we create a "singleton" instance that can be
 * imported and used anywhere in our application.
 *
 * This pattern is ideal for Single-Page Applications (SPA). For Server-Side
 * Rendering (SSR), you would typically create a new router instance for each
 * request inside the exported function to avoid cross-request state pollution.
 * Since this is an SPA, this approach is clean and effective.
 */

// This function determines which history mode to use based on the environment.
// It's configured via the `quasar.conf.js` file.
const createHistory = process.env.SERVER
  ? createMemoryHistory
  : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory

// Create the router instance.
const router = createRouter({
  // This function is called every time the route changes.
  // It ensures the user is scrolled to the top of the new page.
  scrollBehavior: () => ({ left: 0, top: 0 }),

  // The routes are imported from the `src/router/routes.js` file.
  // Keeping them in a separate file makes the project more organized.
  routes,

  // Leave these as is and change them in quasar.conf.js instead!
  // quasar.conf.js -> build -> vueRouterMode
  // quasar.conf.js -> build -> publicPath
  history: createHistory(process.env.VUE_ROUTER_BASE),
})

/*
 * We export the router instance we just created.
 * This allows us to import it in other files like this:
 * `import { router } from 'src/router'`
 * This is exactly what we do in `src/stores/auth.js` to handle redirects.
 */
export { router }

/*
 * The default export is a Quasar boot file function.
 * Quasar calls this function when initializing the app.
 * It expects the router instance to be returned from it.
 * Since we've already created our router instance, we just return it.
 */
export default route(function (/* { store, ssrContext } */) {
  return router
})
