import { Link } from "react-router-dom";

function Hero() {
    return (
        <section id="hero" className="hero">
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
