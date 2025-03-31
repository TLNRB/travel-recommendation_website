import { ref } from "vue";
import type { User } from "@/interfaces/interfaces"

export const useUsers = () => {
  const token = ref<string | null>(null)
  const isLoggedIn = ref<boolean>(false)
  const error = ref<string | null>(null)
  const user = ref<User | null>(null)

  const firstName = ref<string>('')
  const lastName = ref<string>('')
  const username = ref<string>('')
  const email = ref<string>('')
  const password = ref<string>('')

  const fetchToken = async(email: string, password: string):Promise<void> => {
    try {
      const response = await fetch('https://travel-recommendations-api.onrender.com/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('lsToken') || ''
        },
        body: JSON.stringify({email, password})
      })
      if(!response.ok) {
        const errorResponse = await response.json()
        console.log(errorResponse.error || 'error')
        throw new Error ('no data available')
      }
      const authResponse = await response.json()
      token.value = authResponse.data.token
      user.value = authResponse.data.user
      isLoggedIn.value = true

      localStorage.setItem('lstoken', authResponse.data.token)
      localStorage.setItem('userIDToken', authResponse.data.userID)
      console.log( 'user is logged in', authResponse)
      console.log(token.value)
    }
    catch(err) {
      error.value = (err as Error).message
      isLoggedIn.value = false
    }
  }


  const registerUser = async(firstName: string, lastName: string, username: string, email: string, password: string):Promise<void> => {
    try {
      const response = await fetch('https://travel-recommendations-api.onrender.com/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('lsToken') || ''
        },
        body: JSON.stringify({firstName, lastName, username, email, password})
      })
      if(!response.ok) {
        const errorResponse = await response.json()
        console.log(errorResponse.error || 'error')
        throw new Error ('no data available')
      }
      const authResponse = await response.json()
      token.value = authResponse.data.token
      user.value = authResponse.data.user
      isLoggedIn.value = true

      localStorage.setItem('lstoken', authResponse.data.token)
      console.log( 'user is registered', authResponse)

    }
    catch(err) {
      error.value = (err as Error).message
      isLoggedIn.value = false
    }
  }


  const logout = () => {
    token.value = null
    user.value = null
    isLoggedIn.value = false
    localStorage.removeItem('lsToken')
    console.log('user is logged out')
  }

  return {
    token,
    isLoggedIn,
    error,
    user,
    firstName,
    lastName,
    username,
    email,
    password,
    fetchToken,
    registerUser,
    logout
  }
}
