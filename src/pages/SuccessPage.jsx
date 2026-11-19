import { Link } from "react-router-dom";
import "./SuccessPage.css";

export default function SuccessPage() {
  return (
    <div className="success-page">
      <div className="success-content">
        <div className="success-icon-wrap">
          <span className="success-icon">✓</span>
        </div>
        <h1>Заказ оформлен!</h1>
        <p>
          Спасибо за покупку. Мы свяжемся с вами в ближайшее время для
          подтверждения заказа.
        </p>
        <div className="success-details">
          <div className="detail-item">
            <span className="detail-icon">🎁</span>
            <div>
              <strong>Подарочная упаковка</strong>
              <span>уже в комплекте</span>
            </div>
          </div>
          <div className="detail-item">
            <span className="detail-icon">📦</span>
            <div>
              <strong>Доставка</strong>
              <span>бесплатно</span>
            </div>
          </div>
        </div>
        <Link to="/" className="success-link">
          Вернуться в каталог
          <span className="link-arrow">→</span>
        </Link>
      </div>
    </div>
  );
}
