import { mongoose } from '@typegoose/typegoose';
import { BadRequestError } from 'routing-controllers';
import _ from 'lodash';

import ErrorHandler, { ConflictError, UnprocessableEntityError } from '../../../middlewares/errors';
import { UserType, WalletDTO } from '../../../contracts/user.contracts';

import {
  AuthRegisterRequest,
  TokenPayload,
  ProfileObject,
  AuthRegisterResponse,
} from '../../../contracts/auth.contracts';
import { UserModel } from '../../models/user.model';
import logger from '../../../utils/logger';
import EmailService from './email.service';

const mailService = new EmailService();

export class SignupService {
  /**
 * auth: {
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    user: 'sdf@domain.com',
    pass: 'baokdoas',
  },
 */

  public async createUserAccount(data: AuthRegisterRequest): Promise<AuthRegisterResponse> {
    try {
      const { business, ...customerData } = data;

      if (_.isEmpty(data)) throw new BadRequestError('User Data is Required');

      if (data.role === UserType.BUSINESS && _.isEmpty(business))
        throw new BadRequestError('Business Details Required');

      const emailRegistered = await UserModel.findOne({ email: data.email });
      if (emailRegistered) throw new ConflictError('Email is already associated with another account');

      const phoneRegistered = await UserModel.findOne({ phone: data.phone });
      if (phoneRegistered) throw new ConflictError('Phone Number is already associated with another account');

      const signUpData = data.role === UserType.BUSINESS ? data : customerData;

      const generatedId = mongoose.Types.ObjectId().toHexString();

      // initial wallet
      const wallet: WalletDTO = {
        balance: 0,
        promoDiscounts: 0,
        referalBonus: 0,
        transactions: [],
      };
      const newUser = await UserModel.create({
        ...signUpData,
        _id: generatedId,
        userId: generatedId,
        wallet,
        business: null,
      });

      if (!newUser) throw new UnprocessableEntityError('There was a problem creating your Account');

      const { email, userId, profile } = newUser;

      const { name } = profile as ProfileObject;
      const tokenPayload: TokenPayload = {
        userId,
        email,
        name,
      };

      mailService.sendEmailVerification(tokenPayload);

      return { userId: newUser.userId.toString() };
    } catch (err) {
      logger.error(`[SignupService:createUserAccount]: ${err}`);
      throw new ErrorHandler(err);
    }
  }
}
