import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthView from '@/views/AuthView.vue'
import ContinentView from '@/views/ContinentView.vue'
import CountryView from '@/views/CountryView.vue'
import CityView from '@/views/CityView.vue'
import PlaceView from '@/views/PlaceView.vue'
import ProfileView from '@/views/ProfileView.vue'
import SettingsView from '@/views/SettingsView.vue'
import DashboardView from '@/views/DashboardView.vue'
// Stores
import { useUserStore } from '@/stores/userStore'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView,
    },
    {
      path: '/continent/:id',
      name: 'ContinentView',
      component: ContinentView,
      props: true
    },
    {
      path: '/country/:id',
      name: 'CountryView',
      component: CountryView,
      props: true
    },
    {
      path: '/city/:id',
      name: 'CityView',
      component: CityView,
      props: true
    },
    {
      path: '/place',
      name: 'place',
      component: PlaceView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      meta: { requiresAuth: true },
      component: DashboardView,
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const authStore = useAuthStore()

  // Check if the user is logged in and only than check for loading and try to fetch user data
  if (authStore.getIsLoggedIn && !userStore.getIsUserLoaded && !userStore.getIsLoading) {
    await userStore.fetchUserData()
  }

  const isAuthenticated: boolean = !!localStorage.getItem('lsToken')
  const requiresAuth: boolean = to.matched.some(record => record.meta.requiresAuth)

  // Requires authentication but not authenticated
  if (requiresAuth && !isAuthenticated) {
    next({ name: 'auth' });
  }
  // Authenticated but trying to access auth page
  else if (isAuthenticated && to.name === 'auth') {
    next({ name: 'home' });
  }
  // Authenticated and trying to access dashboard
  else if (isAuthenticated && to.name === 'dashboard') {
    const user = userStore.getUser;

    if (user?.role?.name === 'admin' || user?.role?.name === 'editor') {
      return next()
    } else {
      return next({ name: 'home' })
    }
  }
  else next()
})

export default router
