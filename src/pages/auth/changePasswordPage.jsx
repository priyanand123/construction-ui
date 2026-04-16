import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { changePasswordReq } from "../../api/authApi/passwordReq";
import { FullLogo } from "../../app/components/logoButton";
import RenderIf from "../../app/components/renderif";
import { routePath } from "../../app/routes/routepath";
document.title =   "Change Password";

const log_img = require("../../app/assets/Constructionlogo.png");

const ChangePasswordPage = ({ asComponent, data }) => {
  const navigation = useNavigate();
  const location = useLocation();
  const userEmail = location?.state?.userEmail || data?.userEmail;

  const [pswdChanged, setpswdChanged] = useState(false);
  const [reqLoading, setreqLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const userEmailAddress = "";

  const validatePassword = (value) => {
    if (value.length < 6) {
      return "Password must be at least six characters long";
    }
    if (/\s/.test(value)) {
      return "Password cannot contain spaces";
    }
    if (value === userEmailAddress) {
      return "Password cannot match your email address";
    }
    return true;
  };

  const onSubmit = async (data) => {
    try {
      setreqLoading(true);
      await changePasswordReq({
        username: userEmail || "",
        oldPassword: data?.oldPassword,
        newPassword: data?.newPassword,
      });
      !asComponent && setpswdChanged(true);
      setreqLoading(false);
      toast.success("Password change is successful.");
      asComponent &&
        setTimeout(() => {
          navigateToLogin();
        }, 1500);
    } catch (error) {
      setreqLoading(false);
      toast.error(error?.errorMsg);
    }
  };

  const navigateToLogin = () => {
    navigation(routePath.login);
  };

  return (
    <PageContainer className={asComponent && "w-100 h-100 pb-5"}>
      <div className="row  m-0 p-0 h-100 d-flex flex-column align-items-center">
        <div
          className={`col-xl-4 col-lg-6 col-md-7 col-10  px-0 m-0 h-100 d-flex flex-column ${
            asComponent && "col-xl-6 col-lg-8 col-md-11 col-11"
          }`}
        >
          {!asComponent && (
            <HeaderSection className="sectionBlock  justify-content-center">
              <div className="align-self-center">
                <FullLogo clickable />
              </div>
            </HeaderSection>
          )}

          <FormSection className="sectionBlock ">
            &nbsp;
            <h2 className="align-self-center">{"Change Password"}</h2>
            &nbsp;
            <RenderIf isShow={!!pswdChanged}>
              <h6 className="py-1 b heading_font align-self-center mx-3 text-center">
                Your password has been changed successfully. Please log in with
                your new password.
              </h6>
              &nbsp;
              <div className="mt-4">
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={navigateToLogin}
                    className="btn btn-dark btn-small w-100"
                  >
                    Go to login
                  </button>
                </div>
              </div>
            </RenderIf>
            <RenderIf isShow={!pswdChanged}>
              <form
                className="needs-validation"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div>
                  <label className="mb-1 mt-2">Old Password*</label>
                  <div className="position-relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      className={`form-control ${
                        errors.oldPassword && "border-danger"
                      }`}
                      {...register("oldPassword")}
                      required={true}
                    />
                    <span
                      className="position-absolute end-0 top-50 translate-middle-y pe-3"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      style={{ cursor: "pointer" }}
                    >
                      {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                    {errors.oldPassword && (
                      <small className="text-danger">Invalid password</small>
                    )}
                  </div>
                </div>
                <div className="mt-2">
                  <label className="mb-1 mt-2">New Password*</label>
                  <div>
                    <small>
                      Your password must be at least six characters and cannot
                      contain spaces or match your email address
                    </small>
                  </div>
                  <div className="position-relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      className={`form-control ${
                        errors.newPassword && "border-danger"
                      }`}
                      {...register("newPassword", {
                        validate: validatePassword,
                      })}
                      required={true}
                    />
                    <span
                      className="position-absolute end-0 top-50 translate-middle-y pe-3"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={{ cursor: "pointer" }}
                    >
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                    {errors.newPassword && (
                      <small className="text-danger">
                        {errors.newPassword?.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="mt-2">
                  <label className="mb-1 mt-2">Confirm New Password*</label>
                  <div className="position-relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className={`form-control ${
                        errors.confirmPassword && "border-danger"
                      }`}
                      {...register("confirmPassword", {
                        validate: (value) =>
                          value === watch("newPassword") ||
                          "Password didn't match",
                      })}
                      required={true}
                    />
                    <span
                      className="position-absolute end-0 top-50 translate-middle-y pe-3"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                    {errors.confirmPassword && (
                      <small className="text-danger">
                        {errors?.confirmPassword?.message}
                      </small>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="submit"
                    className="btn btn-dark btn-small w-100"
                  >
                    Update Password{" "}
                    {reqLoading && (
                      <div
                        className="spinner-border text-light "
                        role="status"
                      ></div>
                    )}
                  </button>
                </div>
              </form>
            </RenderIf>
          </FormSection>

          {!asComponent && (
            <BottomSection className="sectionBlock ">
              &nbsp;
              <div className="d-flex align-items-center flex-column  mt-2">
                <label className="p-0 m-0">
                  Need a Proteus Predict account for your work?
                </label>
                <a
                  className="p-0 m-0"
                  href="mailto:hello@proteuspredict.com.au"
                >
                  Contact Admin
                </a>
              </div>
              &nbsp;
              <div className="logo_block align-self-center">
                <img src={log_img} alt="" />
              </div>
              &nbsp;
              <div className="d-flex align-items-center flex-column ">
                <label className="p-0 m-0">
                  © 2024 All rights reserved Proteus Predict:
                </label>
                <label className="p-0 m-0">Sydney, Australia.</label>
              </div>
              &nbsp;
            </BottomSection>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default ChangePasswordPage;

const PageContainer = styled.div`
  box-sizing: border-box;
  height: 100vh;
  width: 100vw;
  background-color: white;
  display: flex;
  flex-direction: column;

  .logo_block {
    width: 60px;
    height: 60px;
  }
  .logo_block img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
  .sectionBlock {
    display: flex;
    flex-direction: column;
  }
`;

const HeaderSection = styled.div`
  flex: 0.6;
`;
const FormSection = styled.div`
  flex: 1;
`;
const BottomSection = styled.div`
  flex: 1;
  justify-content: space-around;
`;
