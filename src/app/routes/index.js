import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { routePath as RP } from "./routepath";

import RootLayout from "../../pages/layout/rootlayout";
import Layout from "../components/layout";
import ChangePasswordPage from "../../pages/auth/changePasswordPage";
import LoginPage from "../../pages/auth/loginPage";

import ResetPasswordPage from "../../pages/auth/resetPasswordPage";
import ForgotPasswordPage from "../../pages/auth/forgotPasswordPage";

import Dashboard from "../../pages/dashboard/dashboard";
import Users from "../../pages/user/users";
import Purchase from "../../pages/purchase/purchase";
import RawMaterial from "../../pages/rawmaterial/rawmaterial";
import Units from "../../pages/units/units";
import Machinelog from "../../pages/machinelog/machinelog";
import MaterialHistory from "../../pages/materialhistory/materialhistory";
import Stock from "../../pages/stock/stock";
import Profile from "../../pages/profile/userprofile";
import CompancyDetails from "../../pages/compancydetails/updatecompancydetails";
import Billing from "../../pages/readytodispatch/billing";
import DeliveryChalen from "../../pages/readytodispatch/deliverychalen";
import PdfViewerPage from "../components/tableCmp/pdfViewerPage";
import TransportDetails from "../../pages/transportdetails/transportDetails";

const AppRoute = () => {

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Navigate to={RP.login} replace />} />
        <Route path={RP.login} element={<LoginPage />} />
        <Route path={RP.forgotpassword} element={<ForgotPasswordPage />} />
        <Route path={RP.resetpassword} element={<ResetPasswordPage />} />
        <Route path={RP.changepassword} element={<ChangePasswordPage />} />
        <Route path={RP.main} element={<RootLayout />}>
        <Route path={RP.dashboard} element={<Dashboard />} />
        <Route path={RP.user} element={<Users />} />
        <Route path={RP.purchase} element={<Purchase />} />
        <Route path={RP.rawmaterial} element={<RawMaterial />} />
        <Route path={RP.units} element={<Units />} />
        <Route path={RP.machinelog} element={<Machinelog />} />
        <Route path={RP.materialhistory} element={<MaterialHistory />} />
        <Route path={RP.stock} element={<Stock />} />
        <Route path={RP.profile} element={<Profile />} />
        <Route path={RP.compancydetails} element={<CompancyDetails />} />
        <Route path={RP.billing} element={<Billing />}/>
          <Route path={RP.deliverychalen} element={<DeliveryChalen />}/>
        <Route path={RP.transport} element={<TransportDetails />}/>

       
        <Route path="pdfViewerPage" element={<PdfViewerPage />} />
        </Route>
      </Routes>
    </Router>
  );
};
export default AppRoute;


