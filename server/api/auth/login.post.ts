import { CompatibilityEvent, sendError } from "h3";
import isEmail from "validator/es/lib/isEmail";
import jwt from "jsonwebtoken";
import setupServer, { TokenType, useServer } from "~/server";
import { LoginTokenPayload } from "~/server/auth";

type LoginEmailProps = { username: string; link: string };

const loginEmailTemplate = ({ username, link }: LoginEmailProps) => `
  <div style='font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">
    <p style="font-size: 24px; font-weight: 700"><b>Hallo ${username},</b></p>
    <p>du hast versucht dich auf unserer Plattform einzuloggen.</p><p>Klicke auf den folgenden Link um loszulegen: <a href="${link}">Jetzt einloggen</a></p>
    <p>Falls du nicht für unsere Plattform registriert hast, kannst du diese E-Mail ignorieren.</p>
  </div>
`;

const getVerificationURL = (token: string) =>
  `${process.env.MAIL_HOST}/api/auth/verify?token=${token}`;

const createToken = ({ email }) => {
  let payload: LoginTokenPayload = {
    email: email,
    type: TokenType.LOGIN,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

const sendLoginMail = async ({ name, email }) => {
  const { mailer } = await useServer();

  const token = createToken({ email });
  const verificationURL = getVerificationURL(token);

  const mailOptions = {
    from: "info@web-engineering.ddev.site",
    html: loginEmailTemplate({
      username: name,
      link: verificationURL,
    }),
    subject: "Deine Anmeldung auf unserer Event-Plattform",
    to: email,
  };

  let info = await mailer.sendMail(mailOptions);
  console.log(`Login request sent to user <${email}> ${info.messageId}`);
};

export default defineEventHandler(async (event: CompatibilityEvent) => {
  const { email } = await useBody(event);

  if (!email) {
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
    console.log(`Login attempt for inexisting user <${email}>. Prevent.`);

    return {
      success: false,
      message: "User does not exist.",
    };
  }

  try {
    await sendLoginMail({ name: existingUser.name, email });
  } catch (error) {
    console.log(error);
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
      "Login attempt succeeded. You will receive a confirmation email in the next minutes.",
  };
});
