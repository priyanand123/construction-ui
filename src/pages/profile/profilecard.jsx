import dayjs from "dayjs";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { routePath } from "../../app/routes/routepath";
const profile_card_bg_img = require("../../app/assets/profile-card-bg-img.png");
const SYD_ICon = require("../../app/assets/man.png");
// import profileImg from "../../assets/images/man.png";

const ProfileCard = ({ data, onChangePswd }) => {
  const navigate = useNavigate();
  //const { firstName, surname, emailAddress, roleName } = data;
  const { profile } = useSelector((_state) => _state);
  const { name} = data;
  const profileImage = profile?.data?.photo
    ? `data:image/jpeg;base64,${profile?.data?.photo}`
    : SYD_ICon;
  return (
    <CardContainer className="card shadow overflow-hidden rounded">
      <div className="overflow-hidden">
        <div className="bg-primary bg-soft">
          <div className="row">
            <div className="col-7">
              <div className="text-primary p-3">
                <h5 className="text-primary">Welcome Back !</h5>
                <p>Bricking, clever little analytics</p>
              </div>
            </div>
            <div className="col-5 align-self-end">
             <img src={profile_card_bg_img} alt="" className="img-fluid" />
            </div>
          </div>
        </div>
        <div className="card-body pt-0">
          <div className="row">
            <div className="col-sm-4">
              <div className="avatar-md profile-user-wid mb-1">
                <span className="avatar-title bg-transparent rounded-circle w-100 h-100">
                  <img
                    src={profileImage}
                    alt=""
                    className="img-thumbnail rounded-circle h-100 w-100 "
                    style={{ objectFit: "contain" }}
                  />
                </span>
              </div>

              <h5 className="font-size-15 text-truncate">
               {/* {firstName || ""} {surname || ""}*/}
              </h5>
              <p className="text-muted mb-0 text-truncate">
               {/*{roleName || "None"}*/}
              </p>
            </div>
            <div className="col-sm-8">
              <div className="pt-4">
                <div className="row">
                  {/*<h5 className="font-size-15">{emailAddress || ""}</h5>*/}
                  <p className="text-muted mb-0">{name}</p>
                </div>
                <br />
                <div className="row">
                  <h5 className="font-size-15">
                    {dayjs().format("MMMM DD, YYYY, hh:mm a")}
                  </h5>
                  <p className="text-muted mb-0">Last Login</p>
                </div>
              </div>
              {/*<div className="mt-4">
                <button
                  type="button"
                  className="btn bg-white border outline-none border-1 rounded"
                  onClick={() =>
                    onChangePswd
                      ? onChangePswd()
                      : navigate(routePath.changepassword, {
                          state: { userEmail: emailAddress },
                        })
                  }
                >
                 Change Password
                </button>
              </div>*/}
            </div>
          </div>
        </div>
      </div>
    </CardContainer>
  );
};

export default ProfileCard;

const CardContainer = styled.div`
  font-family: "GT-Walsheim" !important;
  p {
    font-family: "GT-Walsheim" !important;
  }
`;
