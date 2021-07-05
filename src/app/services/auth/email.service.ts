import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { EmailDTO, TokenPayload } from '../../../contracts/auth.contracts';
import config from '../../../utils/config';
import logger from '../../../utils/logger';

/**
 * auth: {
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    user: 'sdf@domain.com',
    pass: 'baokdoas',
  },
 */

export default class EmailService {
  /**
   * THIS SHOULD NOT BE MODIFIED - EXP CONFIG.EMALCONFIG
   */

  private async sendMail(payload: EmailDTO) {
    const { recievers, serviceName, html, plainBody, subject } = payload;

    // send mail with defined transport object
    await nodemailer
      .createTransport(config.supportEmailConfig)
      .sendMail({
        from: ` ${serviceName} <noreply@tuagye.com>`, // sender address
        to: recievers.toLocaleString(), // list of receivers
        subject, // Subject line
        text: plainBody, // plain text body
        html, // html body
      })
      .then(() => {
        logger.info('Successfully Sent Verification Email');
      })
      .catch((err) => logger.error(err));
  }

  sendEmailVerification(payload: TokenPayload): Promise<void> {
    let token = jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.VERF_EXPIRE,
    });

    token = `${config.HOST}/${token}`;

    const emailPayload: EmailDTO = {
      name: payload.name,
      serviceName: 'Tuagye',
      recievers: [payload.email],
      subject: 'Email Verification ',
      plainBody: `Account Info : Email Verification`,
      html: `<p>Dear ${payload.name} </p>
      <p>Your account was successfully created successfully </p>
      <p> Verify your email address by clicking on this link <a>${token}</a></p>
        <p>Tuagye Team</p>
      `,
    };
    // sending verification token
    return this.sendMail(emailPayload);
  }

  public validateEmail(payload: TokenPayload) {
    let token = jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.VERF_EXPIRE,
    });

    token = `${config.HOST}/${token}`;

    const emailPayload: EmailDTO = {
      name: payload.name,
      serviceName: 'Tuagye',
      recievers: [payload.email],
      subject: 'Email Verification ',
      plainBody: `Verify your Email`,
      html: `<p>Dear ${payload.name} </p>
      <p>Your email verification request was recieved, uset this link <a>${token}</a></p>
        <p>Tuagye Team</p>
      `,
    };
    // sending verification token
    this.sendMail(emailPayload);
  }
}
