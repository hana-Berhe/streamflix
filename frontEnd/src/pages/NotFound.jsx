import { Link } from "react-router-dom";
import logo from "../assets/images/logo.svg";

function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-black px-6 text-center text-white">
      <img src={logo} alt="StreamFlex" className="w-56" />
      <h1 className="text-4xl font-bold">Lost your way?</h1>
      <p className="max-w-md text-lg text-gray-300">
        This page doesn&apos;t exist. You&apos;ll find lots to explore on the home page.
      </p>
      <Link to="/browse" className="rounded bg-white px-6 py-3 font-bold text-black hover:bg-white/75">
        StreamFlex Home
      </Link>
    </main>
  );
}

export default NotFound;
