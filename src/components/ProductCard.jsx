import React, { useState, useRef } from "react";

// Add custom styles for dropdown active item and remove default arrow
const dropdownStyles = `
  .dropdown-item.active {
    background-color: #e5e7eb !important;
    color: #222 !important;
  }
  .dropdown-item:active {
    background-color: #e5e7eb !important;
    color: #222 !important;
  }
  .dropdown-toggle::after {
    display: none !important;
  }
`;

// Inject styles if not already present
if (typeof document !== "undefined" && !document.getElementById("dropdown-custom-styles")) {
  const style = document.createElement("style");
  style.id = "dropdown-custom-styles";
  style.innerHTML = dropdownStyles;
  document.head.appendChild(style);
}

const ProductCard = ({ product, onAddToCart }) => {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0]?.id || ""
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalDropdownOpen, setModalDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [magnifierActive, setMagnifierActive] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const dropdownRef = useRef(null);
  const modalDropdownRef = useRef(null);
  const imageRef = useRef(null);

  // Price range logic
  const price =
    product.price_min && product.price_max
      ? `$${product.price_min} - $${product.price_max}`
      : `$${product.price}`;

  // Rating logic
  const rating = product.rating?.rate || 0;
  const reviewCount = product.rating?.count || 0;

  // Availability
  const isAvailable = product.available !== false;

  // Variant dropdown
  const hasVariants =
    Array.isArray(product.variants) && product.variants.length > 0;

  // Get selected variant name
  const selectedVariantObj = hasVariants
    ? product.variants.find((v) => v.id === selectedVariant)
    : null;

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (modalDropdownRef.current && !modalDropdownRef.current.contains(e.target)) {
        setModalDropdownOpen(false);
      }
    }
    if (dropdownOpen || modalDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen, modalDropdownOpen]);

  return (
    <>
      <div className="card rounded-3 m-3 border-0 h-100 position-relative overflow-visible"
        style={{
          maxWidth: "220px",
          minHeight: "390px",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          boxShadow: "0 8px 24px -8px rgba(60,60,120,0.18), 0 -4px 16px -4px rgba(60,60,120,0.10)"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow = "0 16px 32px -8px rgba(60,60,120,0.22), 0 -12px 32px -8px rgba(60,60,120,0.18), 0 1.5px 8px 0 rgba(60,60,120,0.10)";
          // Show quicklook button
          const quicklookBtn = e.currentTarget.querySelector('#quicklook-btn');
          if (quicklookBtn) {
            quicklookBtn.style.opacity = "1";
            quicklookBtn.style.transform = "translateX(-50%) translateY(0)";
            quicklookBtn.style.pointerEvents = "auto";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 8px 24px -8px rgba(60,60,120,0.18), 0 -4px 16px -4px rgba(60,60,120,0.10)";
          // Hide quicklook button
          const quicklookBtn = e.currentTarget.querySelector('#quicklook-btn');
          if (quicklookBtn) {
            quicklookBtn.style.opacity = "0";
            quicklookBtn.style.transform = "translateX(-50%) translateY(20px)";
            quicklookBtn.style.pointerEvents = "none";
          }
        }}>
        <div className="position-relative">
          <img
            src={product.image}
            alt={product.title}
            className="card-img-top bg-white pt-2"
            style={{
              height: "160px",
              objectFit: "contain",
              borderTopLeftRadius: "12px",
              borderTopRightRadius: "12px",
            }}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/220x140?text=No+Image";
            }}
          />
          <button
            className="btn position-absolute start-50 bottom-0 translate-middle-x mb-2"
            style={{
              transition: "opacity 0.35s ease, transform 0.35s ease, backgroundColor 0.3s ease",
              transform: "translateX(-50%) translateY(20px)",
              opacity: "0",
              zIndex: 2,
              fontSize: "1rem",
              padding: "6px 24px",
              borderRadius: "8px",
              pointerEvents: "none",
              backgroundColor: "rgba(33, 37, 41, 0.5)",
              border: "none",
              color: "white"
            }}
            id="quicklook-btn"
            onClick={() => setModalOpen(true)}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "rgba(33, 37, 41, 0.8)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "rgba(33, 37, 41, 0.5)";
            }}
          >
            Quick Look
          </button>
        </div>
        <div className="card-body d-flex flex-column p-3" style={{ flex: 1 }}>
          <h6
            className="card-title fw-bold mb-1 text-truncate"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: "2.4em",
              whiteSpace: "normal",
            }}
            title={product.title}
          >
            {product.title}
          </h6>
          <div className="fw-bold mb-2 fs-5">
            {price}
          </div>
          <div className="d-flex align-items-center mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                width="18"
                height="18"
                viewBox="0 0 20 20"
                fill={i < Math.round(rating) ? "#222" : "#e5e7eb"}
                xmlns="http://www.w3.org/2000/svg"
                className="me-1"
              >
                <path d="M10 15.27L16.18 18l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 3.73L3.82 18z" />
              </svg>
            ))}
            <span className="ms-1 fw-medium text-dark fs-6">
              {reviewCount > 1000
                ? `${(reviewCount / 1000).toFixed(1)}K`
                : reviewCount}
            </span>
          </div>
          {hasVariants ? (
            <div className="dropdown mb-2" ref={dropdownRef}>
              <button
                className={`btn btn-outline-secondary w-100 text-start dropdown-toggle d-flex justify-content-between align-items-center${!isAvailable ? " disabled" : ""
                  }`}
                type="button"
                disabled={!isAvailable}
                onClick={() => isAvailable && setDropdownOpen((open) => !open)}
                aria-haspopup="listbox"
                aria-expanded={dropdownOpen}
              >
                <span>{selectedVariantObj?.name || "Select variant"}</span>
                <span className="ms-auto d-flex align-items-center">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="ms-1"
                  >
                    <path
                      d="M6 8l4 4 4-4"
                      stroke="#222"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
              <div
                className={`dropdown-menu w-100${dropdownOpen ? " show" : ""}`}
                style={{ maxHeight: "140px", overflowY: "auto" }}
                role="listbox"
              >
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    className={`dropdown-item${selectedVariant === variant.id ? " active" : ""
                      }${!isAvailable ? " disabled" : ""}`}
                    type="button"
                    onClick={() => {
                      if (isAvailable) {
                        setSelectedVariant(variant.id);
                        setDropdownOpen(false);
                      }
                    }}
                    role="option"
                    aria-selected={selectedVariant === variant.id}
                    disabled={!isAvailable}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-2 text-secondary fs-6">
              {product.variantLabel || "Default"}
            </div>
          )}
          <button
            className={`btn w-75 fw-bold rounded-2 mt-auto mx-auto d-block${isAvailable ? " btn-dark" : " btn-secondary"
              }`}
            disabled={!isAvailable}
            style={{ padding: "6px 0", fontSize: "1rem" }}
            onClick={onAddToCart}
          >
            {isAvailable ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>

      {/* Quick Look Modal */}
      {modalOpen && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setModalOpen(false);
            }
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '12px' }}>
              <div className="modal-header border-0 pb-0">
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalOpen(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-0">
                <div className="row g-0">
                  {/* Left Section - Product Image */}
                  <div className="col-md-4">
                    <div className="p-4 d-flex align-items-center justify-content-center position-relative" style={{ minHeight: '400px' }}>
                      <img
                        ref={imageRef}
                        src={product.image}
                        alt={product.title}
                        className="img-fluid"
                        style={{
                          maxHeight: '350px',
                          objectFit: 'contain',
                          cursor: magnifierActive ? 'none' : 'zoom-in'
                        }}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/300x400?text=No+Image";
                        }}
                        onLoad={(e) => {
                          const img = e.target;
                          setImageDimensions({
                            width: img.naturalWidth,
                            height: img.naturalHeight
                          });
                        }}
                        onMouseEnter={() => setMagnifierActive(true)}
                        onMouseLeave={() => setMagnifierActive(false)}
                        onMouseMove={(e) => {
                          if (imageRef.current) {
                            const rect = imageRef.current.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;
                            setMagnifierPosition({ x, y });
                          }
                        }}
                      />

                      {/* Magnifier */}
                      {magnifierActive && imageDimensions.width > 0 && (
                        <div
                          className="position-absolute border border-2 border-white shadow-lg rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: '120px',
                            height: '120px',
                            left: magnifierPosition.x - 60,
                            top: magnifierPosition.y - 60,
                            backgroundImage: `url(${product.image})`,
                            backgroundSize: `${imageDimensions.width}px ${imageDimensions.height}px`,
                            backgroundPosition: `-${magnifierPosition.x * 1.1}px -${magnifierPosition.y * 1.1}px`,
                            backgroundRepeat: 'no-repeat',
                            zIndex: 10,
                            pointerEvents: 'none'
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Right Section - Product Details */}
                  <div className="col-md-8">
                    <div className="p-4">
                      {/* Product Header */}
                      <div className="mb-3">
                        <h4 className="fw-bold mb-2">{product.title}</h4>
                      </div>

                      {/* Product Description */}
                      <div className="mb-3">
                        <p className="text-muted mb-2">
                          {product.description || 'Product description not available.'}
                        </p>
                      </div>

                      {/* Reviews and Engagement */}
                      <div className="mb-3">
                        <div className="d-flex align-items-center gap-3 mb-2">
                          <div className="d-flex align-items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                width="16"
                                height="16"
                                viewBox="0 0 20 20"
                                fill={i < Math.round(rating) ? "#000" : "#e5e7eb"}
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M10 15.27L16.18 18l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 3.73L3.82 18z" />
                              </svg>
                            ))}
                            <span className="ms-2 small">{reviewCount > 1000 ? `${(reviewCount / 1000).toFixed(1)}K` : reviewCount} reviews</span>
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="mb-4">
                        <h3 className="fw-bold mb-0">{price}</h3>
                      </div>

                      {/* Variant Selection */}
                      {hasVariants ? (
                        <div className="dropdown mb-3" ref={modalDropdownRef}>
                          <button
                            className={`btn btn-outline-secondary w-100 text-start dropdown-toggle d-flex justify-content-between align-items-center${!isAvailable ? " disabled" : ""
                              }`}
                            type="button"
                            disabled={!isAvailable}
                            onClick={() => isAvailable && setModalDropdownOpen((open) => !open)}
                            aria-haspopup="listbox"
                            aria-expanded={modalDropdownOpen}
                          >
                            <span>{selectedVariantObj?.name || "Select variant"}</span>
                            <span className="ms-auto d-flex align-items-center">
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="ms-1"
                              >
                                <path
                                  d="M6 8l4 4 4-4"
                                  stroke="#222"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                          </button>
                          <div
                            className={`dropdown-menu w-100${modalDropdownOpen ? " show" : ""}`}
                            style={{ maxHeight: "140px", overflowY: "auto" }}
                            role="listbox"
                          >
                            {product.variants.map((variant) => (
                              <button
                                key={variant.id}
                                className={`dropdown-item${selectedVariant === variant.id ? " active" : ""
                                  }${!isAvailable ? " disabled" : ""}`}
                                type="button"
                                onClick={() => {
                                  if (isAvailable) {
                                    setSelectedVariant(variant.id);
                                    setModalDropdownOpen(false);
                                  }
                                }}
                                role="option"
                                aria-selected={selectedVariant === variant.id}
                                disabled={!isAvailable}
                              >
                                {variant.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="mb-3 text-secondary fs-6">
                          {product.variantLabel || "Default"}
                        </div>
                      )}

                      {/* Action Section */}
                      <div className="d-flex flex-column gap-3">
                        {/* Add to Cart Button */}
                        <button
                          className="btn btn-danger w-100 fw-bold py-3"
                          onClick={() => {
                            if (onAddToCart) {
                              onAddToCart(product, quantity, selectedVariantObj);
                            }
                          }}
                          disabled={!isAvailable}
                        >
                          {isAvailable ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
