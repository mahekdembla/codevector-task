import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = [
    "Electronics",
    "Books",
    "Clothing",
    "Home",
    "Sports",
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts(category = "") {
    try {
      setLoading(true);

      const url = category
        ? `http://localhost:3000/products?category=${category}`
        : `http://localhost:3000/products`;

      const res = await axios.get(url);

      setProducts(res.data.products);
      setNextCursor(res.data.nextCursor);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadMore() {
    try {
      if (!nextCursor) return;

      setLoading(true);

      let url = `http://localhost:3000/products?cursorUpdatedAt=${nextCursor.updated_at}&cursorId=${nextCursor.id}`;

      if (selectedCategory) {
        url += `&category=${selectedCategory}`;
      }

      const res = await axios.get(url);

      setProducts((prev) => [
        ...prev,
        ...res.data.products,
      ]);

      setNextCursor(res.data.nextCursor);
    } catch (err) {
      console.error("Error loading more products:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">📦 Product Catalog</h1>

        <select
          className="filter"
          value={selectedCategory}
          onChange={(e) => {
            const category = e.target.value;

            setSelectedCategory(category);
            fetchProducts(category);
          }}
        >
          <option value="">All Categories</option>

          {categories.map((cat) => (
            <option
              key={cat}
              value={cat}
            >
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="stats">
        Total Products Loaded: {products.length}
        {selectedCategory &&
          ` • Category: ${selectedCategory}`}
      </div>

      <div className="products-grid">
        {products.map((product, index) => (
          <div
            className="card"
            key={product.id}
            style={{
              animationDelay: `${index * 0.05}s`,
            }}
          >
            <div className="product-name">
              {product.name}
            </div>

            <div className="category">
              {product.category}
            </div>

            <div className="price">
              ₹{product.price}
            </div>

            <p>
              <strong>ID:</strong>{" "}
              {product.id}
            </p>

            <p>
              <strong>Updated:</strong>
            </p>

            <p>
              {new Date(
                product.updated_at
              ).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <button
        className="load-btn"
        onClick={loadMore}
        disabled={loading || !nextCursor}
      >
        {loading
          ? "Loading..."
          : nextCursor
          ? "Load More Products"
          : "No More Products"}
      </button>
    </div>
  );
}

export default App;