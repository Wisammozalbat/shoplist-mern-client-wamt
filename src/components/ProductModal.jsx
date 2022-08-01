import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosClient } from '../axios/axiosClient'
import { useLocalStorage } from '../hooks/useLocalStorage'

export const ProductModal = ({ isOpen, handleIsOpen, productSelected }) => {
  // eslint-disable-next-line no-unused-vars
  const [token] = useLocalStorage('auth-token')
  const navigate = useNavigate()
  const [tokenIsLoading, setTokenIsLoading] = useState(true)
  const defaultFormData = useMemo(
    () => ({
      name: '',
      price: 0,
      store: '',
    }),
    []
  )

  const [formData, setFormData] = useState(defaultFormData)

  const handleCloseModal = () => {
    handleIsOpen(false)
    setFormData(defaultFormData)
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || Number(formData.price) <= 0 || !formData.store) {
      alert('Invalid data')
    }

    try {
      if (productSelected) {
        const response = await axiosClient(`/products/${productSelected._id}`, {
          method: 'PUT',
          data: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.status !== 200) {
          alert('An error ocurred')
        } else {
          alert('Product Edited Succesfuly')
        }
        return
      }
      const response = await axiosClient(`/products`, {
        method: 'POST',
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.status !== 201) {
        alert('An error ocurred')
      } else {
        alert('Product Created Succesfuly')
      }
      return
    } catch (error) {
      alert('An error ocurred')
    } finally {
      handleCloseModal()
    }
  }

  useEffect(() => {
    setTokenIsLoading(token == null)
  }, [token, setTokenIsLoading])

  useEffect(() => {
    if (tokenIsLoading) {
      return
    }

    if (!token) {
      navigate('/login', { replace: true })
    }
    if (productSelected) {
      setFormData({
        name: productSelected.name,
        price: productSelected.price.$numberDecimal,
        store: productSelected.store,
      })
    } else {
      setFormData(defaultFormData)
    }
  }, [productSelected, defaultFormData, navigate, tokenIsLoading, token])

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  return (
    <div className={`modal ${isOpen ? 'block' : 'hidden'}`}>
      <div className="modal-container">
        <div className="modal-backdrop" onClick={handleCloseModal} />
        <div className="modal-content">
          <p>{productSelected ? 'Edit Product' : 'Create Product'}</p>
          <form
            className="w-full flex flex-col gap-4 mt-10"
            onSubmit={handleOnSubmit}
          >
            <input
              type="text"
              name="name"
              placeholder="name"
              value={formData.name}
              onChange={handleInputChange}
              className={
                'px-3 py-1.5 text-lg rounded-md border border-neutral-400 border-solid hover:border-neutral-800'
              }
            />
            <input
              type="number"
              name="price"
              placeholder="price"
              value={formData.price}
              onChange={handleInputChange}
              className={
                'px-3 py-1.5 text-lg rounded-md border border-neutral-400 border-solid hover:border-neutral-800'
              }
            />
            <input
              type="text"
              name="store"
              placeholder="store"
              value={formData.store}
              onChange={handleInputChange}
              className={
                'px-3 py-1.5 text-lg rounded-md border border-neutral-400 border-solid hover:border-neutral-800'
              }
            />
            <div className="flex gap-4 justify-center">
              <button type="button" onClick={handleCloseModal}>
                Cancel
              </button>
              <button type="submit">Accept</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
