function Contact() {
    return (
        <section id="contact" className="section">
            <h2>Контакты</h2>
            <p>Свяжитесь с нами:</p>
            <ul>
                <li>📞 Телефон: +2 (000) 123-45-67</li>
                <li>📧 Email: info@company.ru</li>
                <li>📍 Адрес: г. Киев, ул. Примерная, д. 1</li>
            </ul>
            <form>
                <input type="text" placeholder="Ваше имя" required />
                <input type="email" placeholder="Email" required />
                <textarea placeholder="Сообщение" required></textarea>
                <button type="submit">Отправить</button>
            </form>
        </section>
    );
}

export default Contact;
