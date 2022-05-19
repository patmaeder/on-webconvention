export default defineEventHandler(async () => {
  // kontrolliere ob benutzer existiert
  // token generieren mit gültigkeit von zwei minuten (+ neuer refreshtoken)
  // -> per mail versenden

  const userData = await user.get(null, req.body.email);

  if (!userDate) {
    return;
  }

  // generate a token that expires in 5 mins
  const token = await auth.token({ id: userData.id }, null, 300);

  // send email
  await mail.send({
    to: userData.email,
    template: "magic_signin",
    content: {
      token: token,
    },
  });
});
