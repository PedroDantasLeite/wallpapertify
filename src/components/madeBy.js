// MadeBy.js
import React from "react";
import "./madeBy.css"; // Import the CSS file

const MadeBy = () => {
  return (
    <div className="madeByCard">
      <div className="madeByContent">Made by Pedro</div>
      <div className="madeByContent">Design by Gika</div>
      <a
        href="https://github.com/PedroDantasLeite/wallpapertify"
        className="hyperlink"
      >
        Repo
      </a>
    </div>
  );
};

export default MadeBy;
