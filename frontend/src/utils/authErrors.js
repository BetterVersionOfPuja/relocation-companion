const statusMessages = {
  400: "Please check the details and try again.",
  401: "Please sign in to continue.",
  404: "No account was found for those credentials.",
  409: "An account with this username or email already exists. Please sign in instead.",
};

const getTextFromResponse = (data) => {
  if (!data) return "";
  if (typeof data === "string" && !data.trim().startsWith("<")) return data;
  return data.message || data.error || "";
};

export const getAuthErrorMessage = (error, fallback) => {
  const status = error?.response?.status;
  const responseMessage = getTextFromResponse(error?.response?.data);

  return responseMessage || statusMessages[status] || fallback;
};
