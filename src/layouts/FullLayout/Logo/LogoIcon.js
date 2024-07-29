import React from "react";
import logoicn from "../../../assets/images/bepocart (1).png";

const LogoIcon = (props) => {
  return (
    <img 
      alt="Logo" 
      src={logoicn} 
      style={{ width: '200px', height: 'auto' }} // Change the width and height as needed
      {...props} 
    />
  );
};

export default LogoIcon;
