import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./CartPage.css";

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <span className="cart-empty-icon">🕯️</span>
          <h2>Корзина пуста</h2>
          <p>Добавьте ароматные свечи, чтобы начать</p>
          <Link to="/" className="cart-empty-link">Перейти в каталог</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1 className="page-title">Корзина</h1>
        <span className="cart-count">{itemCount} {itemCount === 1 ? "товар" : itemCount < 5 ? "товара" : "товаров"}</span>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item-image">
                <span className="cart-item-emoji">{item.emoji}</span>
              </div>
              <div className="cart-item-details">
                <h3 className="cart-item-name">{item.name}</h3>
                <p className="cart-item-volume">{item.volume} · Ароматическая свеча</p>
                <p className="cart-item-unit-price">{item.price.toLocaleString("ru-RU")} ₽ за шт.</p>
              </div>
              <div className="cart-item-controls">
                <div className="quantity-control">
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    aria-label="Уменьшить"
                  >
                    −
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    aria-label="Увеличить"
                  >
                    +
                  </button>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                  aria-label="Удалить"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="cart-item-total">
                {(item.price * item.quantity).toLocaleString("ru-RU")} ₽
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-header">
            <h3 className="summary-title">Итого</h3>
          </div>
          <div className="summary-details">
            <div className="summary-row">
              <span>Товары ({itemCount} шт.)</span>
              <span>{total.toLocaleString("ru-RU")} ₽</span>
            </div>
            <div className="summary-row">
              <span>Доставка</span>
              <span className="summary-free">Бесплатно</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-total">
              <span>К оплате</span>
              <span>{total.toLocaleString("ru-RU")} ₽</span>
            </div>
          </div>
          <Link to="/checkout" className="checkout-btn">
            Оформить заказ
          </Link>
          <div className="summary-benefits">
            <div className="benefit-item">
              <span className="benefit-icon">🎁</span>
              <span>Подарочная упаковка в комплекте</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">📦</span>
              <span>Бесплатная доставка</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
