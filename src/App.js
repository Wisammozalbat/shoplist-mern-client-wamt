import './styles.css'
import { Route, Routes } from 'react-router-dom'
import {
  Home,
  Products,
  ProductDetail,
  Purchase,
  PurchaseDetail,
} from './pages'
import { Layout } from './containers/Layout'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/purchase/:id" element={<PurchaseDetail />} />
      </Routes>
    </Layout>
  )
}

export default App
