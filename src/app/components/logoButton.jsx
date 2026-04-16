import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { routePath } from "../routes/routepath";
const Proteus_Logo = require("../../app/assets/Constructionlogo.png");

export const FullLogo = ({ clickable, onClick }) => {
  const navigation = useNavigate();
<FullLogo style={{ fontSize: "1.5em", fontWeight: "bold" }} />

  const navigateToLogin = () => {
    if (!clickable) return;
    if (onClick) return onClick();
    navigation(routePath.login);
  };
  return (
    <FullLogoContainer>
      <button
        type="button"
        className={`full_logo_block ${clickable ? "clickable" : ""}`}
        onClick={navigateToLogin}
      >
        <img src={Proteus_Logo} alt="" />
      </button>
    </FullLogoContainer>
  );
};

const FullLogoContainer = styled.div`
  button {
    background: none;
    outline: none;
    border: 0px;
    /* background-color: "red"; */
    width: 150px;
  }
  button:focus {
    outline: none;
    border: 0px;
  }

  .full_logo_block {
    height: 100px;
    width: 250px;
    border: 0px solid black;
    transform: translateY(-10px);
  }
  .full_logo_block img {
    height: 300%;
    width: 100%;
    object-fit: contain;
  }
  .clickable {
    cursor: pointer;
  }
`;
