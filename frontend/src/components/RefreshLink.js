import React from "react";
import { Link } from "react-router-dom";

const RefreshLink = ({ to, children }) => {
  const handleLinkClick = () => {
    if (window.location.pathname === to) {
      window.location.reload();
    }
  };

  return (
    <Link to={to} onClick={handleLinkClick}>
      {children}
    </Link>
  );
};

export default RefreshLink;
