import { Link, useLocation } from "react-router-dom";

import logo from "./assets/logo.png";

function Header() {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <header className="header">
            <div className="container">
                <Link to="/" className="logo" aria-label="ПРЕМʼЄР — на головну">
                    <img src={logo} alt="ПРЕМʼЄР" />
                </Link>
                <nav className="nav">
                    <Link to="/about" className={isActive("/about") ? "active" : ""}>Про нас</Link>
                    <Link to="/production" className={isActive("/production") ? "active" : ""}>Виробництво</Link>
                    <Link to="/products" className={isActive("/products") ? "active" : ""}>Продукція</Link>
                    <Link to="/stores" className={isActive("/stores") ? "active" : ""}>Магазини</Link>
                    <Link to="/vacancies" className={isActive("/vacancies") ? "active" : ""}>Вакансії</Link>
                    <Link to="/contact" className={isActive("/contact") ? "active" : ""}>Контакти</Link>
                </nav>
            </div>
        </header>
    );
}

export default Header;
