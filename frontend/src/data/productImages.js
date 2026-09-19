// X-FIT shop image map

export const PRODUCT_IMAGES = {
  1: "/images/products/core-tee-black.jpg",
  2: "/images/products/elite-tee-black.jpg",
  3: "/images/products/beast-tee-black.jpg",
  4: "/images/products/vertical-tee-black.jpg",
  5: "/images/products/training-tee-graphite.jpg",
  6: "/images/products/compression-pro-black-lime.jpg",
  7: "/images/products/compression-max-black.jpg",
  8: "/images/products/compression-hybrid-black.jpg",
  9: "/images/products/compression-elite-black.jpg",
  10: "/images/products/compression-stealth-black.jpg",
  11: "/images/products/hoodie-black.jpg",
  12: "/images/products/training-shorts-black.jpg",
  13: "/images/products/cap-black.jpg",
  14: "/images/products/shaker-black.jpg",
  15: "/images/products/gym-bag-black.jpg",
  16: "/images/products/gym-towel-black.jpg",
};

export function getProductImage(productId) {
  return (
    PRODUCT_IMAGES[Number(productId)] ||
    "/images/products/core-tee-black.jpg"
  );
}