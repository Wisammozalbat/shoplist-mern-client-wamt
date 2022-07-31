import { useEffect } from 'react'
import { useCallback } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const useLocalStorage = (key, initialValue = '') => {
  const [itemValue, setItemValue] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (typeof window === 'undefined') {
      setItemValue(null)
    }
    try {
      const item = window.localStorage.getItem(key)
      setItemValue(item ? JSON.parse(item) : initialValue)
    } catch (error) {
      console.log(error)
      setItemValue(initialValue)
    }
  }, [key, initialValue])

  const setItem = useCallback(
    (value) => {
      try {
        const newValue = JSON.stringify(value)
        localStorage.setItem(key, newValue)
        setItemValue(newValue)
      } catch (error) {
        console.log(error)
      }
    },
    [key]
  )

  const removeItem = useCallback(() => {
    try {
      localStorage.removeItem(key)
      setItemValue(null)
      if (key === 'auth-token') {
        navigate('/login', { replace: true })
      }
    } catch (error) {
      console.log(error)
    }
  }, [key, navigate])

  return [itemValue, setItem, removeItem]
}
