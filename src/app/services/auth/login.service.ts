import _ from 'lodash';
import { BadRequestError } from 'routing-controllers';
import { EJSON } from 'bson';

import { AuthLoginRequest, AuthLoginResponse, TokenPayload } from '../../../contracts/auth.contracts';
import ErrorHandler, { ConflictError } from '../../../middlewares/errors';
import logger from '../../../utils/logger';
import { UserModel } from '../../models/user.model';
import EmailService from './email.service';

const mailService = new EmailService();

export class LoginService {
  public async loginUser(data: AuthLoginRequest): Promise<AuthLoginResponse> {
    try {
      if (_.isEmpty(data)) throw new BadRequestError('Parameters are required');

      if (_.isEmpty(data.phone) && _.isEmpty(data.email)) throw new ConflictError('Email or Phone is required');

      let userDocument;

      if (data.phone) {
        userDocument = await UserModel.findOne({ phone: data.phone });
      } else if (data.email) {
        userDocument = await UserModel.findOne({ email: data.email });
      }

      // check if user exist
      if (!userDocument) throw new ConflictError('Invalid Login Ceredentials');

      // check if password is valid
      const passwordMatch = await userDocument.validatePassword(data.password);

      if (!passwordMatch) throw new ConflictError('Invalid Login Ceredentials');

      const loginResponse = EJSON.deserialize({
        userId: userDocument.userId,
        email: userDocument.email,
        phone: userDocument.phone,
        role: userDocument.role,
        profile: userDocument.profile,
        wallet: userDocument.wallet,
        business: userDocument.business,
      }) as AuthLoginResponse;

      return loginResponse;
    } catch (err) {
      logger.error(`[LoginService:createUserAccount]: ${err}`);
      throw new ErrorHandler(err);
    }
  }

  public async validateEmailAddress(email: string): Promise<string> {
    if (_.isNull(email)) throw new BadRequestError('Email Address Required');

    const userDocumentExist = await UserModel.findOne({ email });

    if (!userDocumentExist) throw new ConflictError('User does not Exist');

    const payload: TokenPayload = {
      name: userDocumentExist.profile.name,
      email: userDocumentExist.email,
      userId: userDocumentExist.userId,
    };
    const d = new Date();

    await mailService.validateEmail(payload);

    return d.toUTCString();
  }
}
