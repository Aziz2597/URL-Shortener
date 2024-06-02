//Stateless authentication using JWT.
//Meaning user is retained even if server is restarted
const jwt = require("jsonwebtoken");
const secret = "Aziz@123"

function setUser(user) {
  return jwt.sign({
    _id: user._id,
    email: user.email,
    role: user.role,
  }, secret);
}
// Function to get user information for a given session ID
function getUser(token) {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
  
}

// Export setUser and getUser functions
module.exports = {
  setUser,
  getUser,
};