import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AuthView from '@/views/AuthView.vue'
import ContinentView from '@/views/ContinentView.vue'
import CountryView from '@/views/CountryView.vue'
import CityView from '@/views/CityView.vue'
import PlaceView from '@/views/PlaceView.vue'
import ProfileView from '@/views/ProfileView.vue'
import SettingsView from '@/views/SettingsView.vue'
import AdminView from '@/views/AdminView.vue'

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
      path: '/continent',
      name: 'continent',
      component: ContinentView,
    },
    {
      path: '/country',
      name: 'country',
      component: CountryView,
    },
    {
      path: '/city',
      name: 'city',
      component: CityView,
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
      path: '/admin',
      name: 'admin',
      component: AdminView,
    },
  ],
})

export default router
