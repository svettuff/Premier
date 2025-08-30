import "./App.css";
import {
    Routes,
    Route,
    useLocation,
    useNavigate,
    Navigate,
} from "react-router-dom";
import { useEffect, useMemo, useRef } from "react";

import Header from "./Header.jsx";
import Hero from "./Hero.jsx";
import About from "./About.jsx";
import Products from "./Products.jsx";
import Production from "./Production.jsx";
import Contact from "./Contact.jsx";
import Vacancies from "./Vacancies.jsx";
import Stores from "./Stores.jsx";

const PATHS = ["/", "/about", "/production", "/products", "/stores", "/vacancies", "/contact"];

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
const now = () => performance.now();

export default function App() {
    const location = useLocation();
    const navigate = useNavigate();

    const sectionsRef = useMemo(
        () =>
            PATHS.reduce((acc, p) => {
                acc[p] = { current: null };
                return acc;
            }, {}),
        []
    );

    const isAnimatingRef = useRef(false);
    const lastNavAtRef = useRef(0);
    const wheelAccumRef = useRef(0);
    const lastWheelAtRef = useRef(0);
    const touchStartYRef = useRef(null);
    const touchStartTRef = useRef(0);

    const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    useEffect(() => {
        const el = sectionsRef[location.pathname]?.current;
        if (!el) return;

        isAnimatingRef.current = true;

        const behavior = prefersReducedMotion ? "auto" : "smooth";
        el.scrollIntoView({ behavior, block: "start" });

        let done = false;
        const end = () => {
            if (done) return;
            done = true;
            isAnimatingRef.current = false;
        };

        const onScrollEnd = () => end();
        window.addEventListener("scrollend", onScrollEnd, { once: true });

        const t = setTimeout(end, prefersReducedMotion ? 50 : 700);

        return () => {
            window.removeEventListener("scrollend", onScrollEnd);
            clearTimeout(t);
        };
    }, [location.pathname, prefersReducedMotion, sectionsRef]);

    const goByStep = (step) => {
        const idx = PATHS.indexOf(location.pathname);
        const next = clamp(idx + step, 0, PATHS.length - 1);
        if (next !== idx) {
            lastNavAtRef.current = now();
            navigate(PATHS[next]);
        }
    };

    const normalizeDeltaY = (e) => {
        if (e.deltaMode === 1) return e.deltaY * 16;
        if (e.deltaMode === 2) return e.deltaY * window.innerHeight;
        return e.deltaY;
    };

    // WHEEL
    useEffect(() => {
        const MOMENTUM_GAP = 220;
        const THRESHOLD = 60;
        const COOLDOWN = 500;

        const onWheel = (e) => {
            const target = e.target;
            const targetCanScroll =
                target instanceof Element &&
                (target.scrollHeight > target.clientHeight ||
                    target.scrollWidth > target.clientWidth);
            if (targetCanScroll && getComputedStyle(target).overflowY !== "hidden") {
                return;
            }

            const t = now();
            const timeSinceLastNav = t - lastNavAtRef.current;
            if (isAnimatingRef.current || timeSinceLastNav < COOLDOWN) return;

            const dy = normalizeDeltaY(e);
            const sinceLastWheel = t - lastWheelAtRef.current;

            if (sinceLastWheel > 300) wheelAccumRef.current = 0;
            lastWheelAtRef.current = t;

            if (t - lastNavAtRef.current < MOMENTUM_GAP) return;

            wheelAccumRef.current += dy;

            if (wheelAccumRef.current > THRESHOLD) {
                e.preventDefault?.();
                wheelAccumRef.current = 0;
                goByStep(1);
            } else if (wheelAccumRef.current < -THRESHOLD) {
                e.preventDefault?.();
                wheelAccumRef.current = 0;
                goByStep(-1);
            }
        };

        window.addEventListener("wheel", onWheel, { passive: false });
        return () => window.removeEventListener("wheel", onWheel);
    }, [location.pathname]);

    // SWIPE
    useEffect(() => {
        const SWIPE_THRESHOLD = 50;
        const FAST_VELOCITY = 0.5;
        const COOLDOWN = 500;

        const onTouchStart = (e) => {
            const t = now();
            if (isAnimatingRef.current || t - lastNavAtRef.current < COOLDOWN) return;
            const touch = e.touches[0];
            touchStartYRef.current = touch.clientY;
            touchStartTRef.current = t;
        };

        const onTouchMove = (e) => {
            if (touchStartYRef.current != null) {
                e.preventDefault();
            }
        };

        const onTouchEnd = (e) => {
            const startY = touchStartYRef.current;
            const startT = touchStartTRef.current;
            touchStartYRef.current = null;

            if (startY == null) return;

            const endT = now();
            const touch = e.changedTouches[0];
            const dy = startY - touch.clientY;
            const dt = Math.max(endT - startT, 1);
            const v = Math.abs(dy) / dt;

            const distanceEnough = Math.abs(dy) >= SWIPE_THRESHOLD;
            const fastEnough = v >= FAST_VELOCITY;

            if (isAnimatingRef.current) return;
            if (distanceEnough || fastEnough) {
                if (dy > 0) goByStep(1);
                else goByStep(-1);
            }
        };

        window.addEventListener("touchstart", onTouchStart, { passive: true });
        window.addEventListener("touchmove", onTouchMove, { passive: false });
        window.addEventListener("touchend", onTouchEnd, { passive: true });
        return () => {
            window.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
        };
    }, [location.pathname]);

    useEffect(() => {
        const onKey = (e) => {
            if (isAnimatingRef.current) return;
            switch (e.key) {
                case "ArrowDown":
                case "PageDown":
                case " ":
                    e.preventDefault();
                    goByStep(1);
                    break;
                case "ArrowUp":
                case "PageUp":
                    e.preventDefault();
                    goByStep(-1);
                    break;
                case "Home":
                    e.preventDefault();
                    if (location.pathname !== PATHS[0]) navigate(PATHS[0]);
                    break;
                case "End":
                    e.preventDefault();
                    if (location.pathname !== PATHS[PATHS.length - 1])
                        navigate(PATHS[PATHS.length - 1]);
                    break;
                default:
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [location.pathname, navigate]);

    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => (document.body.style.overflow = prev);
    }, []);

    return (
        <>
            <Header />
            <main className="pager-container" id="pager-root" role="region" aria-label="Секции страницы">
                <div ref={(el) => (sectionsRef["/"].current = el)} className="pager-section" id="home">
                    <Hero />
                </div>
                <div ref={(el) => (sectionsRef["/about"].current = el)} className="pager-section" id="about">
                    <About />
                </div>
                <div ref={(el) => (sectionsRef["/production"].current = el)} className="pager-section" id="production">
                    <Production />
                </div>
                <div ref={(el) => (sectionsRef["/products"].current = el)} className="pager-section" id="products">
                    <Products />
                </div>
                <div ref={(el) => (sectionsRef["/stores"].current = el)} className="pager-section" id="stores">
                    <Stores />
                </div>
                <div ref={(el) => (sectionsRef["/vacancies"].current = el)} className="pager-section" id="vacancies">
                    <Vacancies />
                </div>
                <div ref={(el) => (sectionsRef["/contact"].current = el)} className="pager-section" id="contact">
                    <Contact />
                </div>
            </main>

            <Routes>
                <Route path="/" element={null} />
                <Route path="/about" element={null} />
                <Route path="/production" element={null} />
                <Route path="/products" element={null} />
                <Route path="/stores" element={null} />
                <Route path="/vacancies" element={null} />
                <Route path="/contact" element={null} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
}
