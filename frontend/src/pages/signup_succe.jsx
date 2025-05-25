import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function SignupSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0F36] px-4">
      <div className="bg-[#1C2344] p-8 rounded-xl shadow-2xl text-center w-full max-w-md text-white relative">
        <div className="flex justify-center mb-4">
          <CheckCircle className="text-green-400" size={48} />
        </div>
        <h2 className="text-2xl font-bold mb-2">SIGN UP SUCCESSFUL</h2>
        <p className="text-sm text-gray-300 mb-6">
          You have successfully signed into your account. You can close this
          window and continue using the product.
        </p>
        <Link
          to="/login"
          className="inline-block bg-[#0A0F36] hover:bg-[#1F2A55] text-white text-sm font-semibold py-2 px-6 rounded-md transition"
        >
          CLOSE WINDOW
        </Link>
      </div>
    </div>
  );
}
