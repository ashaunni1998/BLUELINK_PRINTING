// src/pages/user/components/GoogleLoginButton.jsx
import React from "react";
import { FcGoogle } from "react-icons/fc";

/**
 * Popup-based Google login button.
 *
 * Props:
 *  - popupPath (string) full backend URL to start OAuth (e.g. `${API_BASE_URL}/auth/google`)
 *  - checkPath (string) full backend URL to GET current user (e.g. `${API_BASE_URL}/user/me`)
 *  - onSuccess(json)
 *  - onError(err)
 *  - label
 */
export default function GoogleLoginButton({
  popupPath = "/api/auth/google",
  checkPath = "/api/user/me",
  onSuccess,
  onError,
  label = "Continue with Google",
  style = {},
  className = "",
}) {
  const openPopupAndListen = () => {
    try {
      const w = 520;
      const h = 680;
      const left = window.screenX + (window.outerWidth - w) / 2;
      const top = window.screenY + (window.outerHeight - h) / 2;

      const popup = window.open(
        popupPath,
        "google_oauth_popup",
        `width=${w},height=${h},left=${left},top=${top},resizable,scrollbars=yes`
      );

      if (!popup) {
        onError?.({ ok: false, message: "Popup blocked. Please allow popups." });
        return;
      }

      const messageListener = async (event) => {
        // Optionally check origin:
        // if (new URL(popupPath).origin !== event.origin) return;

        const data = event.data || {};
        if (data.type === "google-auth-success") {
          // Backend should have set HttpOnly cookie; confirm by calling checkPath
          try {
            const resp = await fetch(checkPath, { method: "GET", credentials: "include" });
            const json = await resp.json();
            if (resp.ok) {
              onSuccess?.(json);
            } else {
              onError?.(json);
            }
          } catch (err) {
            onError?.({ ok: false, message: err.message || "Network error" });
          } finally {
            window.removeEventListener("message", messageListener);
            try { popup.close(); } catch (e) {}
          }
        } else if (data.type === "google-auth-error") {
          onError?.({ ok: false, message: data.message || "Google login failed" });
          window.removeEventListener("message", messageListener);
          try { popup.close(); } catch (e) {}
        }
      };

      window.addEventListener("message", messageListener);
    } catch (err) {
      onError?.({ ok: false, message: err.message || "Failed to open popup" });
    }
  };

  return (
    <button
      onClick={(e) => { e.preventDefault(); openPopupAndListen(); }}
      className={className}
      style={{
        padding: "10px",
        borderRadius: 8,
        border: "1px solid #e6e9ef",
        display: "flex",
        gap: 10,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        background: "white",
        fontWeight: 600,
        cursor: "pointer",
        ...style,
      }}
    >
      <FcGoogle size={18} />
      <span>{label}</span>
    </button>
  );
}
