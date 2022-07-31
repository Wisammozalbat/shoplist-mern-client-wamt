import React, { Fragment, useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosClient } from '../axios/axiosClient'
import { useLocalStorage } from '../hooks/useLocalStorage'

export const Login = () => {
  const defaultFormData = {
    email: '',
    password: '',
    name: '',
    lastname: '',
  }
  const [formData, setFormData] = useState(defaultFormData)
  const [isRegister, setIsRegister] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [value, setValue] = useLocalStorage('auth-token')
  const navigate = useNavigate()

  const validateFormData = () => {
    const { name, lastname, email, password } = formData
    if (
      isRegister &&
      name !== '' &&
      lastname !== '' &&
      email !== '' &&
      password.length >= 6
    ) {
      return true
    } else if (email !== '' && password.length >= 6) {
      return true
    } else {
      return false
    }
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!validateFormData()) {
      alert('data not valid')
      return
    }
    try {
      let response
      if (isRegister) {
        response = await axiosClient('/register', {
          data: formData,
          method: 'POST',
        })
      } else {
        response = await axiosClient('/login', {
          data: formData,
          method: 'POST',
        })
      }
      if (response.status !== 201) {
        console.log('there was an error')
      }

      setFormData(defaultFormData)
      setValue(response.data.token)
      navigate('/purchases', { replace: true })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (value) {
      navigate('/purchases', { replace: true })
    }
  }, [value, navigate])

  return (
    <div className="flex flex-col w-full h-full items-center justify-center">
      <form onSubmit={handleLogin} className="flex flex-col gap-2.5">
        {isRegister && (
          <Fragment>
            <input
              className="px-3 py-1.5 text-lg rounded-md border border-neutral-400 border-solid hover:border-neutral-800"
              type="text"
              name="name"
              placeholder="enter your name"
              value={formData.name}
              onChange={handleInputChange}
            />
            <input
              className="px-3 py-1.5 text-lg rounded-md border border-neutral-400 border-solid hover:border-neutral-800"
              type="text"
              name="lastname"
              placeholder="enter your lastname"
              value={formData.lastname}
              onChange={handleInputChange}
            />
          </Fragment>
        )}
        <input
          className="px-3 py-1.5 text-lg rounded-md border border-neutral-400 border-solid hover:border-neutral-800"
          type="email"
          name="email"
          placeholder="enter your email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <div className="flex gap-2 relative">
          <input
            className="px-3 pr-12 py-1.5 text-lg rounded-md border border-neutral-400 border-solid hover:border-neutral-800"
            type={showPassword ? 'text' : 'password'}
            name="password"
            autoComplete="on"
            placeholder="enter your password"
            value={formData.password}
            onChange={handleInputChange}
          />
          <button
            type="button"
            onMouseDown={() => setShowPassword(true)}
            onMouseUp={() => setShowPassword(false)}
            className={`p-1 absolute top-1/2 right-0 -translate-y-2/4 ${
              showPassword ? 'opacity-100' : 'opacity-50'
            }`}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <button
          type="submit"
          className="rounded-md text-lg px-4 py-2 bg-cyan-400 border-2 border-blue-400 border-solid mb-3 text-white font-bold uppercase tracking-widest"
        >
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>
      {isRegister ? (
        <div className="text-sm text-center">
          <p>Already have an account?</p>
          <button
            onClick={() => setIsRegister(false)}
            className="text-blue-400"
          >
            Click here to login
          </button>
        </div>
      ) : (
        <div className="text-sm text-center">
          <p>Do not have an accout?</p>
          <button onClick={() => setIsRegister(true)} className="text-blue-400">
            Click here to register
          </button>
        </div>
      )}
    </div>
  )
}
