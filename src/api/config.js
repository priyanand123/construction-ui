import axios from "axios";

const _ProductURL = "http://103.53.52.215:85/api";
//const _baseURL = "http://prasath-001-site6.ftempurl.com/api";
const _baseURL = "https://localhost:44331/api";
// const _baseURL = "https://gkamaraj-001-site1.qtempurl.com/api" //"https://localhost:7158/api"//http://gkamaraj-001-site1.qtempurl.com/api"//"https://localhost:7158/api" ////"http://prasath-001-site3.ftempurl.com/api" //;
const _userURL = "http://manojvgl-001-site4.ctempurl.com/api/";

export const authAxios = axios.create({
  // timeout: 60000,
  baseURL: _baseURL,
});
export const publicAxios = axios.create({
  // timeout: 60000,
  baseURL: _baseURL,
});

authAxios.interceptors.request.use(async (config) => {
  const access_token = localStorage.getItem("token");
  if (access_token != null && config.headers.Authorization === undefined) {
    config.headers.Authorization = `bearer ${access_token}`;
  }
  return config;
});

publicAxios.interceptors.request.use(async (config) => {
  config.headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  return config;
});
