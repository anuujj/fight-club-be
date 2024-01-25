const crypto = require("crypto");
const generateVerificationToken = () => {
  return crypto.randomBytes(16).toString("hex");
};
module.exports = {generateVerificationToken};