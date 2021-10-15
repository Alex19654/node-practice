const keys = require("../keys/index");

module.exports = function (email, token) {
  return {
    from: keys.EMAIL_FROM,
    to: email,
    subject: "Reset password",
    text: `
			  <h1>Did you forget password?</h1>
			  <p>If you didn't send any form, just ignore this mail.</p>
			  <p>Otherwise, click link below:</p>
			  <p><a href="${keys.BASE_URL}/auth/password/${token}">Reset password</a></p>
			  <hr />
			  <a href="${keys.BASE_URL}">Shop</a>
		  `,
  };
};
