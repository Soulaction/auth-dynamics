import {mailTransporter} from "../config/MailConfig";

export class MailService {
    async sendActivateLInk(to: string, link: string) {
        await mailTransporter.sendMail({
                from: process.env.SMTP_USER,
                to,
                subject: 'Активация акаунта',
                html: `Чтобы активировать акакунт необходимо подтвердить почтовый адресс по ссылке <a href="${link}">${link}</a>`
            },
            (err, info) => {
                console.log(err, info);
            })
    }
}

export default new MailService();
