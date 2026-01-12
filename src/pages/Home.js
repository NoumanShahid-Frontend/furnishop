import React from 'react';
import Hero from "../components/Hero";
import Features from "../components/Features";
import NewItems from "../components/NewItems";
import FeaturesSecond from "../components/FeaturesSecond";
import Products from "../components/Products";
import Testimonial from "../components/Testimonial";
import NewsLetters from "../components/NewsLetters";

const Home = () => {
    return (
        <>
            <Hero />
            <Features />
            <NewItems />
            <FeaturesSecond />
            <Products />
            <Testimonial />
            <NewsLetters />
        </>
    );
};

export default Home;
