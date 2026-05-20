import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase/firebase";
import LoginButton from "./LoginButton";

export default function LoginModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const login = async () => {
    try {
      setLoading(true);
      console.log("Login started");

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      console.log("Google login completed successfully");
      console.log("Firebase user email:", user?.email);

      if (!user?.email) {
        console.error("No user email found on Firebase user");
        setLoading(false);
        return;
      }

      if (!window.alloy) {
        console.error("window.alloy is not available");
        setLoading(false);
        return;
      }

      if (window.waitForAlloyReady) {
        await window.waitForAlloyReady();
      }

      const normalizedEmail = user.email.trim().toLowerCase();

      const response = await window.alloy("sendEvent", {
        xdm: {
          eventType: "user.login",
          identityMap: {
            GOOGLE_EMAIL: [
              {
                id: normalizedEmail,
                authenticatedState: "authenticated",
                primary : false
              }
            ]
          }
        },
        data: {
          debugEvent: "google-login",
          loginProvider: "google",
          googleEmail: normalizedEmail
        }
      });

      console.log("Adobe identity sent successfully", response);

      onClose?.();
    } catch (err) {
      console.error("Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "24px",
          borderRadius: "12px",
          minWidth: "320px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "12px" }}>Sign in</h2>
        <p style={{ marginTop: 0, marginBottom: "20px", color: "#555" }}>
          Continue with Google to log in and send your Adobe identity.
        </p>

        <LoginButton onClick={login} loading={loading} />

        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          style={{
            marginTop: "16px",
            background: "transparent",
            border: "none",
            color: "#666",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "14px",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
