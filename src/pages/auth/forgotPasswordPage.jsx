import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { forgotPasswordReq } from "../../api/authApi/passwordReq";
import { FullLogo } from "../../app/components/logoButton";
import { routePath } from "../../app/routes/routepath";
import RenderIf from "../../app/components/renderif";

const log_img = require("../../app/assets/Constructionlogo.png");

const ForgotPasswordPage = () => {
  const navigation = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const [isMailSent, setisMailSent] = useState(false);
  const [requestLoading, setrequestLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setrequestLoading(true);
      await forgotPasswordReq(data?.email);
      setisMailSent(true);
      setrequestLoading(false);
    } catch (error) {
      setrequestLoading(false);
      toast.error(error?.errorMsg);
    }
  };

  const navigateToLogin = () => {
    navigation(routePath.login);
  };

  return (
    <PageContainer>
      <div className="row  m-0 p-0 h-100 d-flex flex-column align-items-center">
        <div className="col-xl-4 col-lg-6 col-md-7 col-10  px-0 m-0 h-100 d-flex flex-column">
          <HeaderSection className="sectionBlock  justify-content-center">
            <div className="align-self-center">
              <FullLogo clickable />
            </div>
          </HeaderSection>

          <FormSection className="sectionBlock ">
            &nbsp;
            <RenderIf isShow={!isMailSent}>
              <h5 className="text-primary align-self-center">
                Password recovery
              </h5>
              &nbsp;
              <h6 className="py-1 b heading_font align-self-center mx-3 text-center">
                Enter the username.
              </h6>
            </RenderIf>
            <RenderIf isShow={!!isMailSent}>
              <h5 className="text-primary align-self-center">
                Reset Account Password!
              </h5>
              &nbsp;
              <h6 className="py-1 b heading_font align-self-center mx-3 text-center">
                An email has been sent to {watch("email")}. Check the inbox of
                your email account, and click the reset link provided.
              </h6>
            </RenderIf>
            &nbsp;
            <form
              className="needs-validation"
              onSubmit={handleSubmit(onSubmit)}
            >
              <RenderIf isShow={!isMailSent}>
                <div>
                  <label className="mb-1 mt-2">Email*</label>
                  <div>
                    <input
                      type="email"
                      className={`form-control ${
                        errors.email && "border-danger"
                      }`}
                      {...register("email", {
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Enter a valid email address",
                        },
                      })}
                      required={true}
                    />
                    {errors.email && (
                      <small className="text-danger">
                        Enter a valid email address.
                      </small>
                    )}
                  </div>
                </div>
              </RenderIf>
              &nbsp;
              <div className="mt-3 d-flex flex-column">
                <RenderIf isShow={!isMailSent}>
                  <button
                    type="submit"
                    className="btn bg-primary btn-primary border-0 align-self-center"
                  >
                    Continue{" "}
                    {requestLoading && (
                      <div className="spinner-border text-md text-white"></div>
                    )}
                  </button>
                </RenderIf>
                <RenderIf isShow={!!isMailSent}>
                  <button
                    type="button"
                    onClick={navigateToLogin}
                    className="btn bg-primary btn-primary border-0 align-self-center"
                  >
                    Go to login
                  </button>
                </RenderIf>
              </div>
              &nbsp;
            </form>
          </FormSection>

          <BottomSection className="sectionBlock ">
            &nbsp;
            <div className="d-flex align-items-center align-self-center">
              &nbsp;
              <label className="p-0 m-0">
                Need a proteus account for your work ?
              </label>
              <a
                className="px-2 py-0 m-0"
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
        </div>
      </div>
    </PageContainer>
  );
};

export default ForgotPasswordPage;

const PageContainer = styled.div`
  box-sizing: border-box;
  height: 100vh;
  width: 100vw;
  background-color: white;
  /* border: 3px solid red; */
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
    /* flex: 1; */
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
