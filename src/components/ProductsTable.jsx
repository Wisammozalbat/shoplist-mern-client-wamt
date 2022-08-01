import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { axiosClient } from '../axios/axiosClient'
import { useLocalStorage } from '../hooks/useLocalStorage'

export const ProductsTable = ({ products, handleSelectProduct, openModal }) => {
  const [currentProducts, setCurrentProducts] = useState([])
  const [token] = useLocalStorage('auth-token')

  useEffect(() => {
    setCurrentProducts(products)
  }, [products])

  const deleteProduct = async (id) => {
    try {
      const response = await axiosClient(`/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.status !== 200) {
        alert('An error ocurred')
      } else {
        alert('Product Deleted Succesfuly')
        setCurrentProducts(products.filter((product) => product._id !== id))
      }
      return
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <table className="w-full">
      <thead className="w-full">
        <tr>
          <th>Product Name</th>
          <th>Product Price</th>
          <th>Product Store</th>
          <th>Edit Product</th>
          <th>Delete Product</th>
        </tr>
      </thead>
      <tbody>
        {currentProducts.map((product) => {
          return (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>${product.price.$numberDecimal}</td>
              <td className="capitalize">{product.store}</td>
              <td className="text-center">
                <button
                  className=" px-4 py-2 border rounded hover:bg-gray-200"
                  onClick={() => {
                    handleSelectProduct(product)
                    openModal(true)
                  }}
                >
                  edit
                </button>
              </td>
              <td className="text-center">
                <button
                  className=" px-4 py-2 border rounded hover:bg-gray-200"
                  onClick={() => deleteProduct(product._id)}
                >
                  delete
                </button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
