const fs = require("fs");
export default class SesRawCompose {

    public rawMessage(fromName: any, fromEmail: any, to: string[], cc: string[], bcc: string[], subject: any,
        plainText: any, html: any, attachments?: any) {
    // Set up from_name, from_email, to, subject, message_id, plain_text, html and configuration_set variables from database or manually

        const nTo = to.join(",");
        const nCc = cc.join(",");
        const nBcc = bcc.join(",");
        const date = new Date();

        const boundary = `----=_Part${Math.random().toString().substr(2)}`;
        const rawMessage = [
            `From: "${fromName}" <${fromEmail}>`, // Can be just the email as well without <>
            `To: ${nTo}`,
            `Cc: ${nCc}`,
            `Bcc: ${nBcc}`,
            `Subject: ${subject}`,
            "MIME-Version: 1.0",
            `Date: ${this.formatDate(date)}`,
            `Content-Type: multipart/alternative; boundary="${boundary}"`,
            "\n",
            `--${boundary}`,
            "Content-Type: text/plain; charset=UTF-8",
            "Content-Transfer-Encoding: 7bit",
            "\n",
            plainText,
            `--${boundary}`,
            "Content-Type: text/html; charset=UTF-8",
            "Content-Transfer-Encoding: 7bit",
            "\n",
            html
        ];

        if (attachments && attachments.length > 0) {
            for (const attachment of attachments) {
                const fileName = attachment.filename ? attachment.filename : undefined;
                const contents = attachment.path ? fs.readFileSync(attachment.path) : undefined;
                const base64content = contents ? contents.toString("base64") : undefined;

                rawMessage.push(`--${boundary}`);
                rawMessage.push(`Content-Type: application/pdf; name="${fileName}"`);
                rawMessage.push(`Content-Description: ${fileName}`);
                rawMessage.push(`Content-Disposition: attachment;filename="${fileName}";`);
                rawMessage.push(`creation-date="${this.formatDate(date)}";`);
                rawMessage.push("Content-Transfer-Encoding: base64");
                rawMessage.push("\n");
                rawMessage.push(base64content);
            }
        }

        return rawMessage;
    }

  // Outputs timezone offset in format ZZ
  private readonly getOffset = (date: any) => {
      const offset = - date.getTimezoneOffset();
      const offsetHours = Math.abs(Math.floor(offset / 60));
      const offsetMinutes = Math.abs(offset) - offsetHours * 60;
      const offsetSign = (offset > 0) ? "+" : "-";
      return offsetSign + (`0${offsetHours}`).slice(-2) + (`0${offsetMinutes}`).slice(-2);

  }

  // Outputs two digit inputs with leading zero
  private readonly leadingZero = (input: any) => (`0${input}`).slice(-2);

  // Formats date in ddd, DD MMM YYYY HH:MM:SS ZZ
  private readonly formatDate = (date: any) => {

      const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const weekday = weekdays[date.getDay()];
      const day = this.leadingZero(date.getDate());
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      const hour = this.leadingZero(date.getHours());
      const minute = this.leadingZero(date.getMinutes());
      const second = this.leadingZero(date.getSeconds());
      const offset = this.getOffset(date);

      return `${weekday}, ${day} ${month} ${year} ${hour}:${minute}:${second} ${offset}`;
  }

}
