import { CompatibilityEvent, sendError } from "h3";
import isEmail from "validator/es/lib/isEmail";
import jwt from "jsonwebtoken";
import { TokenType, useServer } from "~/backend";
import { RegistrationTokenPayload } from "~/backend/auth";
import getRegistrationEmailMarkup from "~/server/mail/registration-email-template";

type RegistrationEmailProps = { username: string; link: string };

const getVerificationURL = (token: string) =>
  `${process.env.BASE_URL}/api/auth/confirm?token=${token}`;

const createToken = ({ name, email }) => {
  let payload: RegistrationTokenPayload = {
    name: name,
    email: email,
    type: TokenType.REGISTRATION,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

const getRegistrationEmailTemplate = ({
  username,
  link,
}: RegistrationEmailProps) =>
  getRegistrationEmailMarkup({ username, link, baseURL: process.env.BASE_URL });

const sendRegistrationMail = async ({ name, email }) => {
  const { mailer } = await useServer();

  const token = createToken({ name, email });
  const verificationURL = getVerificationURL(token);

  const mailOptions = {
    from: process.env.MAIL_FROM_ADDRESS,
    html: getRegistrationEmailTemplate({
      username: name,
      link: verificationURL,
    }),
    subject: "Willkommen auf unserer Event-Plattform",
    to: email,
  };

  let info = await mailer.sendMail(mailOptions);
  console.log(
    "[Auth]",
    `Registration request sent to user <${email}> ${info.messageId}`
  );
};

export default defineEventHandler(async (event: CompatibilityEvent) => {
  const { name, email } = await useBody(event);

  if (!name || !email) {
    sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage:
          "Du musst eine E-Mail-Adresse und einen Benutzernamen angeben.",
      })
    );
    return;
  }

  if (!isEmail(email)) {
    sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Deine E-Mail-Adresse ist ungültig.",
      })
    );
    return;
  }

  const { prisma } = await useServer();

  const existingUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (existingUser) {
    console.log("[Auth]", `User <${email}> is already registered.`);
    sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage:
          "Ein Benutzer mit dieser E-Mail-Adresse ist bereits registriert.",
      })
    );
  }

  try {
    await sendRegistrationMail({ name, email });
  } catch (error) {
    console.log("[Auth]", error);
    sendError(
      event,
      createError({
        statusCode: 500,
      })
    );

    return;
  }

  return {
    success: true,
    message:
      "Deine Registrierung verlief erfolgreich. Du erhälst gleich eine E-Mail zur Bestätigung.",
  };
});
