import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-logo">VZ</span>
            <p className="footer-tagline">Candle Atelier — Scent of Luxury</p>
          </div>
          <div className="footer-divider" />
          <div className="footer-info">
            <p className="footer-copy">© {new Date().getFullYear()} Valentina Zaikina. Все права защищены.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
