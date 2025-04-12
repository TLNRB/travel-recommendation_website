import { ref } from "vue";
import type { User } from "@/interfaces/interfaces"
import { state } from "@/modules/states/state"

export const useUsers = () => {
  const token = ref<string | null>(localStorage.getItem('lsToken'))
  const error = ref<string | null>(null)
  const user = ref<User | null>(null)

  const firstName = ref<string>('')
  const lastName = ref<string>('')
  const username = ref<string>('')
  const email = ref<string>('')
  const password = ref<string>('')

  const fetchToken = async (email: string, password: string): Promise<void> => {
    try {
      const response = await fetch('https://travel-recommendations-api.onrender.com/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('lsToken') || ''
        },
        body: JSON.stringify({ email, password })
      })
      if (!response.ok) {
        const errorResponse = await response.json()
        console.log(errorResponse.error || 'error')
        throw new Error('Invalid credentials')
      }
      const authResponse = await response.json()
      token.value = authResponse.data.token
      await getUserById(authResponse.data.userId)
      state.isLoggedIn = true

      localStorage.setItem('lsToken', authResponse.data.token)
      localStorage.setItem('userId', authResponse.data.userId)
      console.log('user is logged in', authResponse)
      console.log('user: ', user.value)
    }
    catch (err) {
      error.value = (err as Error).message || 'Failed to login';
      state.isLoggedIn = false;
    }
  }

  const registerUser = async (firstName: string, lastName: string, username: string, email: string, password: string): Promise<void> => {
    try {
      const response = await fetch('https://travel-recommendations-api.onrender.com/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('lstoken') || ''
        },
        body: JSON.stringify({ firstName, lastName, username, email, password })
      })
      if (!response.ok) {
        const errorResponse = await response.json()
        console.log(errorResponse.error || 'error')
        throw new Error('no data available')
      }
      const authResponse = await response.json()
      token.value = authResponse.data.token
      user.value = authResponse.data.user
      state.isLoggedIn = true

      localStorage.setItem('lsToken', authResponse.data.token)
      console.log('user is registered', authResponse)

    }
    catch (err) {
      error.value = (err as Error).message
      state.isLoggedIn = false
    }
  }

  const getUserById = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`https://travel-recommendations-api.onrender.com/api/users/query?field=_id&value=${id}&populate=true`, {
        method: 'GET'
      })

      if (!response.ok) {
        const errorResponse = await response.json()
        console.log(errorResponse.error || 'error')
        throw new Error('No data available')
      }

      const userData = await response.json()
      user.value = userData.data[0]
    }
    catch (err) {
      error.value = (err as Error).message
    }
  }

  // Get the user role name
  const getUserRoleName = async (id: string): Promise<string | undefined> => {
    try {
      const response = await fetch(`https://travel-recommendations-api.onrender.com/api/users/query?field=_id&value=${id}&populate=true`, {
        method: 'GET'
      })

      if (!response.ok) {
        const errorResponse = await response.json()
        console.log(errorResponse.error || 'error')
        throw new Error('No data available')
      }

      let user = await response.json()
      return user.data[0].role.name;
    }
    catch (err) {
      error.value = (err as Error).message
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    state.isLoggedIn = false
    localStorage.removeItem('lsToken')
    localStorage.removeItem('userId');
    console.log('user is logged out')
    console.log("state: ", state.isLoggedIn)
    console.log("token: ", token.value)
    console.log("user: ", user.value)
  }

  return {
    token,
    isLoggedIn: state.isLoggedIn,
    error,
    user,
    firstName,
    lastName,
    username,
    email,
    password,
    fetchToken,
    registerUser,
    logout,
    getUserRoleName
  }
}
