import { CompatibilityEvent, sendError } from "h3";
import isEmail from "validator/es/lib/isEmail";
import jwt from "jsonwebtoken";
import setupServer, { TokenType, useServer } from "~/server";
import { RegistrationTokenPayload } from "~/server/auth";

// token läuft nach 15 Minuten ab, aber Account wird nicht gelöscht. -> d.h. Account automatisch löschen oder erst nach Verifizierung speichern.

type RegistrationEmailProps = { username: string; link: string };

const registrationEmailTemplate = ({
  username,
  link,
}: RegistrationEmailProps) => `
  <div style='font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">
    <p style="font-size: 24px; font-weight: 700"><b>Hallo ${username},</b></p>
    <p>du hast dich erfolgreich auf unserer Plattform registriert!</p><p>Klicke auf den folgenden Link um loszulegen: <a href="${link}">${link}</a></p>
    <p>Falls du nicht für unsere Plattform registriert hast, kannst du diese E-Mail ignorieren.</p>
  </div>
`;

const getVerificationURL = (token: string) =>
  `${process.env.MAIL_HOST}/api/auth/confirm?token=${token}`;

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

const sendRegistrationMail = async ({ name, email }) => {
  const { mailer } = await useServer();

  const token = createToken({ name, email });
  const verificationURL = getVerificationURL(token);

  const mailOptions = {
    from: "info@web-engineering.ddev.site",
    html: registrationEmailTemplate({
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
        statusMessage: "Payload does not match requirements.",
      })
    );
    return;
  }

  if (!isEmail(email)) {
    sendError(
      event,
      createError({
        statusCode: 400,
        statusMessage: "Given email address is invalid.",
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

  if (!existingUser) {
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
  }

  return {
    success: true,
    message:
      "Registration attempt succeeded. You will receive a confirmation email in the next minutes.",
  };
});
