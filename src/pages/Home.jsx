import ProductGrid from "../components/ProductGrid";
import { products, testimonials } from "../data/products";
import "./Home.css";

export default function Home() {
  return (
    <main className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg-glow" />
        <div className="hero-content">
          <div className="hero-top">
            <span className="hero-badge">
              <span className="badge-dot" />
              Ручная работа
            </span>
          </div>
          <h1 className="hero-title">
            <span className="title-brand">VZ</span>
            <span className="title-line" />
            <span className="title-main">Candle Atelier</span>
          </h1>
          <p className="hero-subtitle">
            Ароматические свечи премиум-класса. Каждый аромат — это история,
            рассказанная через ноты натурального воска и эфирных масел.
          </p>
          <div className="hero-features">
            <div className="hero-feature">
              <div className="feature-icon-wrap">
                <span className="feature-icon">🎁</span>
              </div>
              <span>Подарочная упаковка</span>
            </div>
            <div className="hero-feature">
              <div className="feature-icon-wrap">
                <span className="feature-icon">🕯️</span>
              </div>
              <span>Натуральный воск</span>
            </div>
            <div className="hero-feature">
              <div className="feature-icon-wrap">
                <span className="feature-icon">✨</span>
              </div>
              <span>Премиум ароматы</span>
            </div>
          </div>
          <a href="#catalog" className="hero-cta">
            Смотреть каталог
            <span className="cta-arrow">→</span>
          </a>
        </div>
      </section>

      {/* Products Section */}
      <section id="catalog" className="catalog-section">
        <div className="section-header">
          <span className="section-label">Коллекция</span>
          <h2 className="section-title">Наши ароматы</h2>
          <p className="section-subtitle">Выберите свой идеальный аромат</p>
        </div>
        <ProductGrid products={products} />
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="about-inner">
          <span className="section-label">О нас</span>
          <h2 className="section-title">Каждая свеча — произведение искусства</h2>
          <p className="about-text">
            Valentina Zaikina — это авторские ароматические свечи ручной работы.
            Мы используем только натуральный соевый воск и премиальные парфюмерные
            масла, чтобы создать неповторимую атмосферу уюта и роскоши в вашем доме.
          </p>
          <div className="about-stats">
            <div className="stat-item">
              <span className="stat-value">100%</span>
              <span className="stat-label">Натуральный воск</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">50ч</span>
              <span className="stat-label">Время горения</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">5+</span>
              <span className="stat-label">Уникальных ароматов</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="section-header">
          <span className="section-label">Отзывы</span>
          <h2 className="section-title">Что говорят клиенты</h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <div key={t.id} className="testimonial-card">
              <div className="testimonial-stars">
                {"★".repeat(t.rating)}
              </div>
              <p className="testimonial-text">{t.text}</p>
              <div className="testimonial-author">
                <div className="author-avatar">{t.name[0]}</div>
                <span className="testimonial-author-name">{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
