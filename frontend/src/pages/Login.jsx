import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Make the login request
      const response = await axios.post("http://localhost:8000/api/token/", {
        username: email.trim(),
        password: password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.data.access) {
        // Store the tokens
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);

        // Set up axios defaults for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;

        // Verify the token by making a request to get user profile
        try {
          const profileResponse = await axios.get("http://localhost:8000/api/users/profile/", {
            headers: {
              'Authorization': `Bearer ${response.data.access}`
            }
          });

          if (profileResponse.data) {
            navigate("/dashboard");
          }
        } catch (profileError) {
          console.error("Error fetching user profile:", profileError);
          setError("Error verifying user profile. Please try again.");
          // Clear tokens if profile verification fails
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          delete axios.defaults.headers.common['Authorization'];
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response) {
        if (err.response.status === 401) {
          setError("Invalid email or password. Please check your credentials and try again.");
        } else if (err.response.status === 400) {
          setError(err.response.data.detail || "Invalid login credentials");
        } else {
          setError("An error occurred during login. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500 p-6">
      <div className="relative w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden">
        <img src="/login.png" alt={t("landing.hero.studentImageAlt")} className="absolute inset-0 w-full h-full object-cover" />

        <div className="relative z-10 flex flex-col md:flex-row w-full h-full p-10">
          <div className="w-full md:w-1/2 mb-6 md:mb-0 md:pr-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t("auth.login.title")}</h2>
            <p className="text-sm text-gray-500 mb-6">{t("auth.login.description")}</p>

            <form className="space-y-4" onSubmit={handleLogin}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline text-red-600 font-medium">{error}</span>
                </div>
              )}

              <input
                type="email"
                placeholder={t("auth.login.email")}
                className="w-full px-4 py-3 rounded-xl bg-white/70 border border-gray-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              <input
                type="password"
                placeholder={t("auth.login.password")}
                className="w-full px-4 py-3 rounded-xl bg-white/70 border border-gray-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="submit"
                className={`w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-xl shadow-md hover:from-purple-600 hover:to-indigo-600 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    {t("auth.login.signingIn")}
                  </div>
                ) : (
                  t("auth.login.signIn")
                )}
              </button>
              <p className="text-sm text-center mt-4 text-gray-700">
                {t("auth.login.noAccount")}{" "}
                <a href="/signup" className="text-purple-700 hover:underline">
                  {t("auth.login.createAccount")}
                </a>
              </p>
            </form>
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center text-gray-800 px-4">
            <h2 className="text-3xl font-bold mb-4">{t("auth.login.welcomeBack")}</h2>
            <p className="text-sm">{t("auth.login.description")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
