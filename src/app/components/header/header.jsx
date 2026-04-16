import React, { useEffect, useRef, useState } from "react";
import logo from "../../assets/logo.png";
import Profile from "../../assets/man.png";
import ConstructionLogo from "../../assets/Constructionlogo.png";
import styled from "styled-components";
import { BiBell } from "react-icons/bi";
import { FaCaretDown } from "react-icons/fa";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { routePath } from "../../routes/routepath";
import { clearUserAction } from "../../redux/slices/auth/authslice";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaGlobe,
  FaRegFileAlt,
  FaMapMarkerAlt,
  FaBars 
} from "react-icons/fa";
// import {fetchCompanydetailsListAction} from "../../redux/slices/companydetails/companydetailsSlice"
const Header = ({ onClickMenuBtn }) => {
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const [showUserOpts, setShowUserOpts] = useState(false);

  const userOptsRef = useRef(null);

  const navigateToProfile = () => {
    navigation(routePath.profile); // Ensure routePath is properly defined
    setShowUserOpts(false);
  };
  const navigateToCompancy = () => {
    navigation(routePath.compancydetails); // Ensure routePath is properly defined
    setShowUserOpts(false);
  };
  const Username = localStorage.getItem("username");
  const CompancyName = localStorage.getItem("companyName");
  const Address = localStorage.getItem("address");
  const Email = localStorage.getItem("email");
  const GSTIN = localStorage.getItem("gstin");
  const MobileNo1 = localStorage.getItem("mobileNo1");
  const MobileNo2 = localStorage.getItem("mobileNo2");
  const Website = localStorage.getItem("website");
  const Manufacture = localStorage.getItem("manufacturersOf");

  const compancydetails = useSelector((_state) => _state);

  // You can use `companyDetails` for your header or other logic here
  console.log("Fetched Company Details:", compancydetails);
  const onLogout = () => {
    clearUserAction(dispatch);
    localStorage.removeItem("tokenExpire");
    localStorage.removeItem("token");
    navigation(routePath.login, { state: { navigatedFrom: "logout" } });
    setShowUserOpts(false);
  };
  useEffect(() => {
    function handleClickOutside(event) {
      if (userOptsRef.current && !userOptsRef.current.contains(event.target)) {
        setShowUserOpts(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userOptsRef]);

  return (
    <HeaderBlock className="">
      <div className="web_view py-1" style={{ backgroundColor: "#2a3042" }}>
        <div className=" div1 d-flex align-items-start justify-content-center ">
          <div className="header_logo_icon mt-2">
            {/*<img alt="" src={logo} onClick={onClickMenuBtn} />*/}
            <FaBars style={{ fontSize: "22px", marginRight: "8px", marginTop:"10px",  }}  onClick={onClickMenuBtn}/>
          </div>
        </div>
        <div className=" div2 p-2 d-flex align-items-end">
          <div className="logo_block">
            <img
              alt=""
              src={ConstructionLogo}
              style={{ height: "100px", marginTop: "-30px" }}
            />
          </div>
        </div>
        <div className="div3 px-2 pt-2 justify-content-center">
          <div className="avg_gic">
            {/*<p>{dayjs().add(1, "month").format("MMMM")} Stock</p>*/}
            <p
              style={{
                lineHeight: "1.2",
               
               
                justifyContent: "center", // Centers horizontally
                alignItems: "center",
              }}
            >
              {CompancyName}
            </p>
            <p style={{ lineHeight: "1.6", fontSize: "14px" }}>
              <FaRegFileAlt style={{ marginRight: "8px" ,color:"#054ca0"}} />
              {"GSTIN" + " " + GSTIN}
            </p>
            <p style={{ lineHeight: "1.6", fontSize: "14px" }}>
              <FaMapMarkerAlt style={{ marginRight: "8px",color:"#054ca0" }} />
              {Address}
            </p>
          </div>
        </div>
        <div className="div3 px-2 pt-2 justify-content-center">
          <div className="avg_gic1">
            {/*<p>
              <FaPhoneAlt style={{ marginRight: "8px" }} />
              {MobileNo1} | {MobileNo2}
            </p>
            <p>{"E-mail :" + " " + Email}</p>
            <p>{"Website :" + " " + Website}</p>
            <p>{"GSTIN :" + " " + GSTIN}</p>*/}
            <p style={{ fontSize: "14px" }}>
              <FaPhoneAlt style={{ marginRight: "8px",color:"#054ca0" }} />
              {MobileNo1} | {MobileNo2} &nbsp;&nbsp;
              <FaEnvelope style={{ marginRight: "8px",color:"#054ca0" }} />
              {Email} &nbsp;&nbsp;
            </p>
            {/*<p style={{ lineHeight: "1.6", fontSize: "14px" }}>
              <FaGlobe style={{ marginRight: "8px" ,color:"#054ca0"}} />
              {Website} &nbsp;&nbsp;
            </p>*/}
          </div>
        </div>
        <div className="div6 position-relative" ref={userOptsRef}>
          <button className="notification-btn" type="button">
            <BiBell size={"25px"} color="#495057" />
            <span className="badge"></span> {/* Add actual badge content */}
          </button>

          <button
            className="profile-btn"
            type="button"
            onClick={() => setShowUserOpts(!showUserOpts)}
          >
            <div className="profile-icon">
              <img src={Profile} alt="" />
            </div>
            <span className="">&nbsp; {Username} &nbsp; </span>
            <FaCaretDown className="caret-down" />
          </button>

          {showUserOpts && (
            <div className="bg-white rounded user_Opts_block d-flex flex-column">
              <button type="button" onClick={navigateToProfile}>
                <i className="bx bx-user font-size-16 align-middle me-1"></i> My
                Profile
              </button>
              <div className="border"></div>
              <button type="button" onClick={navigateToCompancy}>
              <i class="bx bx-briefcase font-size-16 align-middle me-1"></i>
                              Company Details
              </button>
              <div className="border"></div>
              <button className="text-danger" onClick={onLogout}>
                <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger"></i>{" "}
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </HeaderBlock>
  );
};

export default Header;

const HeaderBlock = styled.div`
  /* padding: 5vh 2vw; */
  .div1,
  .div2,
  .div3,
  .div4,
  .div5,
  .div6 {
    background-color: #2a3042;
  }

  .div2,
  .div3 {
    flex-grow: 1;
  }
  .web_view .div1 {
    /* padding: 20px 25px; */
    width: 77px;
  }
  .logo_block {
    height: 75px;
    width: 150px;
    border: 0px solid white;
  }
  .logo_block img {
    height: 100%;
    width: 100%;
    object-fit: contain;
    cursor: pointer;
  }

  .web_view .header_logo_icon {
    width: 3.5rem;
    height: 3.2rem;
    cursor: pointer;
    margin-left: 10px;
  }

  .mob_view .header_logo_icon {
    width: 1.25rem;
    height: 1.25rem;
  }
  .header_logo_icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .div2 {
    position: static;
  }
  .div2 .text-wrapper {
    color: #ffffff;
    font-family: "Lexend-Bold", Helvetica;
    font-size: 30px;
    font-weight: 700;
    letter-spacing: 0;
    line-height: 46px;
    white-space: nowrap;
  }
  .div2 .drive-what-s-next {
    color: #bdc1ca;
    font-family: "Manrope-Regular", Helvetica;
    font-size: 12px;
    font-weight: 400;
    left: 39px;
    letter-spacing: 0;
    line-height: 16px;
    position: relative;
    top: -10px;
    white-space: nowrap;
  }
  .div3 {
    display: flex;
    flex-direction: column;
  }
  .div3 .avg_gic {
    display: flex;
    flex-direction: column;
    flex: 1;
    border: 0px solid white;
    justify-content: center;
  }
  .div3 .avg_gic p {
    margin: 0px;
  }
  .div3 .avg_gic p:nth-child(1) {
    color: #0194d9;
    font-family: "GT-Walsheim", sans-serif;
    font-size: 38px;
    font-weight: 800;
    letter-spacing: 0;
    line-height: 18px;
    top: 0;
    white-space: nowrap;
  }
  .div3 .avg_gic p:nth-child(2) {
    color: #6d6e70;
    font-family: "GT-Walsheim", sans-serif;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 18px;
    top: 0;
    white-space: wrap;
  }
  .div3 .avg_gic p:nth-child(3) {
    color: #6d6e70;
    font-family: "GT-Walsheim", sans-serif;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 18px;
    top: 0;
    white-space: wrap;
  }
  .div3 .avg_gic p:nth-child(4) {
    color: #6d6e70;
    font-family: "GT-Walsheim", sans-serif;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 18px;
    top: 0;
    white-space: nowrap;
  }
  .div3 .avg_gic p:nth-child(5) {
    color: #ffffff;
    font-family: "GT-Walsheim", sans-serif;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 18px;
    top: 0;
    white-space: nowrap;
  }

  .div3 .avg_gic1 {
    display: flex;
    flex-direction: column;
    flex: 1;
    border: 0px solid white;
    justify-content: center;
    margin-top: -10px;
  }
  .div3 .avg_gic1 p {
    margin: 0px;
  }
  .div3 .avg_gic1 p:nth-child(2) {
    color: #6d6e70;
    font-family: "GT-Walsheim", sans-serif;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 18px;
    top: 0;
    white-space: wrap;
  }
  .div3 .avg_gic1 p:nth-child(1) {
    color: #6d6e70;
    font-family: "GT-Walsheim", sans-serif;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 18px;
    top: 0;
    white-space: wrap;
  }
  .div3 .tabs {
    border: 0px solid white;
  }

  .div3 .tabs .a {
    text-decoration: none;
    color: #9095a1;
    font-weight: 600;
    font-size: 10px;
  }

  .div4 .avg_duration {
    display: flex;
    flex-direction: column;
    flex: 1;
    border: 0px solid white;
    justify-content: center;
  }
  .div4 .avg_duration p {
    margin: 0px;
  }
  .div4 .avg_duration p:nth-child(1) {
    color: #9095a1;
    font-family: "GT-Walsheim", sans-serif;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 16px;
    top: 0;
    white-space: nowrap;
  }
  .div4 .avg_duration p:nth-child(2) {
    color: #9095a1;
    font-family: "GT-Walsheim", sans-serif;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 16px;
    top: 0;
    white-space: nowrap;
  }
  .div5 .incident_change {
    display: flex;
    flex-direction: column;
    flex: 1;
    flex-grow: 1;
    border: 0px solid white;
    justify-content: center;
  }
  .div5 .incident_change p {
    margin: 0px;
  }
  .div5 .incident_change p:nth-child(1) {
    color: #9095a1;
    font-family: "GT-Walsheim", sans-serif;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 16px;
    top: 0;
    white-space: nowrap;
  }
  .div5 .incident_change p:nth-child(2) {
    color: #67acaa;
    font-family: "GT-Walsheim", sans-serif;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 16px;
    top: 0;
  }
  .div5 .incident_change p:nth-child(2) span {
    font-size: 6px;
    height: 20px;
  }
  .div5 .btn_block button {
    color: white;
    border-radius: 3px;
    outline: none;
    border: 0px;
    font-size: 0.6rem;
  }
  .div5 .btn_block button:nth-child(1) {
    background-color: #562e8f;
  }
  .div5 .btn_block button:nth-child(2) {
    background-color: #8e3b95;
  }

  .div6 span {
    color: #9095a1;
  }
  .div6 {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: visible;
    position: relative;
  }

  .div6 .notification-btn {
    position: relative;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    margin: 0 10px;
  }

  .div6 .notification-btn .badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: #dc3545; /* Red notification badge */
    color: white;
    padding: 5px;
    font-size: 0.75rem;
    border-radius: 50%;
  }

  .div6 .profile-btn {
    background: none;
    border: none;
    margin-left: 10px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .div6 .profile-icon {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    overflow: hidden;
  }

  .div6 .caret-down {
    margin-left: 5px;
    color: #9095a1;
    font-size: 15px;
  }
  .web_view {
    display: flex;
  }
  .mob_view {
    display: none;
  }
  .user_Opts_block {
    position: absolute;
    top: 101%;
    right: 5px;
    box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px,
      rgba(0, 0, 0, 0.23) 0px 6px 6px;
    z-index: 2000;
    min-width: 150px;
  }
  .user_Opts_block button {
    background: none;
    padding: 10px;
    border: none;
  }

  @media (max-width: 770px) {
    .div2,
    .div3,
    .div4,
    .div5,
    .div6 {
      background-color: #f0f0f0;
      /* padding: 10px; */
    }
    .web_view {
      display: none;
    }
    .mob_view {
      display: flex;
    }
  }
  @media (max-width: 910px) {
    .web_view .div6 {
      flex-direction: column;
    }
  }
`;
