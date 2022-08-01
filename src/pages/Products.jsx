import React, { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosClient } from '../axios/axiosClient'
import { ProductModal } from '../components'
import { ProductsTable } from '../components/ProductsTable'
import { Layout } from '../containers/Layout'
import { useLocalStorage } from '../hooks/useLocalStorage'

export const Products = () => {
  const [products, setProducts] = useState([])
  const [tokenIsLoading, setTokenIsLoading] = useState(true)
  // eslint-disable-next-line no-unused-vars
  const [token, _, removeToken] = useLocalStorage('auth-token')
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [productSelected, setProductSelected] = useState(null)
  const navigate = useNavigate()

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
        onClick={() => {
          setModalIsOpen(true)
          setProductSelected(null)
        }}
      >
        Create Product
      </button>
      <ProductsTable
        products={products}
        handleSelectProduct={setProductSelected}
        openModal={setModalIsOpen}
      />
      {modalIsOpen && (
        <ProductModal
          isOpen={modalIsOpen}
          handleIsOpen={(newOpenValue) => {
            setModalIsOpen(newOpenValue)
            setProductSelected(null)
          }}
          productSelected={productSelected}
        />
      )}
    </Layout>
  )
}
