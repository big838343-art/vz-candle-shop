import { useState } from "react";
import { useCart } from "../context/CartContext";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div
      className="product-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="product-image">
        <div className="image-glow" />
        {product.image ? (
          <img src={product.image} alt={product.name} className="product-img" />
        ) : (
          <span className="product-emoji">{product.emoji}</span>
        )}
        <div className="product-volume-badge">{product.volume}</div>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-bottom">
          <div className="product-price-wrap">
            <span className="product-price">{product.price.toLocaleString("ru-RU")} ₽</span>
          </div>
          <button
            className={`add-btn ${added ? "added" : ""} ${hovered ? "hovered" : ""}`}
            onClick={handleAdd}
          >
            {added ? (
              <span className="btn-check">✓</span>
            ) : (
              "В корзину"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
