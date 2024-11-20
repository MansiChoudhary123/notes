import React from "react";
import { useNavigate } from "react-router-dom";
import { LogoIcons } from "../assets/icons/LogoIcon";

const Topbar = () => {
  const navigate = useNavigate();
  const profile = JSON.parse(localStorage.getItem("user"));
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="flex justify-between px-3 w-full py-4 bg-black shadow-md">
      <div className="flex items-center gap-2" onClick={() => navigate("")}>
        <LogoIcons className="h-8 w-8" />
        <h1 className="text-2xl font-bold text-white">Noted</h1>
      </div>
      {profile && (
        <div>
          <button
            className="text-xl font-bold text-white"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Topbar;
