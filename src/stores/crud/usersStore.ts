import { defineStore } from "pinia";
import { ref } from 'vue';
import type { User } from "@/interfaces/interfaces";

export const useUsersStore = defineStore('usersStore', {
   state: () => ({
      users: ref<User[]>([]),
      error: ref<string | null>(null),
      isUsersLoaded: ref<boolean>(false),
      isLoading: ref<boolean>(false),
   }),

   actions: {

   },
})