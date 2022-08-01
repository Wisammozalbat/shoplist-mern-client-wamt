import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosClient } from '../axios/axiosClient'
import { PurchaseModal } from '../components'
import { PurchaseCard } from '../components/PurchaseCard'
import { Layout } from '../containers/Layout'
import { useLocalStorage } from '../hooks/useLocalStorage'

export const Purchases = () => {
  const [purchases, setPurchases] = useState([])
  const [tokenIsLoading, setTokenIsLoading] = useState(true)
  // eslint-disable-next-line no-unused-vars
  const [token, _, removeToken] = useLocalStorage('auth-token')
  const navigate = useNavigate()
  const [modalIsOpen, setModalIsOpen] = useState(false)

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

    const getPurchases = async () => {
      const response = await axiosClient('/purchase', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.status !== 200) {
        removeToken()
      }
      setPurchases(response.data.data)
    }
    getPurchases()
  }, [token, tokenIsLoading, removeToken, navigate])

  return (
    <Layout>
      <button
        className="px-4 py-2 bg-green-200 rounded-md border border-2 border-green-400 mb-6"
        onClick={() => {
          setModalIsOpen(true)
        }}
      >
        Create Purchase
      </button>
      {purchases.length > 0 ? (
        <div className="grid grid-cols-4 gap-6">
          {purchases.map((purchase) => (
            <PurchaseCard
              key={purchase._id}
              purchaseId={purchase._id}
              products={purchase.products}
              creationDate={purchase.date}
            />
          ))}
        </div>
      ) : (
        <div>No hay compras</div>
      )}
      {modalIsOpen && (
        <PurchaseModal isOpen={modalIsOpen} handleIsOpen={setModalIsOpen} />
      )}
    </Layout>
  )
}
