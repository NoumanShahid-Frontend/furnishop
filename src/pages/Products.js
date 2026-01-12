import React from 'react';
import ProductsComponent from '../components/Products';

const Products = () => {
    return (
        <>
            <section className="bg-hero bg-right bg-cover bg-no-repeat text-white pt-[225px] pb-[100px] relative mb-12 lg:bg-cover lg:mb-20">
                <div className="container mx-auto text-center">
                     <h1 className="text-2xl mx-auto font-semibold mb-[30px] lg:text-[64px] lg:leading-tight font-primary">
                        Our Products
                    </h1>
                    <h2 className="mb-[30px] max-w-[672px] mx-auto lg:mb-[65px] lg:text-xl opacity-80">
                        Explore our wide range of high-quality furniture.
                    </h2>
                </div>
            </section>
            
            <ProductsComponent />
        </>
    );
};

export default Products;
