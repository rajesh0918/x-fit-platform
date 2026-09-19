import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import CinematicBackground from "../components/futuristic/CinematicBackground";
import { getProductImage } from "../data/productImages";
import { getProductVariantImage } from "../data/productVariantImages";


/* =========================================================
   X-FIT PRODUCTS
========================================================= */

const PRODUCTS = [

  {
    id: 1,
    name: "X-FIT Core Tee",
    category: "T-Shirts",
    price: 799,
    description: "Minimal. Bold. Unstoppable.",
    material: "Premium cotton blend",
    fit: "Regular fit",
    colors: [
      "Black",
      "White",
      "Olive",
    ],
    colorClasses: [
      "bg-black",
      "bg-white",
      "bg-[#59604a]",
    ],
    features: [
      "Soft-touch fabric",
      "Breathable",
      "Everyday training",
      "Durable print",
    ],
  },


  {
    id: 2,
    name: "X-FIT Elite Tee",
    category: "T-Shirts",
    price: 899,
    description: "Train Different.",
    material: "Performance dry-fit fabric",
    fit: "Athletic fit",
    colors: [
      "White",
      "Black",
      "Olive",
    ],
    colorClasses: [
      "bg-white",
      "bg-black",
      "bg-[#59604a]",
    ],
    features: [
      "Quick-dry",
      "Sweat-wicking",
      "Stretch movement",
      "Lightweight",
    ],
  },


  {
    id: 3,
    name: "X-FIT Beast Tee",
    category: "T-Shirts",
    price: 899,
    description: "Unleash Your Potential.",
    material: "Performance polyester blend",
    fit: "Athletic fit",
    colors: [
      "Black",
      "Red",
      "White",
    ],
    colorClasses: [
      "bg-black",
      "bg-red-600",
      "bg-white",
    ],
    features: [
      "Breathable",
      "Quick-dry",
      "4-way movement",
      "Training focused",
    ],
  },


  {
    id: 4,
    name: "X-FIT Vertical Tee",
    category: "T-Shirts",
    price: 799,
    description: "Discipline Looks Good.",
    material: "Premium stretch cotton",
    fit: "Regular fit",
    colors: [
      "Black",
      "Graphite",
    ],
    colorClasses: [
      "bg-black",
      "bg-[#555]",
    ],
    features: [
      "Soft fabric",
      "Breathable",
      "Flexible",
      "Easy care",
    ],
  },


  {
    id: 5,
    name: "X-FIT Training Tee",
    category: "T-Shirts",
    price: 799,
    description: "Comfort Meets Performance.",
    material: "Lightweight performance fabric",
    fit: "Training fit",
    colors: [
      "Black",
      "Blue",
      "White",
    ],
    colorClasses: [
      "bg-black",
      "bg-blue-600",
      "bg-white",
    ],
    features: [
      "Lightweight",
      "Quick-dry",
      "Breathable",
      "Flexible",
    ],
  },


  /* =======================================================
     COMPRESSION COLLECTION
  ======================================================= */

  {
    id: 6,
    name: "X-FIT Compression Pro",
    category: "Compression",
    price: 999,
    description: "Support. Stability. Strength.",
    material: "88% Polyester / 12% Elastane",
    fit: "Performance compression fit",
    colors: [
      "Black/Lime",
      "Black/Red",
      "Black/Blue",
      "Graphite",
    ],
    colorClasses: [
      "bg-black",
      "bg-red-600",
      "bg-blue-600",
      "bg-[#555]",
    ],
    features: [
      "4-way stretch",
      "Sweat-wicking",
      "Quick-dry",
      "Flatlock seams",
      "Breathable panels",
      "Reduced chafing",
    ],
  },


  {
    id: 7,
    name: "X-FIT Compression Max",
    category: "Compression",
    price: 999,
    description: "Move Better. Perform Higher.",
    material: "Performance polyester-elastane blend",
    fit: "Compression fit",
    colors: [
      "White",
      "Black",
      "Blue",
    ],
    colorClasses: [
      "bg-white",
      "bg-black",
      "bg-blue-600",
    ],
    features: [
      "4-way stretch",
      "Quick-dry",
      "Breathable",
      "Athletic support",
    ],
  },


  {
    id: 8,
    name: "X-FIT Compression Hybrid",
    category: "Compression",
    price: 999,
    description: "Built for Every Rep.",
    material: "Lightweight performance blend",
    fit: "Compression fit",
    colors: [
      "Red",
      "Black",
      "White",
    ],
    colorClasses: [
      "bg-red-600",
      "bg-black",
      "bg-white",
    ],
    features: [
      "Sweat-wicking",
      "Quick-dry",
      "Flexible",
      "Lightweight",
    ],
  },


  {
    id: 9,
    name: "X-FIT Compression Elite",
    category: "Compression",
    price: 999,
    description: "Train Harder. Recover Faster.",
    material: "Premium technical stretch fabric",
    fit: "Compression fit",
    colors: [
      "Blue",
      "Black",
      "Graphite",
    ],
    colorClasses: [
      "bg-blue-700",
      "bg-black",
      "bg-[#555]",
    ],
    features: [
      "4-way stretch",
      "Breathable",
      "Quick-dry",
      "Performance fit",
    ],
  },


  {
    id: 10,
    name: "X-FIT Compression Stealth",
    category: "Compression",
    price: 999,
    description: "Less Distraction. More Progress.",
    material: "Technical performance fabric",
    fit: "Compression fit",
    colors: [
      "Graphite",
      "Black",
      "Olive",
    ],
    colorClasses: [
      "bg-[#555]",
      "bg-black",
      "bg-[#59604a]",
    ],
    features: [
      "Sweat-wicking",
      "4-way stretch",
      "Quick-dry",
      "Lightweight",
    ],
  },


  {
    id: 11,
    name: "X-FIT Performance Hoodie",
    category: "Hoodies",
    price: 1499,
    description: "Stay Consistent.",
    material: "Cotton-poly fleece",
    fit: "Relaxed athletic fit",
    colors: [
      "Black",
      "White",
      "Olive",
    ],
    colorClasses: [
      "bg-black",
      "bg-white",
      "bg-[#59604a]",
    ],
    features: [
      "Warm fleece",
      "Soft interior",
      "Durable",
      "Training/lifestyle",
    ],
  },


  {
    id: 12,
    name: "X-FIT Training Shorts",
    category: "Shorts",
    price: 699,
    description: "Built for Movement.",
    material: "Lightweight stretch performance fabric",
    fit: "Training fit",
    colors: [
      "Black",
      "Graphite",
      "Red",
    ],
    colorClasses: [
      "bg-black",
      "bg-[#555]",
      "bg-red-600",
    ],
    features: [
      "Lightweight",
      "Quick-dry",
      "Flexible",
      "Training ready",
    ],
  },


  {
    id: 13,
    name: "X-FIT Training Cap",
    category: "Accessories",
    price: 599,
    description: "Rep the Progress.",
    material: "Breathable cotton twill",
    fit: "Adjustable",
    colors: [
      "Black",
      "White",
      "Graphite",
    ],
    colorClasses: [
      "bg-black",
      "bg-white",
      "bg-[#555]",
    ],
    features: [
      "Adjustable strap",
      "Breathable",
      "Lightweight",
      "Everyday wear",
    ],
  },


  {
    id: 14,
    name: "X-FIT Performance Shaker",
    category: "Accessories",
    price: 699,
    description: "Fuel Your Goals.",
    material: "BPA-free performance plastic",
    fit: "700 ml",
    colors: [
      "Black",
      "White",
      "Graphite",
    ],
    colorClasses: [
      "bg-black",
      "bg-white",
      "bg-[#555]",
    ],
    features: [
      "Leak resistant",
      "Mixing grid",
      "Easy clean",
      "Gym ready",
    ],
  },


  {
    id: 15,
    name: "X-FIT Gym Bag",
    category: "Bags",
    price: 1299,
    description: "Carry Your Discipline.",
    material: "Durable polyester",
    fit: "Training duffel",
    colors: [
      "Black",
      "Graphite",
    ],
    colorClasses: [
      "bg-black",
      "bg-[#555]",
    ],
    features: [
      "Large main compartment",
      "Shoe section",
      "Durable handles",
      "Gym ready",
    ],
  },


  {
    id: 16,
    name: "X-FIT Gym Towel",
    category: "Accessories",
    price: 399,
    description: "For a Cleaner Tomorrow.",
    material: "Soft absorbent microfiber",
    fit: "Standard",
    colors: [
      "Black",
      "White",
      "Graphite",
    ],
    colorClasses: [
      "bg-black",
      "bg-white",
      "bg-[#555]",
    ],
    features: [
      "Absorbent",
      "Quick-dry",
      "Soft",
      "Compact",
    ],
  },

];


/* =========================================================
   PRODUCT DETAILS PAGE
========================================================= */

function ProductDetails() {

  const navigate = useNavigate();

  const { id } = useParams();


  /* =======================================================
     FIND PRODUCT
  ======================================================= */

  const product = useMemo(

    () =>

      PRODUCTS.find(
        (item) =>
          item.id ===
          Number(id)
      ) || PRODUCTS[0],

    [id]

  );


  /* =======================================================
     STATES
  ======================================================= */

  const [
    selectedColor,
    setSelectedColor,
  ] = useState(0);


  const [
    selectedSize,
    setSelectedSize,
  ] = useState("M");


  const [
    quantity,
    setQuantity,
  ] = useState(1);


  const [
    activeTab,
    setActiveTab,
  ] = useState(
    "details"
  );


  const [
    added,
    setAdded,
  ] = useState(false);


  /* =======================================================
     SIZES
  ======================================================= */

  const sizes = [
    "S",
    "M",
    "L",
    "XL",
    "XXL",
  ];


  /* =======================================================
     ADD TO CART
  ======================================================= */

  const addToCart = () => {

    const oldCart =

      JSON.parse(
        localStorage.getItem(
          "xfit_cart"
        ) || "[]"
      );


    const item = {

      productId:
        product.id,

      name:
        product.name,

      price:
        product.price,

      color:
        product.colors[
          selectedColor
        ],

      size:
        selectedSize,

      quantity:
        quantity,

    };


    const existingIndex =
      oldCart.findIndex(

        (cartItem) =>

          cartItem.productId ===
            item.productId &&

          cartItem.color ===
            item.color &&

          cartItem.size ===
            item.size

      );


    if (
      existingIndex >= 0
    ) {

      oldCart[
        existingIndex
      ].quantity +=
        quantity;

    } else {

      oldCart.push(
        item
      );

    }


    localStorage.setItem(
      "xfit_cart",
      JSON.stringify(
        oldCart
      )
    );


    window.dispatchEvent(
      new Event(
        "xfit-cart-updated"
      )
    );


    setAdded(true);


    setTimeout(
      () => {
        setAdded(false);
      },
      2200
    );

  };


  /* =======================================================
     BUY NOW
  ======================================================= */

  const buyNow = () => {

    addToCart();

    navigate(
      "/cart"
    );

  };


  return (

    <div className="relative min-h-screen bg-[#050505] text-white overflow-x-hidden">


      {/* ===================================================
          BACKGROUND
      =================================================== */}

      <CinematicBackground />


      {/* ===================================================
          NAVBAR
      =================================================== */}

      <nav className="fixed top-0 left-0 right-0 z-50 h-20 bg-black/60 backdrop-blur-2xl border-b border-white/5">

        <div className="max-w-[1500px] mx-auto h-full px-5 md:px-10 flex items-center justify-between">


          {/* LOGO */}

          <button

            onClick={() =>
              navigate(
                "/shop"
              )
            }

            className="text-[#ccff00] text-4xl font-black tracking-[-0.06em]"

          >

            X-FIT

          </button>


          {/* NAV */}

          <div className="hidden xl:flex items-center gap-7 h-full">

            <NavButton
              text="Today"
              onClick={() =>
                navigate(
                  "/dashboard"
                )
              }
            />

            <NavButton
              text="Training"
              onClick={() =>
                navigate(
                  "/workout-plan"
                )
              }
            />

            <NavButton
              text="MotionCheck"
              onClick={() =>
                navigate(
                  "/motioncheck"
                )
              }
            />

            <NavButton
              text="Nutrition"
              onClick={() =>
                navigate(
                  "/diet-plan"
                )
              }
            />

            <NavButton
              text="Progress DNA"
              onClick={() =>
                navigate(
                  "/progress-dna"
                )
              }
            />

            <NavButton
              text="Membership"
              onClick={() =>
                navigate(
                  "/membership"
                )
              }
            />

            <NavButton
              text="Shop"
              active
              onClick={() =>
                navigate(
                  "/shop"
                )
              }
            />

          </div>


          {/* RIGHT */}

          <div className="flex items-center gap-3">

            <button

              onClick={() =>
                navigate(
                  "/cart"
                )
              }

              className="relative w-10 h-10 rounded-full border border-white/10 bg-black/30 flex items-center justify-center hover:border-[#ccff00]/40 transition"

            >

              🛒

            </button>


            <button

              onClick={() =>
                navigate(
                  "/profile"
                )
              }

              className="w-10 h-10 rounded-full border border-white/10 bg-black/30 text-[#ccff00] hover:bg-[#ccff00] hover:text-black transition"

            >

              ◉

            </button>

          </div>

        </div>

      </nav>


      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="relative z-20 max-w-[1500px] mx-auto px-5 md:px-10 pt-[110px] pb-24">


        {/* BACK */}

        <button

          onClick={() =>
            navigate(
              "/shop"
            )
          }

          className="text-[#92998c] hover:text-[#ccff00] text-sm mb-6"

        >

          ← Back to X-FIT Shop

        </button>


        {/* =================================================
            PRODUCT
        ================================================= */}

        <section className="grid lg:grid-cols-2 gap-6">


          {/* ===============================================
              GALLERY
          =============================================== */}

          <ProductGallery
            product={
              product
            }
            selectedColor={
              selectedColor
            }
          />


          {/* ===============================================
              PRODUCT INFORMATION
          =============================================== */}

          <div className="rounded-[28px] border border-white/10 bg-black/45 backdrop-blur-xl p-7 md:p-9">


            <p className="text-[#ccff00] text-[9px] tracking-[0.24em]">

              {product.category.toUpperCase()}

            </p>


            <h1 className="text-4xl md:text-6xl font-black tracking-[-0.05em] mt-3">

              {product.name}

            </h1>


            <p className="text-[#8c9388] mt-4 leading-relaxed">

              {product.description}

            </p>


            {/* RATING */}

            <div className="flex items-center gap-4 mt-6">

              <p className="text-4xl font-black text-[#ccff00]">

                ₹
                {product.price.toLocaleString(
                  "en-IN"
                )}

              </p>


              <span className="text-[#ccff00] text-sm">

                ★★★★★

              </span>


              <span className="text-[#666d62] text-xs">

                4.7 / 5

              </span>

            </div>


            <div className="h-px bg-white/10 my-7" />


            {/* COLOR */}

            <div>

              <div className="flex justify-between items-center">

                <p className="font-black">

                  COLOR

                </p>


                <p className="text-[#92998c] text-sm">

                  {
                    product.colors[
                      selectedColor
                    ]
                  }

                </p>

              </div>


              <div className="flex flex-wrap gap-3 mt-4">

                {product.colors.map(
                  (
                    color,
                    index
                  ) => (

                    <button

                      key={color}

                      onClick={() =>
                        setSelectedColor(
                          index
                        )
                      }

                      aria-label={
                        color
                      }

                      className={`w-10 h-10 rounded-full border-2 ${product.colorClasses[index]} ${
                        selectedColor ===
                        index

                          ? "border-[#ccff00] shadow-[0_0_16px_rgba(204,255,0,.35)]"

                          : "border-white/20"
                      }`}

                    />

                  )
                )}

              </div>

            </div>


            {/* SIZE */}

            <div className="mt-7">

              <div className="flex justify-between items-center">

                <p className="font-black">

                  SIZE

                </p>


                <button className="text-[#ccff00] text-xs font-bold">

                  SIZE GUIDE

                </button>

              </div>


              <div className="grid grid-cols-5 gap-2 mt-4">

                {sizes.map(
                  (size) => (

                    <button

                      key={size}

                      onClick={() =>
                        setSelectedSize(
                          size
                        )
                      }

                      className={`py-3 rounded-lg border font-bold transition ${
                        selectedSize ===
                        size

                          ? "bg-[#ccff00] text-black border-[#ccff00]"

                          : "border-white/10 text-white hover:border-[#ccff00]/50"
                      }`}

                    >

                      {size}

                    </button>

                  )
                )}

              </div>

            </div>


            {/* QUANTITY */}

            <div className="mt-7">

              <p className="font-black">

                QUANTITY

              </p>


              <div className="flex items-center gap-3 mt-3">

                <button

                  onClick={() =>
                    setQuantity(
                      (q) =>
                        Math.max(
                          1,
                          q - 1
                        )
                    )
                  }

                  className="w-11 h-11 rounded-lg border border-white/10"

                >

                  −

                </button>


                <span className="w-12 text-center font-black">

                  {quantity}

                </span>


                <button

                  onClick={() =>
                    setQuantity(
                      (q) =>
                        q + 1
                    )
                  }

                  className="w-11 h-11 rounded-lg border border-white/10"

                >

                  +

                </button>

              </div>

            </div>


            {/* ACTIONS */}

            <div className="grid sm:grid-cols-2 gap-3 mt-8">


              <button

                onClick={
                  addToCart
                }

                className="py-4 rounded-xl border border-[#ccff00]/50 text-[#ccff00] font-black hover:bg-[#ccff00]/10 transition"

              >

                {added

                  ? "✓ ADDED TO CART"

                  : "ADD TO CART"}

              </button>


              <button

                onClick={
                  buyNow
                }

                className="py-4 rounded-xl bg-[#ccff00] text-black font-black hover:bg-[#b8e600] transition"

              >

                BUY NOW →

              </button>

            </div>


            {/* DELIVERY INFO */}

            <div className="grid grid-cols-3 gap-3 mt-7">

              <InfoBox
                title="FAST"
                text="SHIPPING"
              />

              <InfoBox
                title="EASY"
                text="RETURNS"
              />

              <InfoBox
                title="SECURE"
                text="PAYMENT"
              />

            </div>

          </div>

        </section>


        {/* =================================================
            PRODUCT INFORMATION TABS
        ================================================= */}

        <section className="mt-7 rounded-[28px] border border-white/10 bg-black/40 backdrop-blur-xl p-7 md:p-9">


          {/* TABS */}

          <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">

            {[
              [
                "details",
                "PRODUCT DETAILS",
              ],

              [
                "quality",
                "FABRIC & QUALITY",
              ],

              [
                "compare",
                "COMPARE",
              ],

              [
                "reviews",
                "REVIEWS",
              ],

            ].map(
              ([
                key,
                label,
              ]) => (

                <button

                  key={key}

                  onClick={() =>
                    setActiveTab(
                      key
                    )
                  }

                  className={`px-5 py-3 rounded-lg text-xs font-black transition ${
                    activeTab ===
                    key

                      ? "bg-[#ccff00] text-black"

                      : "text-[#92998c] hover:text-white"
                  }`}

                >

                  {label}

                </button>

              )
            )}

          </div>


          {/* ===============================================
              DETAILS
          =============================================== */}

          {activeTab ===
            "details" && (

            <div className="grid md:grid-cols-2 gap-8 mt-8">

              <div>

                <p className="text-[#ccff00] text-[9px] tracking-[0.2em]">

                  PRODUCT DESCRIPTION

                </p>


                <p className="text-[#92998c] leading-relaxed mt-3">

                  {product.description}

                  {" "}

                  Built for training
                  sessions and
                  everyday movement
                  with a design focused
                  on comfort,
                  durability and
                  X-FIT identity.

                </p>

              </div>


              <div>

                <p className="text-[#ccff00] text-[9px] tracking-[0.2em]">

                  FEATURES

                </p>


                <div className="grid sm:grid-cols-2 gap-3 mt-4">

                  {product.features.map(
                    (feature) => (

                      <div

                        key={
                          feature
                        }

                        className="border border-white/10 rounded-xl p-4 bg-white/[0.02]"

                      >

                        <span className="text-[#ccff00]">

                          ✓

                        </span>{" "}

                        {feature}

                      </div>

                    )
                  )}

                </div>

              </div>

            </div>

          )}


          {/* ===============================================
              QUALITY
          =============================================== */}

          {activeTab ===
            "quality" && (

            <div className="grid md:grid-cols-3 gap-4 mt-8">

              <QualityCard

                title="MATERIAL"

                value={
                  product.material
                }

              />


              <QualityCard

                title="FIT"

                value={
                  product.fit
                }

              />


              <QualityCard

                title="CARE"

                value="Follow garment care label. Wash with similar colors."

              />

            </div>

          )}


          {/* ===============================================
              COMPARISON
          =============================================== */}

          {activeTab ===
            "compare" && (

            <Comparison
              product={
                product
              }
            />

          )}


          {/* ===============================================
              REVIEWS
          =============================================== */}

          {activeTab ===
            "reviews" && (

            <Reviews />

          )}

        </section>


        {/* =================================================
            CUSTOMER PHOTO / REVIEW
        ================================================= */}

        <section className="mt-7 rounded-[28px] border border-[#ccff00]/15 bg-[#ccff00]/5 p-7 md:p-9">


          <p className="text-[#ccff00] text-[9px] tracking-[0.24em]">

            X-FIT CUSTOMER EXPERIENCE

          </p>


          <h2 className="text-3xl md:text-4xl font-black mt-2">

            Bought it?
            Show your progress.

          </h2>


          <p className="text-[#92998c] mt-3 max-w-2xl">

            After a verified purchase
            is delivered, customers
            will be able to upload
            their X-FIT outfit photo,
            give a rating and write
            a review.

          </p>


          <div className="grid md:grid-cols-3 gap-4 mt-7">

            <InfoBox
              title="★★★★★"
              text="RATE PRODUCT"
            />

            <InfoBox
              title="📷"
              text="UPLOAD PHOTO"
            />

            <InfoBox
              title="✓"
              text="VERIFIED PURCHASE"
            />

          </div>

        </section>

      </main>

    </div>

  );

}


/* =========================================================
   PRODUCT GALLERY
========================================================= */

function ProductGallery({
  product,
  selectedColor,
}) {

  return (

    <div className="rounded-[28px] border border-white/10 bg-black/45 backdrop-blur-xl p-6">


      <div className="relative min-h-[520px] rounded-2xl bg-gradient-to-b from-[#1b1b1b] to-[#080808] overflow-hidden flex items-center justify-center">


        {/* GRID */}

        <div className="absolute inset-0 opacity-[0.08]">

          <div

            className="w-full h-full"

            style={{
              backgroundImage:
                "linear-gradient(rgba(204,255,0,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(204,255,0,.4) 1px, transparent 1px)",

              backgroundSize:
                "45px 45px",
            }}

          />

        </div>


        {/* GLOW */}

        <div className="absolute w-[420px] h-[420px] rounded-full bg-[#ccff00]/10 blur-[120px]" />


        {/* PRODUCT */}

        <ProductVisual

          product={
            product
          }

          selectedColor={
            selectedColor
          }

        />

      </div>


      {/* THUMBNAILS */}

      <div className="grid grid-cols-4 gap-3 mt-4">

        {[
          1,
          2,
          3,
          4,
        ].map(
          (item) => (

            <div

              key={item}

              className="h-24 rounded-xl border border-white/10 bg-[#101010] flex items-center justify-center hover:border-[#ccff00]/40 transition cursor-pointer"

            >

              <span className="text-[#ccff00] text-xs font-black">

                X-FIT

              </span>

            </div>

          )
        )}

      </div>

    </div>

  );

}


/* =========================================================
   PRODUCT VISUAL
========================================================= */

function ProductVisual({
  product,
  selectedColor,
}) {
  const selectedColorName =
    product.colors[selectedColor] || "Black";

  const variantImage =
    getProductVariantImage(
      product.id,
      selectedColorName
    );

  const imageSrc =
    variantImage || getProductImage(product.id);

  return (
    <div className="relative w-full h-full min-h-[520px] flex items-center justify-center">
      <img
        key={`${product.id}-${selectedColorName}`}
        src={imageSrc}
        alt={`${product.name} - ${selectedColorName}`}
        className="relative z-10 w-full h-full object-contain rounded-2xl transition-opacity duration-300"
      />

      {/* Cinematic overlay */}
      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/25 via-transparent to-transparent rounded-2xl" />

      {/* Product telemetry */}
      <div className="absolute left-5 bottom-5 z-30 rounded-lg border border-white/10 bg-black/60 backdrop-blur-md px-3 py-2">
        <p className="text-[#ccff00] text-[8px] font-black tracking-[0.2em]">
          X-FIT // PRODUCT
        </p>

        <p className="text-white/70 text-[8px] mt-1 tracking-[0.12em]">
          {selectedColorName.toUpperCase()}
        </p>
      </div>
    </div>
  );
}


/* =========================================================
   COMPARISON
========================================================= */

function Comparison({
  product,
}) {

  const compareProducts =
    PRODUCTS.filter(
      (item) =>
        item.category ===
          product.category &&
        item.id !==
          product.id
    ).slice(
      0,
      2
    );


  return (

    <div className="overflow-x-auto mt-8">

      <table className="w-full min-w-[700px] text-sm">

        <thead>

          <tr className="border-b border-white/10">

            <th className="text-left p-4 text-[#92998c]">

              FEATURE

            </th>


            <th className="text-left p-4 text-[#ccff00]">

              {product.name}

            </th>


            {compareProducts.map(
              (item) => (

                <th

                  key={
                    item.id
                  }

                  className="text-left p-4"

                >

                  {
                    item.name
                  }

                </th>

              )
            )}

          </tr>

        </thead>


        <tbody>

          <CompareRow

            label="Price"

            values={[
              `₹${product.price}`,

              ...compareProducts.map(
                (x) =>
                  `₹${x.price}`
              ),

            ]}

          />


          <CompareRow

            label="Material"

            values={[
              product.material,

              ...compareProducts.map(
                (x) =>
                  x.material
              ),

            ]}

          />


          <CompareRow

            label="Fit"

            values={[
              product.fit,

              ...compareProducts.map(
                (x) =>
                  x.fit
              ),

            ]}

          />


          <CompareRow

            label="Features"

            values={[
              product.features
                .length,

              ...compareProducts.map(
                (x) =>
                  x.features
                    .length
              ),

            ]}

          />

        </tbody>

      </table>

    </div>

  );

}


/* =========================================================
   COMPARISON ROW
========================================================= */

function CompareRow({
  label,
  values,
}) {

  return (

    <tr className="border-b border-white/5">

      <td className="p-4 text-[#92998c]">

        {label}

      </td>


      {values.map(
        (
          value,
          index
        ) => (

          <td

            key={index}

            className={`p-4 ${
              index === 0
                ? "text-[#ccff00] font-bold"
                : ""
            }`}

          >

            {value}

          </td>

        )
      )}

    </tr>

  );

}


/* =========================================================
   REVIEWS
========================================================= */

function Reviews() {

  return (

    <div className="mt-8">


      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">


        <div>

          <p className="text-4xl font-black">

            4.7 / 5

          </p>


          <p className="text-[#92998c] mt-1">

            Customer reviews will be
            connected to Django after
            the order system is built.

          </p>

        </div>


        <div className="text-[#ccff00] text-2xl">

          ★★★★★

        </div>

      </div>


      <div className="grid md:grid-cols-2 gap-4 mt-7">

        <ReviewCard

          name="Verified X-FIT Customer"

          text="Great fit and comfortable for training."

        />


        <ReviewCard

          name="Verified X-FIT Customer"

          text="The material feels good and the design looks clean."

        />

      </div>


      <div className="mt-7 rounded-2xl border border-[#ccff00]/20 bg-[#ccff00]/5 p-6">

        <p className="font-black">

          AFTER DELIVERY

        </p>


        <p className="text-[#92998c] text-sm mt-2">

          Customers will be able
          to upload photos, select
          a star rating, write a
          review and submit fit
          and quality feedback.

        </p>

      </div>

    </div>

  );

}


/* =========================================================
   REVIEW CARD
========================================================= */

function ReviewCard({
  name,
  text,
}) {

  return (

    <div className="rounded-2xl border border-white/10 bg-black/30 p-6">

      <div className="text-[#ccff00]">

        ★★★★★

      </div>


      <p className="text-white mt-3">

        {text}

      </p>


      <p className="text-[#62695f] text-xs mt-4">

        {name}
        {" • "}
        ✓ VERIFIED PURCHASE

      </p>

    </div>

  );

}


/* =========================================================
   QUALITY CARD
========================================================= */

function QualityCard({
  title,
  value,
}) {

  return (

    <div className="rounded-2xl border border-white/10 bg-black/30 p-6">

      <p className="text-[#5f665c] text-[9px] tracking-[0.18em]">

        {title}

      </p>


      <p className="font-bold mt-3 leading-relaxed">

        {value}

      </p>

    </div>

  );

}


/* =========================================================
   INFO BOX
========================================================= */

function InfoBox({
  title,
  text,
}) {

  return (

    <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-center">

      <p className="text-[#ccff00] font-black text-sm">

        {title}

      </p>


      <p className="text-[#62695f] text-[8px] tracking-[0.16em] mt-1">

        {text}

      </p>

    </div>

  );

}


/* =========================================================
   NAV BUTTON
========================================================= */

function NavButton({
  text,
  onClick,
  active = false,
}) {

  return (

    <button

      onClick={onClick}

      className={`h-full flex items-center text-sm transition border-b-2 ${
        active

          ? "text-white font-bold border-[#ccff00]"

          : "text-[#92998c] border-transparent hover:text-white"
      }`}

    >

      {text}

    </button>

  );

}


export default ProductDetails;