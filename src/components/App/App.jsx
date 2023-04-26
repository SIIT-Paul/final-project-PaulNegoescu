import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { Auth, AuthContextProvider, ProductList } from '~/features';
import { Nav } from '~/components';
import { ProductDetails } from '~/features/Products/ProductDetails';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';

export function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </AuthContextProvider>
  );
}
