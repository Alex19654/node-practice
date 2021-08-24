const keys = require("../keys/index");

module.exports = function (email) {
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: "Registration is succesfull!",
    html: `
			<h1>Welcome to our store!</h1>
			<p>You succesfully created account with ${email}</p>
			<hr />
			<a href="${keys.BASE_URL}">Shop</a>
		`,
  };
};
