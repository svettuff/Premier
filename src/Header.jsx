import { Link, useLocation } from "react-router-dom";

function Header() {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <header className="header">
            <div className="container">
                <Link to="/" className="logo">ПРЕМʼЄР</Link>
                <nav className="nav">
                    <Link to="/about" className={isActive("/about") ? "active" : ""}>про нас</Link>
                    <Link to="/products" className={isActive("/products") ? "active" : ""}>продукція</Link>
                    <Link to="/production" className={isActive("/production") ? "active" : ""}>виробництво</Link>
                    <Link to="/contact" className={isActive("/contact") ? "active" : ""}>контакти</Link>
                </nav>
            </div>
        </header>
    );
}

export default Header;
