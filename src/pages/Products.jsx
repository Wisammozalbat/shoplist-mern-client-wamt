import React, { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosClient } from '../axios/axiosClient'
import { ProductsTable } from '../components/ProductsTable'
import { Layout } from '../containers/Layout'
import { useLocalStorage } from '../hooks/useLocalStorage'

export const Products = () => {
  const defaultFormData = {
    name: '',
    price: 0,
    store: '',
  }

  const [products, setProducts] = useState([])
  const [tokenIsLoading, setTokenIsLoading] = useState(true)
  // eslint-disable-next-line no-unused-vars
  const [token, _, removeToken] = useLocalStorage('auth-token')
  const [formData, setFormData] = useState(defaultFormData)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
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

    const getProducts = async () => {
      const response = await axiosClient('/products', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.status !== 200) {
        removeToken()
      }
      setProducts(response.data.data)
    }

    getProducts()
  }, [token, tokenIsLoading, removeToken, navigate])

  return (
    <Layout>
      <button
        className="px-4 py-2 bg-green-200 rounded-md border border-2 border-green-400 mb-6"
        onClick={() => setModalIsOpen(true)}
      >
        Create Product
      </button>
      <ProductsTable products={products} />
      <div className={`modal ${modalIsOpen ? 'block' : 'hidden'}`}>
        <div className="modal-container">
          <div
            className="modal-backdrop"
            onClick={() => setModalIsOpen(false)}
          />
          <div className="modal-content">
            <p>Create Product</p>
            <form className="w-full flex flex-col gap-4 mt-10">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={
                  'px-3 py-1.5 text-lg rounded-md border border-neutral-400 border-solid hover:border-neutral-800'
                }
              />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className={
                  'px-3 py-1.5 text-lg rounded-md border border-neutral-400 border-solid hover:border-neutral-800'
                }
              />
              <input
                type="text"
                name="store"
                value={formData.store}
                onChange={handleInputChange}
                className={
                  'px-3 py-1.5 text-lg rounded-md border border-neutral-400 border-solid hover:border-neutral-800'
                }
              />
              <div className="flex gap-4 justify-center">
                <button type="button">Cancel</button>
                <button type="submit">Accept</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
