// FakeStore API URL (Electronics products & Tech Accessories)
const ALL_PRODUCTS_URL = "https://fakestoreapi.com/products";

// DOM Element , get container to put the data from api
const featuredContainer = document.getElementById(
  "featured-products-container",
);
const newArrivalsContainer = document.getElementById("new-arrivals-container");
const bestSellersContainer = document.getElementById("best-sellers-container");

// loading spinner
function showLoading(container) {
  if (container) {
    container.innerHTML = `
      <div class="text-center w-100 py-4">
        <div class="spinner-border text-danger" role="status"></div>
        <p class="mt-2 text-muted small">Loading products...</p>
      </div>
    `;
  }
}

// Fetch Products from FakeStore API using Axios
async function fetchAllSections() {
  showLoading(featuredContainer);
  showLoading(newArrivalsContainer);
  showLoading(bestSellersContainer);
  try {
    const response = await axios.get(ALL_PRODUCTS_URL);
    const allProducts = response.data;

    // Filter 1: Electronics Category -> Featured Products Section
    const electronics = allProducts.filter(
      (item) => item.category === "electronics",
    );
    renderProductList(electronics, featuredContainer, "FEATURED");

    // Filter 2: Last 6 Products -> New Arrivals Section
    const newArrivals = electronics.slice(-6);
    renderProductList(newArrivals, newArrivalsContainer, "NEW");

    // Filter 3: High Rating Products (Rate >= 4.0) -> Best Sellers Section
    const bestSellers = electronics.filter(
      (item) => item.rating && item.rating.rate >= 2.9,
    );
    renderProductList(bestSellers, bestSellersContainer, "HOT");
  } catch (error) {
    console.error("Error fetching API data:", error);
    productsContainer.innerHTML = `
      <div class="alert alert-danger w-100 text-center my-3" role="alert">
        Failed to load products from API. Please try again later.
      </div>
    `;
  }
}

// Render Products into Bootstrap Cards
function renderProductList(products, container, badgeText) {
  // Clear loading spinner
  if (!container) return;
  container.innerHTML = "";

  products.forEach((product) => {
    // Generate Rating Stars dynamically
    const ratingCount = Math.round(product.rating?.rate || 4);
    let starsHtml = "";
    for (let i = 0; i < 5; i++) {
      if (i < ratingCount) {
        starsHtml += '<i class="bi bi-star-fill text-warning"></i> ';
      } else {
        starsHtml += '<i class="bi bi-star text-warning"></i> ';
      }
    }

    // HTML Template for Product Card
    const cardHTML = `
      <div class="col-10 col-md-4 col-lg-3 flex-shrink-0">
        <div class="card h-100 border-0 shadow-sm position-relative">
          <span
            class="position-absolute top-0 end-0 m-2 badge rounded-2 shadow-sm p-2"
            style="background-color: #fe624b; z-index: 2"
          >
            ${badgeText}
          </span>

          <div class="bg-light rounded-top text-center p-3">
            <img
              src="${product.image}"
              class="img-fluid"
              alt="${product.title}"
              style="height: 160px; object-fit: contain"
            />
          </div>

          <div class="card-body d-flex flex-column">
            <small class="text-secondary mb-1 text-uppercase fw-semibold" style="font-size: 0.75rem;">
              ${product.category}
            </small>
            <h6 class="card-title fw-bold text-dark mb-2 text-truncate" title="${product.title}">
              ${product.title}
            </h6>

            <div class="mt-auto">
              <div class="mb-2" style="font-size: 0.8rem">
                ${starsHtml}
                <span class="text-muted ms-1 small">(${product.rating?.rate || 4.5})</span>
              </div>

              <div class="d-flex align-items-center justify-content-between">
                <h5 class="text-danger fw-bold mb-0">$${product.price.toFixed(2)}</h5>
                <button class="btn btn-outline-danger btn-sm rounded-circle">
                  <i class="bi bi-cart-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    container.innerHTML += cardHTML;
  });
}

// Call API function when dom ready (if default ui ready call api start)
document.addEventListener("DOMContentLoaded", fetchAllSections);
