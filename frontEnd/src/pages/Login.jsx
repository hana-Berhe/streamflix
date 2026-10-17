import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import AuthHeader from "../components/Header/AuthHeader";
import banner from "../assets/images/login-bg.jpg";
import { checkValidData } from "../utils/validate";
import * as authApi from "../services/authApi";
import { setUser } from "../features/user/userSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState(
    location.state?.expired ? "Your session expired. Sign in again." : "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Already signed in? Skip the form.
  useEffect(() => {
    let isMounted = true;
    authApi
      .getMe()
      .then(() => isMounted && navigate("/browse", { replace: true }))
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const toggleSignInForm = () => {
    setIsSignInForm((current) => !current);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleButtonClicked = async () => {
    setSuccessMessage("");
    const message = checkValidData(email, password);

    if (message) {
      setErrorMessage(message);
      return;
    }

    if (!isSignInForm && fullName.trim().length < 2) {
      setErrorMessage("Full name must be at least 2 characters");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      if (isSignInForm) {
        const data = await authApi.login({ email, password });
        dispatch(setUser(data.user));
        navigate("/browse", { replace: true });
        return;
      }

      await authApi.register({
        fullName: fullName.trim(),
        email,
        password,
      });

      setIsSignInForm(true);
      setPassword("");
      setSuccessMessage("Registration successful. Please sign in.");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <img
        src={banner}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-black/35" />

      <AuthHeader />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleButtonClicked();
        }}
        className="absolute left-1/2 top-24 z-10 w-[92%] max-w-md -translate-x-1/2 rounded-lg bg-black/80 p-10 text-white sm:top-32 sm:p-12"
      >
        <h1 className="py-4 text-3xl font-bold">
          {isSignInForm ? "Sign In" : "Sign Up"}
        </h1>

        {!isSignInForm && (
          <input
            type="text"
            placeholder="Full Name"
            className="my-3 w-full rounded bg-gray-700 p-4"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
          />
        )}

        <input
          type="email"
          placeholder="Email Address"
          className="my-3 w-full rounded bg-gray-700 p-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <div className="relative my-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full rounded bg-gray-700 p-4 pr-12"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isSignInForm ? "current-password" : "new-password"}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {!isSignInForm && (
          <p className="mt-1 text-xs text-gray-400">
            At least 6 characters, with uppercase, lowercase, and a number.
          </p>
        )}

        {errorMessage && (
          <p className="py-2 text-sm font-semibold text-red-400">
            {errorMessage}
          </p>
        )}

        {successMessage && (
          <p className="py-2 text-sm font-semibold text-green-500">
            {successMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="my-4 w-full rounded-lg bg-red-700 p-4 font-semibold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Please wait..."
            : isSignInForm
              ? "Sign In"
              : "Sign Up"}
        </button>

        <p className="cursor-pointer py-4 text-gray-300" onClick={toggleSignInForm}>
          {isSignInForm
            ? "New to StreamFlex? Sign Up Now."
            : "Already registered? Sign In Now."}
        </p>
      </form>
    </div>
  );
}

export default Login;
