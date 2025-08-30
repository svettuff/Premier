import { Link } from "react-router-dom";
import Hero3D from "./Hero3D";

function Hero() {
    return (
        <section id="hero" className="hero">
            <Hero3D />

            <h1>Премʼєр</h1>
            <p>— смак, перевірений часом з 1995 року</p>

            <div className="hero-actions">
                <Link to="/about" className="btn btn--lg">
                    Дізнатись більше
                </Link>
            </div>
        </section>
    );
}

export default Hero;
