import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/images/logo.svg";
import { CgMenuRight, CgClose } from "react-icons/cg";
import { navigation } from "../data";
import NavMobile from "./NavMobile";
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import { HiOutlineShoppingCart, HiOutlineUserCircle } from 'react-icons/hi';

const Header = () => {
	const [bg, setBg] = useState(false);
	const [mobileNav, setMobileNav] = useState(false);
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const { cart } = useContext(CartContext);

    const cartItemCount = cart.cartItems.reduce((acc, item) => acc + item.qty, 0);

    // Pages that have a Hero section (transparent header initially)
    const heroPages = ['/', '/about', '/contact', '/products'];
    const hasHero = heroPages.includes(location.pathname);

	// Conditional Elements | Styling |:
	const bgStyle = bg || !hasHero ? "bg-primary py-4 lg:py-6 shadow-md" : "bg-none py-8";
	const mobileNavMenu = mobileNav ? <CgClose /> : <CgMenuRight />;
	const mobileNavMenuStyle = mobileNav ? "left-0" : "-left-full";
	const navItems = navigation.map((item, index) => {
		const isActive = location.pathname === item.href;
		return (
			<li key={index}>
				<Link
					to={item.href}
					className={`text-white capitalize hover:border-b transition-all ${
						isActive ? 'border-b-2 border-white' : ''
					}`}
				>
					{item.name}
				</Link>
			</li>
		);
	});

	// Controlling the Scrolling Effect:
	useEffect(() => {
		const handleScroll = () => {
            window.scrollY > 50 ? setBg(true) : setBg(false);
        };
		document.addEventListener("scroll", handleScroll);
        return () => {
            document.removeEventListener("scroll", handleScroll);
        };
	}, []);

	return (
		<section
			className={`${bgStyle} fixed w-full left-0 z-10 transition-all duration-200`}
		>
			<div className='container mx-auto'>
				<div className='flex justify-between items-center'>
					<Link to='/'>
						<img src={Logo} alt='Brand Logo' className='h-6 lg:h-8' />
					</Link>
					<div
						onClick={() => setMobileNav(!mobileNav)}
						className='text-2xl text-white md:hidden lg:text-3xl cursor-pointer'
					>
						{mobileNavMenu}
					</div>
					{/* Nav Desktop + Tablet */}
					<nav className='hidden md:flex items-center gap-x-12'>
						<ul className='flex md:gap-x-12'>{navItems}</ul>
                        <div className="flex items-center gap-x-6 text-white">
                             <Link to="/cart" className="relative text-2xl">
                                <HiOutlineShoppingCart />
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {cartItemCount}
                                    </span>
                                )}
                            </Link>
                            {user ? (
                                <div className="flex items-center gap-x-4">
                                    {user.isAdmin && (
                                        <Link to="/admin" className="text-base font-semibold hover:border-b transition-all">
                                            Admin
                                        </Link>
                                    )}
                                    <Link to="/profile" className="text-2xl flex items-center gap-2">
                                        <HiOutlineUserCircle />
                                        <span className="text-base">{user.name}</span>
                                    </Link>
                                </div>
                            ) : (
                                <Link to="/login" className="text-base hover:border-b transition-all">
                                    Login
                                </Link>
                            )}
                        </div>
					</nav>
					{/* Nav Mobile */}
					<section
						className={`${mobileNavMenuStyle} md:hidden fixed bottom-0 w-full max-w-xs h-screen transition-all`}
					>
						<NavMobile />
					</section>
				</div>
			</div>
		</section>
	);
};

export default Header;
