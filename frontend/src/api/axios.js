import axios from "axios";

const API = axios.create({
  baseURL: "https://mooninterview.onrender.com/api",
});


API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

API.interceptors.response.use(
  (response) => response,

  (error) => {

    /*console.log(
      "FAILED API:",
      error.config?.url
    );
     console.log(
      error.response?.data)*/

   if (
      error.response?.status === 401 &&
      error.response?.data?.type === "session"
    ) {

      localStorage.clear();

      window.location.href = "/session-expired";
    }
    if (
      error.response?.status === 403 &&
      error.response?.data?.type === "organisation_expired"
    ) {
      alert(`
        Organisation subscription expired.
        Please contact MoonInterview support to renew your subscription.
        `)
    }
      if (
      error.response?.status === 403 &&
      error.response?.data?.type === "completed"
    )
      {
        localStorage.clear();
        window.location.href="/candidate/thankyou";
      }

    return Promise.reject(error);
  }
);

export default API;
