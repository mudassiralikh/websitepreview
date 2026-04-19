const nodemailer = require("nodemailer");

exports.handler = async function(event) {

  // Handle preflight CORS request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      },
      body: ""
    };
  }

  try {
    // Guard: ensure body exists and is not empty
    if (!event.body || event.body.trim() === "") {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ success: false, error: "Request body is empty" })
      };
    }

    const { to, subject, message } = JSON.parse(event.body);

    // Guard: ensure required fields are present
    if (!to || !subject || !message) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ success: false, error: "Missing required fields: to, subject, message" })
      };
    }

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.BREVO_FROM,
      to: to,
      subject: subject,
      text: message,
      html: `<p>${message}</p>`
    });

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: true })
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: false, error: err.message })
    };
  }

};
