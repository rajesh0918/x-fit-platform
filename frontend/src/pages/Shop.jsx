import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProductImage } from "../data/productImages";

/* =========================================================
   X-FIT SHOP PRODUCTS
========================================================= */

const PRODUCTS = [
  {
    id: 1,
    name: "X-FIT Core Tee",
    category: "tshirts",
    categoryLabel: "T-Shirts",
    price: 799,
    rating: 4.5,
    reviews: 430,
    badge: "CORE",
    colors: ["Black", "White", "Red", "Blue"],
  },
  {
    id: 2,
    name: "X-FIT Elite Tee",
    category: "tshirts",
    categoryLabel: "T-Shirts",
    price: 899,
    rating: 4.6,
    reviews: 512,
    badge: "ELITE",
    colors: ["Black", "White", "Blue", "Graphite"],
  },
  {
    id: 3,
    name: "X-FIT Beast Tee",
    category: "tshirts",
    categoryLabel: "T-Shirts",
    price: 899,
    rating: 4.7,
    reviews: 1000,
    badge: "BEAST",
    colors: ["White", "Black", "Olive"],
  },
  {
    id: 4,
    name: "X-FIT Vertical Tee",
    category: "tshirts",
    categoryLabel: "T-Shirts",
    price: 799,
    rating: 4.5,
    reviews: 636,
    badge: "NEW",
    colors: ["Black", "White", "Blue"],
  },
  {
    id: 5,
    name: "X-FIT Training Tee",
    category: "tshirts",
    categoryLabel: "T-Shirts",
    price: 799,
    rating: 4.4,
    reviews: 398,
    badge: "TRAINING",
    colors: ["Graphite", "White", "Sand"],
  },

  {
    id: 6,
    name: "X-FIT Compression Pro",
    category: "compression",
    categoryLabel: "Compression",
    price: 999,
    rating: 4.8,
    reviews: 1200,
    badge: "BESTSELLER",
    colors: [
      "Black / Lime",
      "Black / Red",
      "Black / Blue",
      "Graphite",
    ],
  },
  {
    id: 7,
    name: "X-FIT Compression Max",
    category: "compression",
    categoryLabel: "Compression",
    price: 999,
    rating: 4.7,
    reviews: 856,
    badge: "NEW",
    colors: ["White / Black", "White / Blue", "Black"],
  },
  {
    id: 8,
    name: "X-FIT Compression Hybrid",
    category: "compression",
    categoryLabel: "Compression",
    price: 999,
    rating: 4.6,
    reviews: 742,
    badge: "HYBRID",
    colors: ["Red / Black", "Black", "White"],
  },
  {
    id: 9,
    name: "X-FIT Compression Elite",
    category: "compression",
    categoryLabel: "Compression",
    price: 999,
    rating: 4.8,
    reviews: 1100,
    badge: "ELITE",
    colors: ["Blue / Black", "Black", "Graphite"],
  },
  {
    id: 10,
    name: "X-FIT Compression Stealth",
    category: "compression",
    categoryLabel: "Compression",
    price: 999,
    rating: 4.7,
    reviews: 689,
    badge: "STEALTH",
    colors: ["Graphite", "Black", "Olive"],
  },

  {
    id: 11,
    name: "X-FIT Performance Hoodie",
    category: "hoodies",
    categoryLabel: "Hoodies",
    price: 1499,
    rating: 4.8,
    reviews: 912,
    badge: "PREMIUM",
    colors: ["Black", "Graphite", "Blue"],
  },

  {
    id: 12,
    name: "X-FIT Training Shorts",
    category: "shorts",
    categoryLabel: "Shorts",
    price: 699,
    rating: 4.6,
    reviews: 701,
    badge: "TRAINING",
    colors: ["Black", "Graphite", "Olive"],
  },

  {
    id: 13,
    name: "X-FIT Training Cap",
    category: "accessories",
    categoryLabel: "Accessories",
    price: 599,
    rating: 4.5,
    reviews: 310,
    badge: "NEW",
    colors: ["Black", "White", "Olive"],
  },

  {
    id: 14,
    name: "X-FIT Performance Shaker",
    category: "accessories",
    categoryLabel: "Accessories",
    price: 699,
    rating: 4.7,
    reviews: 540,
    badge: "BESTSELLER",
    colors: ["Black", "White"],
  },

  {
    id: 15,
    name: "X-FIT Gym Bag",
    category: "bags",
    categoryLabel: "Bags",
    price: 1299,
    rating: 4.8,
    reviews: 440,
    badge: "GEAR",
    colors: ["Black", "Graphite"],
  },

  {
    id: 16,
    name: "X-FIT Gym Towel",
    category: "accessories",
    categoryLabel: "Accessories",
    price: 399,
    rating: 4.5,
    reviews: 260,
    badge: "ESSENTIAL",
    colors: ["Black", "Graphite", "Lime"],
  },
];

/* =========================================================
   CATEGORY FILTERS
========================================================= */

const CATEGORIES = [
  {
    key: "all",
    label: "ALL",
  },
  {
    key: "tshirts",
    label: "T-SHIRTS",
  },
  {
    key: "compression",
    label: "COMPRESSION",
  },
  {
    key: "hoodies",
    label: "HOODIES",
  },
  {
    key: "shorts",
    label: "SHORTS",
  },
  {
    key: "accessories",
    label: "ACCESSORIES",
  },
  {
    key: "bags",
    label: "BAGS",
  },
];

/* =========================================================
   COLOR SWATCH
========================================================= */

function getColorValue(color) {
  const value = color.toLowerCase();

  if (value.includes("lime")) {
    return "#ccff00";
  }

  if (value.includes("red")) {
    return "#ef4444";
  }

  if (value.includes("blue")) {
    return "#2563eb";
  }

  if (value.includes("white")) {
    return "#f5f5f5";
  }

  if (value.includes("olive")) {
    return "#65713b";
  }

  if (value.includes("sand")) {
    return "#c8b99a";
  }

  if (value.includes("graphite")) {
    return "#555b5e";
  }

  if (value.includes("black")) {
    return "#090909";
  }

  return "#777";
}

/* =========================================================
   PRODUCT CARD
========================================================= */

function ProductCard({ product, onOpen }) {
  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-[24px]
        border
        border-white/10
        bg-[#0c0d0c]
        transition-all
        duration-500
        hover:-translate-y-1
        hover:border-[#ccff00]/35
        hover:shadow-[0_20px_70px_rgba(204,255,0,0.08)]
      "
    >
      {/* IMAGE */}
      <button
        type="button"
        onClick={() => onOpen(product.id)}
        className="block w-full text-left"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[#111]">
          <img
            src={getProductImage(product.id)}
            alt={product.name}
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-700
              group-hover:scale-[1.05]
            "
            loading="lazy"
          />

          {/* image gradient */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-t
              from-black/70
              via-transparent
              to-transparent
            "
          />

          {/* badge */}
          <div className="absolute left-4 top-4">
            <span
              className="
                inline-flex
                rounded-full
                border
                border-[#ccff00]/35
                bg-black/70
                px-3
                py-1.5
                text-[9px]
                font-black
                tracking-[0.2em]
                text-[#ccff00]
                backdrop-blur-md
              "
            >
              {product.badge}
            </span>
          </div>

          {/* product number */}
          <div className="absolute bottom-4 right-4">
            <span
              className="
                text-[10px]
                font-bold
                tracking-[0.2em]
                text-white/50
              "
            >
              XF-{String(product.id).padStart(2, "0")}
            </span>
          </div>
        </div>
      </button>

      {/* CONTENT */}
      <div className="p-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p
            className="
              text-[9px]
              font-bold
              uppercase
              tracking-[0.22em]
              text-[#858a7d]
            "
          >
            MEN • {product.categoryLabel}
          </p>

          <div className="flex items-center gap-1 text-[11px]">
            <span className="text-[#ccff00]">★</span>
            <span className="text-white">{product.rating}</span>
            <span className="text-[#686d64]">
              ({product.reviews})
            </span>
          </div>
        </div>

        <h3 className="text-lg font-black tracking-tight text-white">
          {product.name}
        </h3>

        <div className="mt-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xl font-black text-white">
              ₹{product.price.toLocaleString("en-IN")}
            </p>

            <div className="mt-2 flex items-center gap-1.5">
              {product.colors.slice(0, 5).map((color) => (
                <span
                  key={color}
                  title={color}
                  className="h-3.5 w-3.5 rounded-full border border-white/30"
                  style={{
                    background: getColorValue(color),
                  }}
                />
              ))}

              {product.colors.length > 5 && (
                <span className="ml-1 text-[9px] text-white/40">
                  +{product.colors.length - 5}
                </span>
              )}
            </div>
          </div>

          {/* VIEW PRODUCT */}
          <button
            type="button"
            onClick={() => onOpen(product.id)}
            className="
              shrink-0
              rounded-xl
              border
              border-[#ccff00]/50
              px-4
              py-3
              text-[10px]
              font-black
              tracking-[0.12em]
              text-[#ccff00]
              transition
              hover:bg-[#ccff00]
              hover:text-black
            "
          >
            VIEW PRODUCT →
          </button>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   HERO FEATURED PRODUCT
========================================================= */

function FeaturedProduct({ product, onOpen }) {
  return (
    <section
      className="
        relative
        overflow-hidden
        rounded-[32px]
        border
        border-[#ccff00]/15
        bg-[#0a0b0a]
      "
    >
      {/* background glow */}
      <div
        className="
          pointer-events-none
          absolute
          -left-40
          top-1/2
          h-[500px]
          w-[500px]
          -translate-y-1/2
          rounded-full
          bg-[#ccff00]/8
          blur-[120px]
        "
      />

      <div className="grid min-h-[440px] lg:grid-cols-2">
        {/* TEXT */}
        <div className="relative z-10 flex flex-col justify-center p-8 md:p-12 lg:p-16">
          <div className="mb-5">
            <span
              className="
                inline-flex
                rounded-full
                border
                border-[#ccff00]/30
                bg-[#ccff00]/5
                px-4
                py-2
                text-[9px]
                font-black
                tracking-[0.25em]
                text-[#ccff00]
              "
            >
              X-FIT PERFORMANCE SERIES
            </span>
          </div>

          <p className="text-[10px] font-bold tracking-[0.3em] text-[#777c72]">
            FEATURED / 01
          </p>

          <h2
            className="
              mt-3
              max-w-xl
              text-4xl
              font-black
              uppercase
              leading-[0.9]
              tracking-[-0.05em]
              text-white
              md:text-6xl
            "
          >
            {product.name}
          </h2>

          <p className="mt-5 max-w-lg text-sm leading-7 text-[#8c9186]">
            Engineered compression performance for high-intensity
            training. Built to move with you through every rep,
            sprint and recovery session.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-5">
            <div>
              <p className="text-3xl font-black text-[#ccff00]">
                ₹{product.price.toLocaleString("en-IN")}
              </p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-[#696e65]">
                Performance fit
              </p>
            </div>

            <button
              type="button"
              onClick={() => onOpen(product.id)}
              className="
                rounded-full
                bg-[#ccff00]
                px-7
                py-4
                text-[10px]
                font-black
                tracking-[0.16em]
                text-black
                transition
                hover:scale-[1.03]
              "
            >
              EXPLORE PRODUCT →
            </button>
          </div>
        </div>

        {/* IMAGE */}
        <button
          type="button"
          onClick={() => onOpen(product.id)}
          className="
            relative
            min-h-[330px]
            overflow-hidden
            text-left
            lg:min-h-full
          "
        >
          <img
            src={getProductImage(product.id)}
            alt={product.name}
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
              transition-transform
              duration-1000
              hover:scale-[1.04]
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-[#0a0b0a]
              via-transparent
              to-transparent
              lg:from-[#0a0b0a]
            "
          />

          <div className="absolute bottom-6 right-6">
            <span
              className="
                rounded-full
                border
                border-white/15
                bg-black/60
                px-4
                py-2
                text-[9px]
                font-bold
                tracking-[0.2em]
                text-white/70
                backdrop-blur-md
              "
            >
              VIEW DETAILS
            </span>
          </div>
        </button>
      </div>
    </section>
  );
}

/* =========================================================
   MAIN SHOP
========================================================= */

export default function Shop() {
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [cartCount, setCartCount] = useState(0);

  /* -------------------------------------------------------
     CART COUNT
  ------------------------------------------------------- */

  const updateCartCount = () => {
    try {
      const cart = JSON.parse(
        localStorage.getItem("xfit_cart") || "[]"
      );

      const count = cart.reduce(
        (total, item) =>
          total + Number(item.quantity || 0),
        0
      );

      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();

    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener(
      "xfit-cart-updated",
      handleCartUpdate
    );

    window.addEventListener(
      "storage",
      handleCartUpdate
    );

    return () => {
      window.removeEventListener(
        "xfit-cart-updated",
        handleCartUpdate
      );

      window.removeEventListener(
        "storage",
        handleCartUpdate
      );
    };
  }, []);

  /* -------------------------------------------------------
     FILTER PRODUCTS
  ------------------------------------------------------- */

  const filteredProducts = useMemo(() => {
    let result =
      activeCategory === "all"
        ? [...PRODUCTS]
        : PRODUCTS.filter(
            (product) =>
              product.category === activeCategory
          );

    if (sortBy === "price-low") {
      result.sort(
        (a, b) => a.price - b.price
      );
    }

    if (sortBy === "price-high") {
      result.sort(
        (a, b) => b.price - a.price
      );
    }

    if (sortBy === "rating") {
      result.sort(
        (a, b) => b.rating - a.rating
      );
    }

    if (sortBy === "newest") {
      result.sort(
        (a, b) => b.id - a.id
      );
    }

    return result;
  }, [activeCategory, sortBy]);

  /* -------------------------------------------------------
     OPEN PRODUCT
  ------------------------------------------------------- */

  const openProduct = (productId) => {
    navigate(`/shop/product/${productId}`);
  };

  /* -------------------------------------------------------
     CART
  ------------------------------------------------------- */

  const openCart = () => {
    navigate("/cart");
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050505] text-white">
      {/* ===================================================
          BACKGROUND
      =================================================== */}

      <div className="pointer-events-none fixed inset-0 z-0">
        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_20%_10%,rgba(204,255,0,0.055),transparent_28%),radial-gradient(circle_at_85%_30%,rgba(0,220,255,0.035),transparent_24%),#050505]
          "
        />

        <div
          className="
            absolute
            left-0
            top-[30%]
            h-[500px]
            w-[500px]
            rounded-full
            bg-[#ccff00]/[0.025]
            blur-[140px]
          "
        />

        <div
          className="
            absolute
            right-0
            top-[65%]
            h-[500px]
            w-[500px]
            rounded-full
            bg-cyan-400/[0.02]
            blur-[140px]
          "
        />
      </div>

      {/* ===================================================
          NAVIGATION
      =================================================== */}

      <nav
        className="
          fixed
          left-0
          right-0
          top-0
          z-50
          border-b
          border-white/5
          bg-black/70
          backdrop-blur-2xl
        "
      >
        <div
          className="
            mx-auto
            flex
            h-20
            max-w-[1500px]
            items-center
            justify-between
            px-5
            md:px-10
          "
        >
          {/* LOGO */}

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="
              text-3xl
              font-black
              tracking-[-0.07em]
              text-[#ccff00]
              transition
              hover:opacity-80
              md:text-4xl
            "
          >
            X-FIT
          </button>

          {/* NAV LINKS */}

          <div className="hidden items-center gap-8 lg:flex">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-white/50
                transition
                hover:text-[#ccff00]
              "
            >
              Dashboard
            </button>

            <button
              type="button"
              onClick={() => navigate("/workout-plan")}
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-white/50
                transition
                hover:text-[#ccff00]
              "
            >
              Training
            </button>

            <button
              type="button"
              className="
                text-[10px]
                font-black
                uppercase
                tracking-[0.18em]
                text-[#ccff00]
              "
            >
              Shop
            </button>

            <button
              type="button"
              onClick={() => navigate("/membership")}
              className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-white/50
                transition
                hover:text-[#ccff00]
              "
            >
              Membership
            </button>
          </div>

          {/* CART */}

          <button
            type="button"
            onClick={openCart}
            className="
              relative
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              border
              border-white/10
              bg-white/[0.03]
              transition
              hover:border-[#ccff00]/40
              hover:bg-[#ccff00]/5
            "
            aria-label="Open cart"
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="text-white"
            >
              <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 8H6" />
              <circle cx="10" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>

            {cartCount > 0 && (
              <span
                className="
                  absolute
                  -right-1
                  -top-1
                  flex
                  h-5
                  min-w-5
                  items-center
                  justify-center
                  rounded-full
                  bg-[#ccff00]
                  px-1
                  text-[9px]
                  font-black
                  text-black
                "
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="relative z-10 mx-auto max-w-[1500px] px-5 pb-24 pt-32 md:px-10">
        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <section className="mb-10">
          <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
            <div>
              <p
                className="
                  text-[10px]
                  font-bold
                  tracking-[0.32em]
                  text-[#ccff00]
                "
              >
                X-FIT // PERFORMANCE EQUIPMENT
              </p>

              <h1
                className="
                  mt-4
                  text-5xl
                  font-black
                  uppercase
                  leading-[0.9]
                  tracking-[-0.055em]
                  text-white
                  md:text-7xl
                "
              >
                WEAR
                <br />
                <span className="text-[#ccff00]">
                  YOUR DISCIPLINE.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#81867c] md:text-base">
                Performance apparel and training gear engineered
                for athletes who take every session seriously.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/[0.025]
                  px-5
                  py-4
                "
              >
                <p className="text-[9px] font-bold tracking-[0.2em] text-[#686d64]">
                  PRODUCTS
                </p>

                <p className="mt-1 text-2xl font-black text-white">
                  {PRODUCTS.length}
                </p>
              </div>

              <div
                className="
                  rounded-2xl
                  border
                  border-[#ccff00]/15
                  bg-[#ccff00]/[0.035]
                  px-5
                  py-4
                "
              >
                <p className="text-[9px] font-bold tracking-[0.2em] text-[#686d64]">
                  CART
                </p>

                <p className="mt-1 text-2xl font-black text-[#ccff00]">
                  {cartCount}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            FEATURED PRODUCT
        ================================================= */}

        <FeaturedProduct
          product={PRODUCTS.find(
            (product) => product.id === 6
          )}
          onOpen={openProduct}
        />

        {/* =================================================
            CATEGORY FILTER
        ================================================= */}

        <section className="mt-12">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((category) => {
                const active =
                  activeCategory === category.key;

                return (
                  <button
                    key={category.key}
                    type="button"
                    onClick={() =>
                      setActiveCategory(category.key)
                    }
                    className={`
                      rounded-full
                      border
                      px-5
                      py-3
                      text-[9px]
                      font-black
                      tracking-[0.17em]
                      transition
                      ${
                        active
                          ? "border-[#ccff00] bg-[#ccff00] text-black"
                          : "border-white/10 bg-white/[0.025] text-white/55 hover:border-[#ccff00]/30 hover:text-[#ccff00]"
                      }
                    `}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>

            {/* SORT */}

            <div
              className="
                flex
                items-center
                gap-3
                self-start
                rounded-full
                border
                border-white/10
                bg-white/[0.025]
                px-5
                py-2
              "
            >
              <span className="text-[9px] font-bold tracking-[0.18em] text-[#686d64]">
                SORT BY
              </span>

              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value)
                }
                className="
                  cursor-pointer
                  appearance-none
                  bg-transparent
                  text-[10px]
                  font-black
                  tracking-[0.12em]
                  text-white
                  outline-none
                "
              >
                <option
                  value="newest"
                  className="bg-[#111]"
                >
                  NEWEST
                </option>

                <option
                  value="price-low"
                  className="bg-[#111]"
                >
                  PRICE: LOW → HIGH
                </option>

                <option
                  value="price-high"
                  className="bg-[#111]"
                >
                  PRICE: HIGH → LOW
                </option>

                <option
                  value="rating"
                  className="bg-[#111]"
                >
                  TOP RATED
                </option>
              </select>
            </div>
          </div>
        </section>

        {/* =================================================
            PRODUCT COUNT
        ================================================= */}

        <div className="mt-10 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-[0.25em] text-[#686d64]">
              X-FIT CATALOG
            </p>

            <p className="mt-2 text-sm text-white/50">
              Showing{" "}
              <span className="font-bold text-white">
                {filteredProducts.length}
              </span>{" "}
              products
            </p>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="h-1 w-1 rounded-full bg-[#ccff00]" />
            <span className="text-[9px] font-bold tracking-[0.2em] text-[#686d64]">
              PERFORMANCE GEAR
            </span>
          </div>
        </div>

        {/* =================================================
            PRODUCT GRID
        ================================================= */}

        {filteredProducts.length > 0 ? (
          <section
            className="
              mt-7
              grid
              grid-cols-1
              gap-5
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
            "
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpen={openProduct}
              />
            ))}
          </section>
        ) : (
          <section
            className="
              mt-10
              rounded-[28px]
              border
              border-white/10
              bg-white/[0.025]
              p-16
              text-center
            "
          >
            <p className="text-3xl font-black">
              NO PRODUCTS FOUND
            </p>

            <p className="mt-3 text-sm text-white/40">
              Try another category.
            </p>

            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className="
                mt-7
                rounded-full
                bg-[#ccff00]
                px-7
                py-4
                text-[10px]
                font-black
                tracking-[0.15em]
                text-black
              "
            >
              VIEW ALL PRODUCTS
            </button>
          </section>
        )}

        {/* =================================================
            BOTTOM CTA
        ================================================= */}

        <section
          className="
            relative
            mt-20
            overflow-hidden
            rounded-[32px]
            border
            border-[#ccff00]/15
            bg-[#0a0b0a]
            p-8
            md:p-14
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              right-[-150px]
              top-1/2
              h-[400px]
              w-[400px]
              -translate-y-1/2
              rounded-full
              bg-[#ccff00]/8
              blur-[120px]
            "
          />

          <div className="relative z-10 max-w-3xl">
            <p className="text-[10px] font-bold tracking-[0.3em] text-[#ccff00]">
              X-FIT // BUILT FOR THE SESSION
            </p>

            <h2
              className="
                mt-4
                text-4xl
                font-black
                uppercase
                leading-[0.95]
                tracking-[-0.05em]
                md:text-6xl
              "
            >
              TRAIN HARD.
              <br />
              <span className="text-[#ccff00]">
                WEAR THE STANDARD.
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-[#7f847a]">
              Complete your X-FIT setup with performance apparel
              engineered around movement, comfort and training
              intensity.
            </p>

            <button
              type="button"
              onClick={() =>
                setActiveCategory("compression")
              }
              className="
                mt-7
                rounded-full
                bg-[#ccff00]
                px-7
                py-4
                text-[10px]
                font-black
                tracking-[0.16em]
                text-black
                transition
                hover:scale-[1.03]
              "
            >
              EXPLORE COMPRESSION →
            </button>
          </div>
        </section>
      </main>

      {/* ===================================================
          FOOTER
      =================================================== */}

      <footer className="relative z-10 border-t border-white/5">
        <div
          className="
            mx-auto
            flex
            max-w-[1500px]
            flex-col
            gap-4
            px-5
            py-8
            md:flex-row
            md:items-center
            md:justify-between
            md:px-10
          "
        >
          <div>
            <p className="text-xl font-black tracking-[-0.05em] text-[#ccff00]">
              X-FIT
            </p>

            <p className="mt-1 text-[9px] font-bold tracking-[0.2em] text-[#555a52]">
              ATHLETE PERFORMANCE OPERATING SYSTEM
            </p>
          </div>

          <p className="text-[9px] font-bold tracking-[0.18em] text-[#555a52]">
            PERFORMANCE // DISCIPLINE // PROGRESS
          </p>
        </div>
      </footer>
    </div>
  );
}