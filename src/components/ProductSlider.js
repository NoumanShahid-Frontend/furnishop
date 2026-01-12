import React, { useContext } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Link, useNavigate } from "react-router-dom";
import CartContext from '../context/CartContext';

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../slider.css";

// Core modules imports are same as usual
import { Navigation, Pagination } from "swiper/modules";

// Importing React Icons
import { HiPlus } from "react-icons/hi";

const ProductSlider = ({ products }) => {
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    const addToCartHandler = (e, product) => {
        e.stopPropagation(); // Prevent navigating to product details
        addToCart(product, 1);
        navigate('/cart');
    };

    // Group products into pages (e.g., 8 products per page)
    const pages = [];
    for (let i = 0; i < products.length; i += 8) {
        pages.push(products.slice(i, i + 8));
    }

	const pageSlider = pages.map((pageProducts, index) => {
		return (
			<SwiperSlide key={index}>
				<div className='grid grid-cols-2 gap-x-5 md:grid-cols-3 lg:grid-cols-4 lg: gap-5 lg:gap-10'>
					{pageProducts.map((product, index) => (
						<div
							key={index}
							className='max-w-[290px] max-h-[400px] w-full text-left'
						>
							<div className='border hover:border-accent w-full max-w-[285px] h-[292px] flex items-center justify-center relative transition rounded-lg hover:shadow-md hover:cursor-pointer hover:transition'>
                                <Link to={`/product/${product._id}`}>
								    <img src={product.image} alt={product.name} className="max-h-[200px] object-contain" />
                                </Link>
								<div
									className='absolute right-3 bottom-3 border-spacing-1 
						border-2 p-0.5 rounded-full bg-gray-300 transition cursor-pointer hover:bg-primary hover:text-white'
                                    onClick={(e) => addToCartHandler(e, product)}
								>
									<HiPlus className='text-xl' />
								</div>
							</div>
							<div className='px-1 py-3'>
                                <Link to={`/product/${product._id}`}>
								    <h3 className='font-semibold text-base lg:text-xl'>
									    {product.name}
								    </h3>
                                </Link>
								<div className='flex gap-x-5 text-sm'>
									<p>{product.price} $</p>
									<p className='opacity-60 line-through'>
										{product.oldPrice} $
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</SwiperSlide>
		);
	});

	return (
		<Swiper
			pagination={{ clickable: true }}
			navigation={true}
			modules={[Pagination, Navigation]}
			className='productSlider relative min-h-[1330px]'
		>
			{pageSlider}
		</Swiper>
	);
};

export default ProductSlider;
