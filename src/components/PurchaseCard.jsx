import React from 'react'

export const PurchaseCard = ({ creationDate, products, purchaseId }) => {
  const date = new Date(creationDate)
  const store = products[0].store
  return (
    <div className="w-full px-5 py-4 flex flex-col shadow rounded-md">
      <h4 className="text-lg font-bold text-center">
        {date.toLocaleDateString()} {date.toLocaleTimeString()}
        <span className="block">at {store}</span>
      </h4>
      <div className="flex flex-col">
        <div className="flex flex-row font-bold gap-2 justify-between">
          <p>Product</p>
          <p>Quantity</p>
        </div>
        {products.map((product) => {
          return (
            <div
              className="flex flex-row gap-2 justify-between"
              key={product._id}
            >
              <p>{product.name}</p>
              <p>x{product.quantity}</p>
            </div>
          )
        })}
      </div>
      <p className="text-center">
        <span className="font-bold">Total: </span>$
        {products.reduce((previewsValue, currProd) => {
          return (
            Number(currProd.price.$numberDecimal) * Number(currProd.quantity) +
            previewsValue
          )
        }, 0)}
      </p>
    </div>
  )
}
