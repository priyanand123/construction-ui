import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { resetPasswordReq } from "../../api/authApi/passwordReq";
import { routePath } from "../../app/routes/routepath";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import RenderIf from "../../app/components/renderif";
import { FullLogo } from "../../app/components/logoButton";

const bg_img = require("../../app/assets/man.png");
const log_img = require("../../app/assets/Constructionlogo.png");
document.title =  "Reset Password";

const ResetPasswordPage = () => {
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  const navigation = useNavigate();
  const location = useLocation();
  const query = useQuery();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [email, setEmail] = useState("");
  const [verificationText, setVerificationText] = useState("");
  const [validParams, setValidParams] = useState(true);
  const [resetPswdDone, setresetPswdDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const emailParam = query.get("email");
    const verificationTextParam = query.get("verificationText");
    if (emailParam && verificationTextParam) {
      setEmail(emailParam);
      setVerificationText(verificationTextParam);
    } else {
      setValidParams(false);
    }
  }, [query]);

  if (!validParams) {
    return navigation(routePath.login); // Redirect to home if parameters are missing
  }

  const validatePassword = (value) => {
    if (value.length < 6) {
      return "Password must be at least six characters long";
    }
    if (/\s/.test(value)) {
      return "Password cannot contain spaces";
    }
    if (value === email) {
      return "Password cannot match your email address";
    }
    return true;
  };

  const onSubmit = async (data) => {
    try {
      const res = await resetPasswordReq({
        username: email,
        password: data?.newPassword,
      });
      setresetPswdDone(true);
    } catch (error) {
      toast.error(error?.errorMsg);
    }
  };

  const navigateToLogin = () => {
    navigation(routePath.login);
  };
  return (
    <PageContainer>
      <div className="row m-0 p-0 h-100 d-flex flex-column align-items-center">
        <div className="col-xl-4 col-lg-6 col-md-7 col-10 px-0 m-0 h-100 d-flex flex-column">
          <HeaderSection className="sectionBlock justify-content-center">
            <div className="align-self-center">
              <FullLogo clickable />
            </div>
          </HeaderSection>

          <FormSection className="sectionBlock">
            &nbsp;
            <h2 className="align-self-center">Reset your password</h2>
            &nbsp;
            <RenderIf isShow={!!resetPswdDone}>
              <h6 className="py-1 b heading_font align-self-center mx-3 text-center">
                Your password has been reset successfully. Please log in with
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
            <RenderIf isShow={!resetPswdDone}>
              <form
                className="needs-validation"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div>
                  <label className="mb-1 mt-2">New Password*</label>
                  <div>
                    <small>
                      Your password must be at least six characters and cannot
                      contain spaces or match your email address
                    </small>
                  </div>
                  <div className="position-relative">
                    <input
                      type={showPassword ? "text" : "password"}
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
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: "pointer" }}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                    {errors.newPassword && (
                      <small className="text-danger">
                        {errors?.newPassword?.message}
                      </small>
                    )}
                  </div>
                </div>
                <div>
                  <label className="mb-1 mt-3">Confirm New Password*</label>
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
                    Reset Password
                  </button>
                </div>
                &nbsp;
              </form>
            </RenderIf>
          </FormSection>

          <BottomSection className="sectionBlock">
            &nbsp;
            <div className="d-flex align-items-center flex-column mt-2">
              <label className="p-0 m-0">
                Need a Proteus Predict account for your work?
              </label>
              <a className="p-0 m-0" href="mailto:hello@proteuspredict.com.au">
                Contact Admin
              </a>
            </div>
            &nbsp;
            <div className="logo_block align-self-center">
              <img src={log_img} alt="" />
            </div>
            &nbsp;
            <div className="d-flex align-items-center flex-column">
              <label className="p-0 m-0">
                © 2024 All rights reserved Proteus Predict:
              </label>
              <label className="p-0 m-0">Sydney, Australia.</label>
            </div>
            &nbsp;
          </BottomSection>
        </div>
      </div>
    </PageContainer>
  );
};

export default ResetPasswordPage;

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
