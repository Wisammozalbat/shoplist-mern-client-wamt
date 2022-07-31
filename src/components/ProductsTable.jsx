import React from 'react'

export const ProductsTable = ({ products }) => {
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
        {products.map((product) => {
          return (
            <tr key={product._id}>
              <td>{product.name}</td>
              <td>${product.price.$numberDecimal}</td>
              <td className="capitalize">{product.store}</td>
              <td>
                <button onClick={() => console.log(product._id)}>edit</button>
              </td>
              <td>
                <button onClick={() => console.log(product._id)}>delete</button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
