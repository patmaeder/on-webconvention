import nodemailer, { SendMailOptions, SentMessageInfo } from "nodemailer";
import { createNodeMailerFallback } from "~/backend/setup/nodeMailerFallback";

export type Mailer = {
  sendMail(
    mail: SendMailOptions,
    callback: (error: Error, info: SentMessageInfo) => void
  ): void;
  sendMail(mail: SendMailOptions): Promise<SentMessageInfo>;
};

const verifyNodeMailerConfiguration = (transporter) =>
  new Promise<void>((resolve, reject) => {
    transporter.verify(function (error) {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

export const setupNodeMailer = async (): Promise<Mailer> => {
  let mailer;

  if (process.env.NODE_ENV !== "development") {
    console.log(
      "[Mail]",
      "Mailing in production environments is not supported yet."
    );
  }

  try {
    mailer = nodemailer.createTransport({
      host: "localhost",
      port: 1025,
      secure: false,
      logger: true,
      debug: true,
    });
    await verifyNodeMailerConfiguration(mailer);
  } catch (error) {
    console.log(
      "[Mail]",
      "Could not connect to development mailing server. Preparing fallback."
    );

    mailer = createNodeMailerFallback();
  }

  return mailer;
};
