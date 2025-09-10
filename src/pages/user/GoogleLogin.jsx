import React, { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const GoogleLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: "218140902608-nm7tc1pe99sfh7ep0lvudjmn1j35eq3b.apps.googleusercontent.com",
        callback: handleCallbackResponse,
      });

      google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        { theme: "outline", size: "large" }
      );
    }
  }, []);

  const handleCallbackResponse = (response) => {
    const userObject = jwtDecode(response.credential);
    console.log("Google User:", userObject);

    // Save user info
    localStorage.setItem("user", JSON.stringify(userObject));

    // Redirect
    navigate("/dashboard");
  };

  return (
    <div>
      {/* <h3>Sign in with Google</h3> */}
      <div id="googleSignInDiv"></div>
    </div>
  );
};

export default GoogleLogin;
