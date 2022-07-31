import './styles.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import {
  Login,
  Products,
  ProductDetail,
  Purchases,
  PurchaseDetail,
} from './pages'

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/purchases" element={<Purchases />} />
      <Route path="/purchases/:id" element={<PurchaseDetail />} />
      <Route path="*" element={<Navigate to="/purchases" replace={true} />} />
    </Routes>
  )
}

export default App
