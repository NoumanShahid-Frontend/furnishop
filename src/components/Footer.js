import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/images/logo.svg";
import { footer } from "../data";

const Footer = () => {
	const { social } = footer;
	const year = new Date().getFullYear();
	const socialLink = social.map((item, index) => {
		const { icon, href } = item;
		return (
			<div
				key={index}
				className='w-12 h-12 text-white text-2xl rounded-full bg-gray-700 hover:bg-accent flex justify-center items-center transition'
			>
				<a href={href}>{icon}</a>
			</div>
		);
	});
	return (
		<footer className='section bg-primary'>
			<div className='container mx-auto'>
				<div className='grid grid-cols-1 lg:grid-cols-4 gap-10 border-b border-opacity-75 border-gray-700 pb-10 lg:pb-14 mb-10'>
					<div>
						<Link to='/' className='inline-flex mb-6'>
							<img src={Logo} alt='Logo' />
						</Link>
						<p className='text-white/80 leading-relaxed max-w-sm'>
							Modern furniture for modern living. Discover quality pieces designed for comfort, style, and everyday use.
						</p>
						<div className='flex gap-x-4 mt-6'>{socialLink}</div>
					</div>

					<div>
						<h3 className='text-white font-semibold text-lg mb-4'>Shop</h3>
						<div className='flex flex-col gap-3 text-white/80'>
							<Link className='hover:text-white transition w-fit' to='/products'>All Products</Link>
							<Link className='hover:text-white transition w-fit' to='/cart'>Cart</Link>
							<Link className='hover:text-white transition w-fit' to='/profile'>My Account</Link>
							<Link className='hover:text-white transition w-fit' to='/admin'>Admin</Link>
						</div>
					</div>

					<div>
						<h3 className='text-white font-semibold text-lg mb-4'>Company</h3>
						<div className='flex flex-col gap-3 text-white/80'>
							<Link className='hover:text-white transition w-fit' to='/about'>About</Link>
							<Link className='hover:text-white transition w-fit' to='/contact'>Contact</Link>
							<Link className='hover:text-white transition w-fit' to='/products'>New Arrivals</Link>
							<Link className='hover:text-white transition w-fit' to='/products'>Best Sellers</Link>
						</div>
					</div>

					<div>
						<h3 className='text-white font-semibold text-lg mb-4'>Support</h3>
						<div className='flex flex-col gap-3 text-white/80'>
							<span>Shipping: Free over $200</span>
							<span>Returns: 30-day policy</span>
							<span>Help: hello@furnishop.com</span>
							<span>Hours: Mon–Fri, 8am–5pm</span>
						</div>
					</div>
				</div>
				<div className='text-white/80 text-center'>
					&copy; {year} FurniShop. All Rights Reserved.
				</div>
			</div>
		</footer>
	);
};

export default Footer;
