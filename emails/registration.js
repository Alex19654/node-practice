const keys = require("../keys/index");

module.exports = function (email) {
  return {
    from: "Mailgun Sandbox <postmaster@sandboxfcf7957f54064111b8afe436bd8a83d1.mailgun.org>",
    to: email,
    subject: "Registration is succesfull!",
    text: `
			<h1>Welcome to our store!</h1>
			<p>You succesfully created account with </p>
			<hr />
			<a href="${keys.BASE_URL}">Shop</a>
		`,
  };
};
