import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import {
  AddProduct,
  Auth,
  AuthContextProvider,
  ProductDetails,
  ProductList,
} from '~/features';
import { Nav } from '~/components';

import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { ProtectedRoute } from '../ProtectedRoute/ProtectedRoute';

export function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route
            path="/products/add"
            element={
              <ProtectedRoute>
                <AddProduct />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </AuthContextProvider>
  );
}
