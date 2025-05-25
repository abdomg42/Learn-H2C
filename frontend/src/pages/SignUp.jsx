import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SignUp() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // États pour les champs du formulaire
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Fonction de soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Envoi des données au backend
      const response = await axios.post("http://localhost:8000/api/users/register/", {
        email,
        username,
        password,
        password2: password
      });

      console.log("Inscription réussie ✅", response.data);

      // Redirection vers la page de login après succès
      navigate("/signup_success");
    } catch (err) {
      console.error("Erreur d'inscription ❌", err.response);
      if (err.response?.data) {
        // Handle specific error messages
        const errorData = err.response.data;
        if (errorData.username) {
          setError(errorData.username[0]);
        } else if (errorData.email) {
          setError(errorData.email[0]);
        } else if (errorData.password) {
          setError(errorData.password[0]);
        } else {
          setError("Erreur lors de l'inscription. Veuillez réessayer.");
        }
      } else {
        setError("Erreur lors de l'inscription. Veuillez réessayer.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 via-purple-700 to-blue-700 px-4 py-10">
      <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl bg-white">
        {/* LEFT SIDE */}
        <div
          className="md:w-1/2 w-full relative bg-center p-10 text-white"
          style={{ backgroundImage: "url('/SignUp.png')" }}
        >
          <div className="absolute inset-0"></div>
          <div className="relative z-10 flex flex-col h-full justify-center">
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{t("auth.signup.welcome")}</h1>
              <p className="text-sm">{t("auth.signup.description")}</p>
            </div>
            <button>
              <Link
                to="/login"
                className="self-start bg-white text-purple-700 font-bold py-2 px-6 rounded-full shadow hover:bg-gray-100 transition"
              >
                {t("auth.login.signIn")}
              </Link>
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="md:w-1/2 w-full bg-white p-8 md:p-12">
          <h2 className="text-xl font-semibold text-purple-700 mb-2">
            {t("auth.signup.title")}
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            {t("auth.signup.description")}
          </p>

          {/* Formulaire de signup */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <input
              type="email"
              placeholder={t("auth.signup.email")}
              className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <input
              type="text"
              placeholder={t("auth.signup.fullName")}
              className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder={t("auth.signup.password")}
              className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label className="flex items-center text-sm text-gray-600">
              <input type="checkbox" className="mr-2" required />
              <span>
                {t("auth.signup.acceptTerms")}{" "}
                <Link to="/terms" className="text-purple-700 hover:underline">
                  {t("auth.signup.termsAndConditions")}
                </Link>
              </span>
            </label>

            <button
              type="submit"
              className="w-full bg-purple-700 text-white py-3 rounded-xl font-bold shadow-md hover:bg-purple-800 transition"
            >
              {t("auth.signup.signUp")}
            </button>

            <div className="text-sm text-gray-600 mt-4 text-center">
              {t("auth.signup.haveAccount")}{" "}
              <Link
                to="/login"
                className="text-purple-700 hover:underline font-semibold"
              >
                {t("auth.login.signIn")}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
