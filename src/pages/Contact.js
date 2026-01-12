import React from 'react';
import Stats from '../components/Stats';
import NewsLetters from '../components/NewsLetters';
import { HiPhone, HiMail, HiLocationMarker, HiChevronDown } from 'react-icons/hi';

const Contact = () => {
    return (
        <>
            <section className="bg-hero bg-right bg-cover bg-no-repeat text-white pt-[225px] pb-[100px] relative mb-12 lg:bg-cover lg:mb-20">
                <div className="container mx-auto text-center">
                     <h1 className="text-2xl mx-auto font-semibold mb-[30px] lg:text-[64px] lg:leading-tight font-primary">
                        Contact Us
                    </h1>
                    <h2 className="mb-[30px] max-w-[672px] mx-auto lg:mb-[65px] lg:text-xl opacity-80">
                        We'd love to hear from you.
                    </h2>
                </div>
            </section>

            <section className="section">
                <div className="container mx-auto grid lg:grid-cols-2 gap-10">
                    <div>
                        <h2 className="title text-3xl font-bold mb-6">Get In Touch</h2>
                        <p className="subtitle text-gray-600 mb-8 text-lg leading-relaxed">
                            Have a question about our products, shipping, or anything else? Our team is ready to answer all your questions.
                        </p>
                        
                        <div className="flex flex-col gap-8 mb-10">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center text-2xl shrink-0 shadow-lg">
                                    <HiLocationMarker />
                                </div>
                                <div>
                                    <h4 className="font-bold text-xl mb-1">Visit Us</h4>
                                    <p className="text-gray-600">123 Furniture St, Design District</p>
                                    <p className="text-gray-600">New York, NY 10012</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center text-2xl shrink-0 shadow-lg">
                                    <HiPhone />
                                </div>
                                <div>
                                    <h4 className="font-bold text-xl mb-1">Call Us</h4>
                                    <p className="text-gray-600">Mon-Fri from 8am to 5pm.</p>
                                    <p className="text-primary font-semibold">+1 (555) 000-0000</p>
                                </div>
                            </div>
                             <div className="flex items-start gap-4">
                                <div className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center text-2xl shrink-0 shadow-lg">
                                    <HiMail />
                                </div>
                                <div>
                                    <h4 className="font-bold text-xl mb-1">Email Us</h4>
                                    <p className="text-gray-600">Send us your query anytime!</p>
                                    <p className="text-primary font-semibold">hello@furniturestore.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 lg:p-10 shadow-xl rounded-2xl border border-gray-100">
                         <form>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                    Name
                                </label>
                                <input
                                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                    id="name"
                                    type="text"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                    id="email"
                                    type="email"
                                    placeholder="Your Email"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                                    Message
                                </label>
                                <textarea
                                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition h-40 resize-none"
                                    id="message"
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    className="bg-black hover:bg-gray-800 text-white font-bold py-4 px-6 rounded-lg focus:outline-none focus:shadow-outline w-full transition duration-300 shadow-lg transform active:scale-95"
                                    type="button"
                                >
                                    Send Message
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            <section className="section bg-gray-50 py-20">
                 <div className="container mx-auto">
                     <h2 className="title text-center mb-10 text-3xl font-bold">Our Impact</h2>
                      <div className="text-white">
                         <Stats />
                      </div>
                 </div>
             </section>

             <section className="section py-20">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="title text-center text-3xl font-bold mb-12">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {[
                            { q: "What is your return policy?", a: "We offer a 30-day return policy for all items that are in their original condition." },
                            { q: "Do you offer international shipping?", a: "Yes, we ship to selected countries. Please check our shipping page for more details." },
                            { q: "How can I track my order?", a: "Once your order is shipped, you will receive a tracking number via email." },
                            { q: "Do you offer warranty?", a: "Yes, all our furniture comes with a 1-year manufacturer warranty." }
                        ].map((item, index) => (
                            <div key={index} className="border rounded-lg p-6 hover:shadow-md transition bg-white">
                                <h3 className="font-bold text-lg mb-2 flex justify-between items-center cursor-pointer">
                                    {item.q}
                                    <HiChevronDown className="text-gray-400" />
                                </h3>
                                <p className="text-gray-600">{item.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
             </section>

            
            <NewsLetters />
        </>
    );
};

export default Contact;
