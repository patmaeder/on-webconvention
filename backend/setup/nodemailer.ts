import nodemailer, { Transporter } from "nodemailer";

export const setupNodeMailer = (): Transporter => {
  let mailer;
  if (process.env.NODE_ENV === "development") {
    mailer = nodemailer.createTransport({
      host: "localhost",
      port: 1025,
      secure: false,
      logger: true,
      debug: true,
    });
  } else {
    throw "not supported yet";
  }

  return mailer;
};
