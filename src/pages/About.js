import React from 'react';
import Stats from '../components/Stats';
import NewsLetters from '../components/NewsLetters';
import Features1Img from "../assets/images/features-1.png";
import Features2Img from "../assets/images/features-2.png";

const About = () => {
    return (
        <>
            <section className="bg-hero bg-right bg-cover bg-no-repeat text-white pt-[225px] pb-[100px] relative mb-12 lg:bg-cover lg:mb-20">
                <div className="container mx-auto text-center">
                     <h1 className="text-2xl mx-auto font-semibold mb-[30px] lg:text-[64px] lg:leading-tight font-primary">
                        About Us
                    </h1>
                    <h2 className="mb-[30px] max-w-[672px] mx-auto lg:mb-[65px] lg:text-xl opacity-80">
                        Crafting comfort, defining style. Your home, reimagined.
                    </h2>
                </div>
            </section>

            <section className="section">
                <div className="container mx-auto flex flex-col lg:flex-row gap-10 items-center">
                    <div className="flex-1">
                         <img src={Features1Img} alt="Our Story" className="rounded-lg shadow-lg hover:scale-105 transition duration-500" />
                    </div>
                    <div className="flex-1">
                        <h2 className="title text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
                        <p className="subtitle text-gray-600 mb-6 text-lg leading-relaxed">
                            Founded in 2024, FurniShop started with a simple mission: to make high-quality furniture accessible to everyone.
                            We believe your home should feel personal, comfortable, and timeless.
                        </p>
                        <p className="subtitle text-gray-600 text-lg leading-relaxed">
                             From curated essentials to statement pieces, every product is selected with care for design, durability, and everyday living.
                             Our focus is simple: premium materials, honest pricing, and a smooth shopping experience.
                        </p>
                    </div>
                </div>
            </section>
            
             <section className="section bg-gray-100 py-20">
                 <div className="container mx-auto">
                     <h2 className="title text-center mb-10 text-3xl font-bold">Why Choose Us</h2>
                      <div className="text-white">
                         <Stats />
                      </div>
                 </div>
             </section>

             <section className="section py-20">
                 <div className="container mx-auto">
                    <h2 className="title text-center text-3xl font-bold mb-12">Our Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white border rounded-2xl p-8 shadow-sm hover:shadow-md transition">
                            <h3 className="text-xl font-bold mb-3">Crafted to Last</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We prioritize materials and build quality so your furniture stays beautiful for years.
                            </p>
                        </div>
                        <div className="bg-white border rounded-2xl p-8 shadow-sm hover:shadow-md transition">
                            <h3 className="text-xl font-bold mb-3">Thoughtful Design</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Clean lines, modern comfort, and functional details that fit real homes.
                            </p>
                        </div>
                        <div className="bg-white border rounded-2xl p-8 shadow-sm hover:shadow-md transition">
                            <h3 className="text-xl font-bold mb-3">Customer First</h3>
                            <p className="text-gray-600 leading-relaxed">
                                From browsing to delivery, we keep the experience simple, fast, and reliable.
                            </p>
                        </div>
                    </div>
                 </div>
             </section>

             <section className="section bg-white py-20">
                <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12">
                    <div className="flex-1">
                        <h2 className="title text-3xl md:text-4xl font-bold mb-6">Our Quality Promise</h2>
                        <p className="text-gray-600 text-lg leading-relaxed mb-6">
                            Every item is inspected for finish, stability, and comfort. If something isn’t right, we make it right.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="border rounded-xl p-5 bg-gray-50">
                                <h4 className="font-bold mb-1">Secure Delivery</h4>
                                <p className="text-gray-600 text-sm">Careful packaging and safe shipping options.</p>
                            </div>
                            <div className="border rounded-xl p-5 bg-gray-50">
                                <h4 className="font-bold mb-1">Easy Returns</h4>
                                <p className="text-gray-600 text-sm">Simple return process for eligible items.</p>
                            </div>
                            <div className="border rounded-xl p-5 bg-gray-50">
                                <h4 className="font-bold mb-1">Support Team</h4>
                                <p className="text-gray-600 text-sm">Help with orders, shipping, and product questions.</p>
                            </div>
                            <div className="border rounded-xl p-5 bg-gray-50">
                                <h4 className="font-bold mb-1">Fair Pricing</h4>
                                <p className="text-gray-600 text-sm">Great quality without unnecessary markups.</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 w-full">
                        <div className="bg-gray-50 rounded-2xl p-8 shadow-sm border">
                            <img src={Features2Img} alt="Quality Furniture" className="w-full h-auto object-contain rounded-xl" />
                        </div>
                    </div>
                </div>
             </section>

            <NewsLetters />
        </>
    );
};

export default About;
