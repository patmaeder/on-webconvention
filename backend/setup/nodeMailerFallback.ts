import { SendMailOptions } from "nodemailer";
import { convert as convertHTMLtoText } from "html-to-text";
import { v4 as uuidv4 } from "uuid";
import Table from "cli-table3";

const getMailText = (mail: SendMailOptions): string => {
  let html = convertHTMLtoText(mail.html as string);

  return html;
};

const filterLinksInString = (text: string) => {
  let urlRegex =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

  let urls = [];

  text.match(urlRegex).forEach((element) => {
    urls.push(element);
  });

  return { text: text.replaceAll(urlRegex, "<URL>"), urls: urls };
};

export const createNodeMailerFallback = () => {
  return {
    sendMail: async function (mail: SendMailOptions, callback = () => {}) {
      let table = new Table({
        colWidths: [10, 80],
        wordWrap: true,
      });

      let filteredText = filterLinksInString(
        (mail.text as string) || getMailText(mail)
      );

      table.push(
        [{ colSpan: 2, content: "~~ Outgoing mail ~~" }],
        ["sentAt", new Date().toLocaleString()],
        ["to", mail.to as string],
        ["from", mail.from as string],
        ["subject", mail.subject],
        ["text", filteredText.text]
      );

      console.log(table.toString());

      filteredText.urls.forEach((url) => {
        console.log("➜️", url);
      });

      // end mail with separator if links were shown
      if (filteredText.urls) {
        console.log("");
      }

      callback();

      return { messageId: uuidv4() };
    },
  };
};
