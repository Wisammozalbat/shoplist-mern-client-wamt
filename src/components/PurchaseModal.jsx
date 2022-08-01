import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosClient } from '../axios/axiosClient'
import { useLocalStorage } from '../hooks/useLocalStorage'

export const PurchaseModal = ({ isOpen, handleIsOpen }) => {
  // eslint-disable-next-line no-unused-vars
  const [token, _, removeToken] = useLocalStorage('auth-token')
  const navigate = useNavigate()
  const [tokenIsLoading, setTokenIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    product: '',
    quantity: 0,
  })
  const [products, setProducts] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])

  const handleCloseModal = () => {
    handleIsOpen(false)
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axiosClient('/purchase', {
        method: 'POST',
        data: {
          products: selectedProducts.map((product) => ({
            productId: product.product,
            quantity: product.quantity,
          })),
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.status !== 200) {
        alert('Could not create purchase')
      }
      alert('Created purchase')
      setFormData({
        product: '',
        quantity: 0,
      })
      setSelectedProducts([])
    } catch (error) {
      console.log(error)
    } finally {
    }
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const addProduct = () => {
    if (!formData.product || formData.quantity <= 0) {
      return
    }

    setSelectedProducts([
      ...selectedProducts,
      {
        ...formData,
        name: products.filter((product) => product._id === formData.product)[0]
          .name,
      },
    ])
    setFormData({
      product: '',
      quantity: 0,
    })
  }

  const removeSelectedProduct = (deletedId) => {
    setSelectedProducts(
      selectedProducts.filter((product) => product.product !== deletedId)
    )
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
  }, [token, removeToken, navigate, tokenIsLoading])

  return (
    <div className={`modal ${isOpen ? 'block' : 'hidden'}`}>
      <div className="modal-container">
        <div className="modal-backdrop" onClick={handleCloseModal} />
        <div className="modal-content">
          <p>Create Purchase</p>
          <form
            className="w-full flex flex-col gap-4 mt-10"
            onSubmit={handleOnSubmit}
          >
            <select
              name="product"
              placeholder="selectProduct"
              defaultValue={''}
              onChange={handleInputChange}
            >
              <option value="">Select a Product</option>
              {products.map((product) => {
                return (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                )
              })}
            </select>
            <input
              type="number"
              name="quantity"
              placeholder="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className={
                'px-3 py-1.5 text-lg rounded-md border border-neutral-400 border-solid hover:border-neutral-800'
              }
            />
            <button type="button" onClick={addProduct}>
              Add
            </button>
            <div className="flex flex-col">
              {selectedProducts.map((product) => {
                return (
                  <div key={product.product} className="flex justify-between">
                    <p>{product.name}</p>
                    <span className="flex">
                      <p>x{product.quantity}</p>
                      <button
                        className="ml-4 text-red-500 font-bolt"
                        onClick={() => removeSelectedProduct(product.product)}
                      >
                        Remove
                      </button>
                    </span>
                  </div>
                )
              })}
            </div>
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
