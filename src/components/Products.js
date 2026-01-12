import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import ProductSlider from "./ProductSlider";
import { HiOutlineSearch, HiOutlineExclamationCircle } from "react-icons/hi";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            setError("");
            setLoading(true);
            try {
                const { data } = await axios.get('/products');
                setProducts(Array.isArray(data) ? data : []);
            } catch (error) {
                setError(error?.response?.data?.message || "Failed to load products");
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

	return (
		<section className='section'>
			<div className='container mx-auto'>
				<h1 className='title text-center'>All Products</h1>
				<h3 className='subtitle text-center'>
                    The products we provide only for you as our service are selected from the best products with number 1 quality in the world
                </h3>

                {error && (
                    <div className="mt-8 max-w-lg mx-auto rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm flex items-center gap-2">
                        <HiOutlineExclamationCircle className="text-lg" />
                        <span>{error}</span>
                    </div>
                )}

                {loading ? (
                    <div className="mt-12 flex items-center justify-center">
                        <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="mt-12 text-center max-w-md mx-auto rounded-2xl border bg-gray-50 px-6 py-12">
                        <HiOutlineSearch className="text-4xl text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-900 font-semibold">No products found</p>
                        <p className="text-gray-600 text-sm mt-1">
                            Check back later or explore other categories.
                        </p>
                    </div>
                ) : (
                    <ProductSlider products={products} />
                )}
			</div>
		</section>
	);
};

export default Products;
