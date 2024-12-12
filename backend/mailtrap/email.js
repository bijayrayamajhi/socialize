import { transporter } from "./index.js";
import {
  generatePasswordResetEmailHtml,
  generateResetSuccessEmailHtml,
  generateWelcomeEmailHtml,
  sendVerificationEmailHtml,
} from "./htmlEmail.js";

export const sendVerificationEmail = async (
  username,
  email,
  verificationToken
) => {
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "Verify Your Email",
    html: sendVerificationEmailHtml(username, verificationToken),
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Failed to send verification email:", error.message);
    throw new Error("Failed to send verification email!");
  }
};

// Sends a welcome email
export const sendWelcomeEmail = async (email, username) => {
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: `Hi ${username}, Welcome to Socializee! We're glad to have you here.`,
    html: generateWelcomeEmailHtml(username),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Failed to send welcome email:", error.message);
    throw new Error("Failed to send welcome email!");
  }
};

// Sends a password reset email
export const sendPasswordResetEmail = async (email, resetURL) => {
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "Reset your password",
    html: generatePasswordResetEmailHtml(resetURL),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Failed to send password reset email:", error.message);
    throw new Error("Failed to send password reset email!");
  }
};

// Sends a password reset success email
export const sendResetSuccessEmail = async (email) => {
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: "Password Reset Successfully",
    html: generateResetSuccessEmailHtml(),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error(
      "Failed to send password reset success email:",
      error.message
    );
    throw new Error("Failed to send password reset success email!");
  }
};
