import React from "react";
import logo from "../../assets/images/logo.svg";

function AuthHeader() {
  return (
    <header className="absolute left-0 top-0 z-20 px-8 py-2">
      <img className="w-52" src={logo} alt="StreamFlex" />
    </header>
  );
}

export default AuthHeader;
