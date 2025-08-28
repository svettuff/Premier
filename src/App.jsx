import './App.css'

import {Routes, Route, useLocation} from "react-router-dom";
import {useEffect, useRef} from "react";

import Header from "./Header.jsx";
import Hero from "./Hero.jsx";
import About from "./About.jsx";
import Products from "./Products.jsx";
import Production from "./Production.jsx";
import Contact from "./Contact.jsx";
import Vacancies from "./Vacancies.jsx";
import Stores from "./Stores.jsx";

function App() {
    const location = useLocation();

    const sectionsRef = {
        "/": useRef(),
        "/about": useRef(),
        "/production": useRef(),
        "/products": useRef(),
        "/stores": useRef(),
        "/vacancies": useRef(),
        "/contact": useRef(),
    };

    useEffect(() => {
        const ref = sectionsRef[location.pathname];
        if (ref?.current) {
            ref.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [location.pathname, sectionsRef]);

  return (
    <>
        <Header />
        <div ref={sectionsRef["/"]}>
            <Hero />
        </div>
        <div ref={sectionsRef["/about"]}>
            <About />
        </div>
        <div ref={sectionsRef["/production"]}>
            <Production />
        </div>
        <div ref={sectionsRef["/products"]}>
            <Products />
        </div>
        <div ref={sectionsRef["/stores"]}>
            <Stores />
        </div>
        <div ref={sectionsRef["/vacancies"]}>
            <Vacancies />
        </div>
        <div ref={sectionsRef["/contact"]}>
            <Contact />
        </div>
    </>
  )
}

export default App
