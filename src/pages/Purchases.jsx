import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { axiosClient } from '../axios/axiosClient'
import { PurchaseCard } from '../components/PurchaseCard'
import { Layout } from '../containers/Layout'
import { useLocalStorage } from '../hooks/useLocalStorage'

export const Purchases = () => {
  const [purchases, setPurchases] = useState([])
  const [tokenIsLoading, setTokenIsLoading] = useState(true)
  // eslint-disable-next-line no-unused-vars
  const [token, _, removeToken] = useLocalStorage('auth-token')
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
    </Layout>
  )
}
