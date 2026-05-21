import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import {
  useEffect,
} from "react";

import Home from "./pages/Home";

import ProductDetails
  from "./pages/ProductDetails";

import CartPage
  from "./pages/CartPage";

export default function App() {

  const location =
    useLocation();

  useEffect(() => {

    let viewName = "Home";

    if (
      location.pathname.includes(
        "/product"
      )
    ) {

      viewName =
        "Product Details";
    }

    if (
      location.pathname.includes(
        "/cart"
      )
    ) {

      viewName = "Cart";
    }

    console.log(
      "Adobe SPA View:",
      viewName
    );

    document.dispatchEvent(
      new CustomEvent(
        "adobe-spa-view",
        {
          detail: {
            viewName
          }
        }
      )
    );

  }, [location.pathname]);

  return (

    <Routes>

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/product/:id"
        element={
          <ProductDetails />
        }
      />

      <Route
        path="/cart"
        element={<CartPage />}
      />

    </Routes>
  );
}