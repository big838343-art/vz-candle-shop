import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { sendToTelegram } from "../lib/telegram";
import "./CheckoutPage.css";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    comment: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Введите имя";
    if (!formData.phone.trim()) newErrors.phone = "Введите телефон";
    else if (formData.phone.trim().length < 5)
      newErrors.phone = "Введите корректный номер";
    if (!formData.address.trim()) newErrors.address = "Введите адрес доставки";
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    const orderData = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      comment: formData.comment,
      items: items.map((item) => ({
        name: item.name,
        volume: item.volume,
        price: item.price,
        quantity: item.quantity,
      })),
      total,
    };

    await sendToTelegram(orderData);

    clearCart();
    navigate("/success");
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (formErrors[e.target.name]) {
      setFormErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="checkout-page">
      <h1 className="page-title">Оформление заказа</h1>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2 className="form-section-title">
              <span className="section-number">01</span>
              Контактные данные
            </h2>
            <div className="form-group">
              <label htmlFor="name">Имя *</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Как к вам обращаться?"
                className={formErrors.name ? "input-error" : ""}
              />
              {formErrors.name && <span className="error-text">{formErrors.name}</span>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Телефон *</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+7 (___) ___-__-__"
                  className={formErrors.phone ? "input-error" : ""}
                />
                {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="form-section-title">
              <span className="section-number">02</span>
              Доставка
            </h2>
            <div className="form-group">
              <label htmlFor="address">Адрес доставки *</label>
              <input
                id="address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Город, улица, дом, квартира"
                className={formErrors.address ? "input-error" : ""}
              />
              {formErrors.address && <span className="error-text">{formErrors.address}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="comment">Комментарий к заказу</label>
              <textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                placeholder="Пожелания к заказу, удобное время доставки..."
                rows={3}
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? (
              <span className="submit-spinner">
                <svg className="spinner" viewBox="0 0 24 24" width="20" height="20">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="31.4 31.4" />
                </svg>
                Отправка...
              </span>
            ) : (
              `Подтвердить заказ · ${total.toLocaleString("ru-RU")} ₽`
            )}
          </button>
          <p className="form-note">
            Мы свяжемся с вами для подтверждения заказа
          </p>
        </form>

        <div className="checkout-summary">
          <h3 className="summary-title">Ваш заказ</h3>
          <div className="summary-items">
            {items.map((item) => (
              <div key={item.id} className="summary-item">
                <div className="summary-item-visual">
                  <span>{item.emoji}</span>
                  <span className="summary-item-qty-badge">{item.quantity}</span>
                </div>
                <div className="summary-item-info">
                  <span className="summary-item-name">{item.name}</span>
                  <span className="summary-item-volume">{item.volume}</span>
                </div>
                <span className="summary-item-price">
                  {(item.price * item.quantity).toLocaleString("ru-RU")} ₽
                </span>
              </div>
            ))}
          </div>
          <div className="summary-divider" />
          <div className="summary-totals">
            <div className="summary-row">
              <span>Товары</span>
              <span>{total.toLocaleString("ru-RU")} ₽</span>
            </div>
            <div className="summary-row">
              <span>Доставка</span>
              <span className="summary-free">Бесплатно</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-total-row">
              <span>Итого</span>
              <span>{total.toLocaleString("ru-RU")} ₽</span>
            </div>
          </div>
          <div className="summary-benefits">
            <div className="benefit-item">
              <span className="benefit-icon">🎁</span>
              <span>Подарочная упаковка</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🕯️</span>
              <span>Ручная работа</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
