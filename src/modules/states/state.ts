import { reactive, watch } from "vue";

const isLoggedInLS: boolean = localStorage.getItem('isLoggedIn') === 'true';

export const state = reactive({
   isLoggedIn: isLoggedInLS,
});

watch(() => state.isLoggedIn, (newValue: boolean) => {
   localStorage.setItem('isLoggedIn', String(newValue));
})