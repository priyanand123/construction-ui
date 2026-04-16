import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { routePath } from "../../app/routes/routepath";
import styled from "styled-components";
import { userLoginReq } from "../../api/authApi/loginReq";
import { addUserAction } from "../../app/redux/slices/auth/authslice.jsx";
import { clearNotificationAction } from "../../app/redux/slices/notification/notificationSlice.jsx";
import { FullLogo } from "../../app/components/logoButton";
import { roleNames } from "../../app/constants/roleNames";
import { fetchCompanydetailsListAction } from "../../app/redux/slices/companydetails/companydetailsSlice.jsx";

const log_img = require("../../app/assets/logo.png");

const LoginPage = () => {
  document.title = "ASHBRICKS";
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigatedFromLogout = location?.state?.navigatedFrom === "logout";
  const previousPath = localStorage.getItem("previousPath");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loginErrMsg, setloginErrMsg] = useState("");
  const [loginLoading, setloginLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    debugger;
    setloginErrMsg("");
    setloginLoading(true);
    try {
      const res = await userLoginReq({
        userName: data?.email,
        password: data?.password,
      });
      addUserAction(res?.data, dispatch);
      dispatch(clearNotificationAction());
      await dispatch(fetchCompanydetailsListAction());
      const userType = localStorage.getItem("roleName");

      if (!navigatedFromLogout && !!previousPath) {
        navigation(previousPath);
        setloginLoading(false);
        return;
      }
      navigation(`${routePath.main}/${routePath.dashboard}`);

      
      setloginLoading(false);
    } catch (error) {
      setloginLoading(false);
      setloginErrMsg(error?.errorMsg);
    }
  };

  return (
    <PageContainer>
      <div className="row m-0 p-0 h-100 d-flex flex-column align-items-center">
        <div className="col-xl-4 col-lg-6 col-md-7 col-10 px-0 m-0 h-100 d-flex flex-column">
          <HeaderSection className="sectionBlock justify-content-center">
            <div className="col-12 d-flex justify-content-center my-0">
              <FullLogo />
            </div>
            
          </HeaderSection>
          <FormSection className="sectionBlock">
          &nbsp;
          <h2
              style={{             
               
               color: "#0194d9",
                fontWeight: "bold", textAlign: "center", fontSize:"400"
              }}
            >
              JKB ASH BRICKS
            </h2>
          
          <h2 style={{ fontWeight: "300", textAlign: "center" }}>
  Login to your account
</h2>
            {loginErrMsg && (
              <div className="alert alert-danger py-2 mt-2" role="alert">
                <li>{loginErrMsg} </li>
              </div>
            )}
            &nbsp;
            <form className="needs-validation" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="mb-1 mt-2">Username*</label>
                <input
                  type="text"
                  className={`form-control ${errors.email ? "border-danger" : ""}`}
                  {...register("email", {
                    pattern: {
                      value: /^[A-Z0-9._%+-]{2,}$/i,
                      message: "Enter a valid username",
                    },
                  })}
                  required
                />
                {errors.email && (
                  <small className="text-danger">Enter a valid username.</small>
                )}
              </div>
              <div style={{ marginTop: "15px" }}>
                <label className="mb-1 mt-2">Password*</label>
                <div className="position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-control ${errors.password ? "border-danger" : ""}`}
                    {...register("password")}
                    required
                  />
                  <span
                    className="position-absolute end-0 top-50 translate-middle-y pe-3"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: "pointer" }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                  {errors.password && (
                    <small className="text-danger">This field is required</small>
                  )}
                </div>
                {navigatedFromLogout && (
                  <div className="d-flex flex-column align-items-center">
                    <span className="text-danger">You have successfully logged out!</span>
                  </div>
                )}
              </div>
              <div className="mt-3">
                <button type="submit" className="btn btn-dark btn-small w-100">
                  Login{" "}
                  {loginLoading && <div className="spinner-border text-light" role="status"></div>}
                </button>
              </div>
            </form>
          </FormSection>
          <BottomSection className="sectionBlock">
            <div className="d-flex align-items-center flex-column mt-0">
              <label>Need Bricks Information About your Purchase?</label>
              <a href="mailto:ashbricks@gmail.com.au">Contact Admin</a>
            </div>
            <div className="logo_block align-self-center">
              <img src={log_img} alt="ASHBRICKS Logo" />
            </div>
            <div style={{ textAlign: "center" }}>
  <label style={{ margin: 0, padding: 0, lineHeight: "1.2" }}>
    © 2024 All rights reserved ASH BRICKS Predict:<br />
    5 Road, Salem.
  </label>
</div>
          </BottomSection>
        </div>
      </div>
    </PageContainer>
  );
};

export default LoginPage;

const PageContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const HeaderSection = styled.div`
  flex: 0.6;
  display: flex;
  justify-content: center;
`;

const FormSection = styled.div`
  flex: 1;
   h2 {
    font-weight: 400; 
    color: #333; 
    margin-top: 20px;
    font-size: 2.4em;
  }
`;

const BottomSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .d-flex.align-items-center.flex-column {
    padding: 0;
    text-align: center;
  }

  .logo_block {
    width: 70px;
    height: 70px;
    margin: 10px 0;
  }

  .logo_block img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    .d-flex.align-items-center.flex-column {
    margin: 0;
    padding: 0;
    line-height: 1.2; /* Adjust line-height to reduce space */
  }

  label {
    margin: 0;
    padding: 0;
    line-height: 1.2; /* Apply reduced line-height here */
  }
  }
`;
