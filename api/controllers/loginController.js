const loginModel = require("../models/loginModel");
const UNKNOWN_ERROR = {
  message: "Unknown error",
  errorCode: 9999,
};
const crypto = require("crypto");
// la on le hash mais est le bonne endroit?
// const hashBuffer = await crypto.subtle.digest('SHA-256', data);
// const userPassHash = crypto.createHash("sha256").update(userSentPassword).digest("hex");


exports.login = async (req, res) => {
  console.log("---in controller debugLogin---");
  