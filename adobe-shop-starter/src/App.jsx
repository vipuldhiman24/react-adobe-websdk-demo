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

    async function sendViewChange() {

      try {

        if (
          typeof window.alloy !==
          "function"
        ) {

          console.log(
            "Alloy not ready"
          );

          return;
        }

        let viewName = "home";

        if (
          location.pathname.includes(
            "/product"
          )
        ) {

          viewName =
            "product-details";
        }

        if (
          location.pathname.includes(
            "/cart"
          )
        ) {

          viewName = "cart";
        }

        console.log(
          "Sending SPA view:",
          viewName
        );

        await window.alloy(
          "sendEvent",
          {
            renderDecisions: true,

            xdm: {
              web: {
                webPageDetails: {
                  viewName
                }
              }
            }
          }
        );

        console.log(
          "SPA view sent successfully"
        );

      } catch (err) {

        console.error(
          "SPA view error:",
          err
        );
      }
    }

    sendViewChange();

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