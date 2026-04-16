import dayjs from "dayjs";
import { globalNavigate } from "../routes/globalRoute";
import { routePath } from "../routes/routepath";
import { toast } from "react-toastify";

const checkTokenExpiration = () => {
  const expireDate = localStorage.getItem("tokenExpire");
  const tokenExpireDate = expireDate ? new Date(expireDate) : null;
  const userToken = !!localStorage.getItem("token");
  const currentDate = new Date();
  if (
    !userToken ||
    !tokenExpireDate ||
    currentDate.getTime() > tokenExpireDate.getTime()
  ) {
    globalNavigate(routePath.login);
    return;
  }
};

export default checkTokenExpiration;
