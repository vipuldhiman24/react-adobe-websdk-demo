import { useDispatch, useSelector } from "react-redux";

import {
  addToCart,
  decreaseQuantity,
} from "../store/cartSlice";

import { useNavigate } from "react-router-dom";

import { auth } from "../firebase/firebase";

import { useEffect, useState } from "react";

export default function ProductCard({
  product,
  openLoginModal,
}) {

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const cartItems = useSelector(
    (state) => state.cart.items
  );

  const [user, setUser] =
    useState(null);

  useEffect(() => {

    const unsubscribe =
      auth.onAuthStateChanged(
        (currentUser) => {

          setUser(currentUser);

        }
      );

    return () => unsubscribe();

  }, []);

  const existingItem =
    cartItems.find(
      (item) =>
        item.id === product.id
    );

  const handleAddToCart = (e) => {

    e.stopPropagation();

    // NOT LOGGED IN
    if (!user) {

      openLoginModal?.();

      return;
    }

    dispatch(addToCart(product));
  };

  return (

    <div
      className="product-card"
      onClick={() =>
        navigate(`/product/${product.id}`)
      }
    >

      <img
        src={product.thumbnail}
        alt={product.title}
      />

      <div className="product-info">

        <p className="product-category">
          {product.category}
        </p>

        <h3>
          {product.title}
        </h3>

        <div className="product-bottom">

          <span className="price">
            ${product.price}
          </span>

          {existingItem ? (

            <div
              className="quantity-box"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <button
                onClick={() =>
                  dispatch(
                    decreaseQuantity(
                      product.id
                    )
                  )
                }
              >
                −
              </button>

              <span>
                {existingItem.quantity}
              </span>

              <button
                onClick={handleAddToCart}
              >
                +
              </button>

            </div>

          ) : (

            <button
              className="primary-btn"
              onClick={handleAddToCart}
            >
              Add To Cart
            </button>

          )}

        </div>

      </div>

    </div>
  );
}