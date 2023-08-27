import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Signup from './components/signup';
import Home from './components/Home';
import Cart from './components/cart';
import Orders from './components/orders';
import ForgotPassword from './components/forgotPassword';
import AdminLogin from './components/adminLogin';
import AdminHome from './components/adminHome';


function App()  {
  return  (
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login />} ></Route>
      <Route path='/signup' element={<Signup />} ></Route>
      <Route path='/home' element={<Home />} ></Route>
      <Route path='/cart' element={<Cart />} ></Route>
      <Route path='/orders' element={<Orders />} ></Route>
      <Route path='/forgot-password' element={<ForgotPassword />} ></Route>
      <Route path='/admin-login' element={<AdminLogin />} ></Route>
      <Route path='/admin-home' element={<AdminHome />} ></Route>
    </Routes>
  </BrowserRouter>
  );
  ;
}

export default App;
