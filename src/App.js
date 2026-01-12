import React, { useContext, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Products from "./pages/Products";
import AuthContext from "./context/AuthContext";
import Logo from "./assets/images/logo.svg";

function App() {
	const { loading } = useContext(AuthContext);
	const [showSplash, setShowSplash] = useState(true);

	useEffect(() => {
		const id = setTimeout(() => setShowSplash(false), 800);
		return () => clearTimeout(id);
	}, []);

	const isSplashVisible = loading || showSplash;

	if (isSplashVisible) {
		return (
			<div className='min-h-screen w-full flex items-center justify-center bg-white'>
				<div className='flex flex-col items-center text-center px-6'>
					<img src={Logo} alt='FurniShop' className='w-20 h-20 mb-6' />
					<h1 className='text-2xl font-bold text-gray-900 mb-2'>FurniShop</h1>
					<p className='text-gray-600 mb-6'>Loading your experience...</p>
					<div className='w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin' />
				</div>
			</div>
		);
	}

	return (
		<div className='w-full mx-auto bg-white'>
			<Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
			<Footer />
		</div>
	);
}

export default App;
