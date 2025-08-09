import React, { useState, useRef } from "react";
import { RotateCcw, ArrowLeftCircle } from "lucide-react";

const cardStyle = {
  perspective: "1200px",
  maxWidth: 350,
  margin: "2rem auto",
  minHeight: 600,
};

const ProductCard = ({ product, onAddToCart }) => {
  const variants = product.variants || [
    { id: "default", name: "Default", available: product.available !== false },
  ];
  const [selectedVariant, setSelectedVariant] = useState(variants[0].id);
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef(null);
  // Store last valid pointer position inside card
  const lastPointer = useRef({ x: null, y: null });

  const isAvailable =
    product.available !== false &&
    variants.find((v) => v.id === selectedVariant)?.available !== false;

  // Optional: Add mouse motion effect for 3D tilt
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    // If pointer is outside, project to nearest card corner
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;
    if (y < 0) y = 0;
    if (y > rect.height) y = rect.height;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const maxTilt = 10;
    const normX = (x - centerX) / centerX;
    const normY = (y - centerY) / centerY;
    const rotateX = -maxTilt * Math.tanh(normY);
    const rotateY = maxTilt * Math.tanh(normX);
    if (isFlipped) {
      cardRef.current.style.transform = `rotateY(180deg) perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    } else {
      cardRef.current.style.transform = `rotateY(0deg) perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = isFlipped ? `rotateY(180deg)` : `rotateY(0deg)`;
  };

  // Ensure flip is immediate and disables tilt effect
  const handleFlip = () => {
    setIsFlipped(true);
    if (cardRef.current) {
      cardRef.current.style.transform = `rotateY(180deg)`;
    }
  };
  const handleUnflip = () => {
    setIsFlipped(false);
    if (cardRef.current) {
      cardRef.current.style.transform = `rotateY(0deg)`;
    }
  };

  // Custom dropdown for variants
  function VariantDropdown({ variants, selectedVariant, setSelectedVariant, disabled }) {
    const [open, setOpen] = useState(false);
    const handleSelect = (id) => {
      setSelectedVariant(id);
      setOpen(false);
    };
    return (
      <div className="variant-dropdown position-relative w-100" style={{ zIndex: 2 }}>
        <button
          type="button"
          className="form-select text-center"
          style={{ width: '100%', minWidth: 120, cursor: disabled ? 'not-allowed' : 'pointer' }}
          disabled={disabled}
          onClick={() => !disabled && setOpen((o) => !o)}
        >
          {variants.find(v => v.id === selectedVariant)?.name || "Select variant"}
        </button>
        {open && !disabled && (
          <div className="dropdown-menu show w-100" style={{ position: 'absolute', top: '100%', left: 0, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginTop: 2 }}>
            {variants.map(variant => (
              <button
                key={variant.id}
                className={`dropdown-item w-100 text-center variant-option${!variant.available ? ' disabled text-muted' : ''}`}
                style={{ padding: '8px 0', border: 'none', background: 'none', cursor: variant.available ? 'pointer' : 'not-allowed', transition: 'background 0.2s' }}
                disabled={!variant.available}
                onClick={() => variant.available && handleSelect(variant.id)}
              >
                {variant.name} {variant.available ? '' : '(Unavailable)'}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <div
        className="position-relative w-100 h-100"
        style={{
          transition: "transform 0.7s cubic-bezier(.03,.98,.52,.99)",
          transformStyle: "preserve-3d",
        }}
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Front Side */}
        <div
          className={`card shadow-lg border-0 position-absolute top-0 start-0 w-100 h-100 card-gradient ${
            isFlipped ? "d-none" : ""
          }`}
          style={{
            backfaceVisibility: "hidden",
            borderRadius: "1.25rem",
            boxShadow: "0 8px 32px rgba(60,60,120,0.15)",
            zIndex: 2,
            background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
          }}
        >
          {/* Flip Button */}
          <button
            type="button"
            className="btn btn-light position-absolute top-0 start-0 m-2 rounded-circle shadow d-flex align-items-center justify-content-center"
            style={{ width: 36, height: 36, zIndex: 3, padding: 0 }}
            onClick={handleFlip}
            aria-label="Flip card"
          >
            <RotateCcw size={22} strokeWidth={2.2} color="#6366f1" />
          </button>
          <img
            src={product.image}
            alt={product.title}
            className="card-img-top img-fluid"
            style={{
              height: "220px",
              objectFit: "cover",
              borderTopLeftRadius: "1.25rem",
              borderTopRightRadius: "1.25rem",
            }}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/350x220?text=No+Image";
            }}
          />
          <div className="card-body d-flex flex-column">
            <h5 className="card-title mb-3 text-center h4 text-truncate" title={product.title} style={{
              fontWeight: 800,
              fontSize: '1.25rem',
              letterSpacing: '0.01em',
              background: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 8px rgba(99,102,241,0.08)',
              wordBreak: 'break-word',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%'
            }}>
              {product.title}
            </h5>
            <span className="mb-3 text-primary text-center" style={{ fontWeight: 700, fontSize: '2rem', letterSpacing: '0.02em', background: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ${product.price}
            </span>
            <span className="d-flex flex-column align-items-center mb-4">
              <span className="d-flex align-items-center justify-content-center mb-2">
                {/* Render stars for rating */}
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    width="36"
                    height="36"
                    viewBox="0 0 20 20"
                    fill={i < Math.round(product.rating?.rate || 0) ? "#facc15" : "#e5e7eb"}
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ marginRight: 2 }}
                  >
                    <path d="M10 15.27L16.18 18l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 3.73L3.82 18z" />
                  </svg>
                ))}
              </span>
              <span className="badge rounded-pill bg-light text-primary px-3 py-1 shadow-sm" style={{ fontWeight: 500, fontSize: '0.95rem', marginTop: 2 }}>
                {product.rating?.count || 0} reviews
              </span>
            </span>
            <div className="mb-3 w-100 d-flex flex-column align-items-center justify-content-center" style={{ position: 'relative', zIndex: 2 }}>
              {variants.length > 1 ? (
                <VariantDropdown
                  variants={variants}
                  selectedVariant={selectedVariant}
                  setSelectedVariant={setSelectedVariant}
                  disabled={!isAvailable}
                />
              ) : (
                <span className="badge bg-light text-dark w-100 text-center">
                  {variants[0].name}
                </span>
              )}
            </div>
            <button
              className={`btn btn-gradient w-100 mt-auto fw-bold text-white shadow ${!isAvailable ? "disabled" : ""}`}
              disabled={!isAvailable}
              style={{
                background: "linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)",
                border: "none",
              }}
              onClick={onAddToCart}
            >
              {isAvailable ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>
        {/* Back Side */}
        <div
          className={`card shadow-lg border-0 position-absolute top-0 start-0 w-100 h-100 card-gradient ${
            !isFlipped ? "d-none" : ""
          }`}
          style={{
            backfaceVisibility: "hidden",
            borderRadius: "1.25rem",
            boxShadow: "0 8px 32px rgba(60,60,120,0.15)",
            transform: "rotateY(180deg)",
            zIndex: 1,
            background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
          }}
        >
          <button
            type="button"
            className="btn btn-light position-absolute top-0 start-0 m-2 rounded-circle shadow d-flex align-items-center justify-content-center"
            style={{ width: 36, height: 36, zIndex: 3, padding: 0 }}
            onClick={handleUnflip}
            aria-label="Unflip card"
          >
            <ArrowLeftCircle size={22} strokeWidth={2.2} color="#6366f1" />
          </button>
          <div className="card-body d-flex flex-column justify-content-center align-items-center text-center">
            <h5
              className="card-title mb-2 text-center"
              title={product.title}
              style={{
                fontWeight: 800,
                fontSize: '1.25rem',
                letterSpacing: '0.01em',
                background: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 8px rgba(99,102,241,0.08)',
                wordBreak: 'break-word',
                whiteSpace: 'normal',
                overflowWrap: 'anywhere',
                maxWidth: '100%',
              }}
            >
              {product.title}
            </h5>
            <div className="mb-3 text-secondary" style={{ minHeight: 60 }}>
              {product.description}
            </div>
            <button
              className={`btn btn-gradient w-100 mt-3 fw-bold text-white shadow ${
                !isAvailable ? "disabled" : ""
              }`}
              disabled={!isAvailable}
              style={{
                background: "linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)",
                border: "none",
              }}
              onClick={onAddToCart}
            >
              {isAvailable ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>
      </div>
      {/* Custom styles for 3D effect and gradient button */}
      <style>{`
        .card {
          transition: box-shadow 0.3s, background 0.3s;
        }
        .card:hover {
          box-shadow: 0 16px 48px rgba(60,60,120,0.25);
        }
        .btn-gradient {
          background: linear-gradient(90deg, #6366f1 0%, #60a5fa 100%) !important;
          color: #fff !important;
          border: none !important;
        }
        .btn-gradient:disabled {
          background: #a5b4fc !important;
          color: #e5e7eb !important;
        }
        .variant-option:not(:disabled):hover {
          background: #e0e7ff !important;
          color: #6366f1 !important;
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
