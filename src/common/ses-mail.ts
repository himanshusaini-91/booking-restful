// Load the AWS SDK for Node.js
import AWS from "aws-sdk";
import config from "config";

import path from "path";
import SesRawCompose from "./ses-raw-compose";
const fsPromises = require("fs").promises;

export default class SesMail {

  private readonly rawCompose: any;
  constructor() {
      AWS.config.update({ region: config.get<string>("aws-ses.region"),
          accessKeyId: config.get<string>("aws-ses.accessKeyId"),
          secretAccessKey: config.get<string>("aws-ses.secretAccessKey") });
      this.rawCompose = new SesRawCompose();
  }

  public async sendMail(to: string[], cc: string[], bcc: string[], html: any, text: any, subject: any, from: any, attachments: any) {
      const rawParams = {
          RawMessage: {
              Data: this.rawCompose.rawMessage(config.get<string>("aws-ses.from_name"), from, to, cc, bcc, subject, text, html, attachments).join("\n")
          },
          Source: from
      };

      const sendPromise = new AWS.SES().sendRawEmail(rawParams).promise();

      // Handle promise's fulfilled/rejected states
      sendPromise.then(
          (data: any) => {
              console.log(`Mail sent! messageId is: ${data.MessageId}`);
          }).catch(
          (err: any) => {
              console.log(`Mail error: ${err} ${err.stack}`);
          });
  }

}
