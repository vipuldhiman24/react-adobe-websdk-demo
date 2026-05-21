import { useState } from "react";

import { signInWithPopup } from "firebase/auth";

import {
  auth,
  provider,
} from "../firebase/firebase";

import LoginButton from "./LoginButton";

export default function LoginModal({
  isOpen,
  onClose,
}) {

  const [loading, setLoading] =
    useState(false);

  if (!isOpen) return null;

  const login = async () => {

    try {

      setLoading(true);

      const result =
        await signInWithPopup(
          auth,
          provider
        );

      const user = result.user;

      if (!user?.email) {

        console.error(
          "No user email found"
        );

        return;
      }

      const normalizedEmail =
        user.email
          .trim()
          .toLowerCase();

      console.log(
        "User logged in:",
        normalizedEmail
      );

      // expose globally for Adobe Tags
      window.adobeLoginEmail =
        normalizedEmail;

      // slight delay helps Tags
      setTimeout(() => {

        document.dispatchEvent(
          new CustomEvent(
            "google-login-success",
            {
              bubbles: true,
              detail: {
                email:
                  normalizedEmail,
                provider:
                  "google"
              }
            }
          )
        );

        console.log(
          "Adobe login event dispatched"
        );

      }, 100);

      onClose?.();

    } catch (err) {

      console.error(
        "Login Error:",
        err
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="modal-overlay">

      <div className="login-modal">

        <button
          className="close-modal"
          onClick={onClose}
        >
          ✕
        </button>

        <p className="modal-tag">
          SECURE LOGIN
        </p>

        <h2>
          Welcome Back
        </h2>

        <p className="modal-text">
          Continue with Google to
          access your cart and save
          your emotionally unstable
          purchases.
        </p>

        <LoginButton
          onClick={login}
          loading={loading}
        />

      </div>

    </div>
  );
}