export const ErrorHandler = (navigate, errorType) => {
  const routes = {
    expired: "/link-expired",
    invalid: "/invalid",
    session: "/session-expired",
  };

  navigate(routes[errorType] || "/not-found");
};