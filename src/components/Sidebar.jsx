import React from 'react'
import { useNavigate } from 'react-router-dom'

export const Sidebar = ({ className }) => {
  const navigate = useNavigate()
  return (
    <div className={className}>
      <button onClick={() => navigate('/products')}>Show Products</button>
      <button onClick={() => navigate('/purchases')}>Show Purchases</button>
      {/* <button onClick={() => navigate}>Create Purchase</button> */}
    </div>
  )
}
