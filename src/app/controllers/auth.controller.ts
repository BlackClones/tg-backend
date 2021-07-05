import { Body, HttpCode, JsonController, Post } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import {
  AuthLoginRequest,
  AuthRegisterRequest,
  AuthLoginResponseDTO,
  AuthRegisterResponseDTO,
  AuthValidateEmailRequest,
  AuthValidateEmailResponse,
} from '../../contracts/auth.contracts';
import { SignupService, LoginService } from '../services/auth/index.service';

@JsonController('/auth')
export class AuthController {
  private signupService = new SignupService();
  private loginService = new LoginService();

  @Post('/register')
  @HttpCode(201)
  @OpenAPI({ summary: 'Create User Account', description: 'Provide `busines object` if creating business account' })
  @ResponseSchema(AuthRegisterResponseDTO)
  async createUserAccount(
    @Body({ validate: true, required: true }) data: AuthRegisterRequest
  ): Promise<AuthRegisterResponseDTO> {
    const { userId } = await this.signupService.createUserAccount(data);
    return { message: 'Successfully Created User Account', result: userId };
  }

  @Post('/login')
  @HttpCode(200)
  @OpenAPI({
    summary: 'Log Users Into their Accounts',
    description: 'Provide either `email or password ` and a a `valid password`',
  })
  @ResponseSchema(AuthLoginResponseDTO)
  async loginUser(@Body({ required: true }) loginPayload: AuthLoginRequest): Promise<void | AuthLoginResponseDTO> {
    const result = await this.loginService.loginUser(loginPayload);
    return { message: 'Successfully Logged User In', result };
  }

  @Post('/request-email-verification')
  @HttpCode(201)
  @OpenAPI({
    summary: 'Registered Users request Email Verification Link',
    description: "Registered Users who `haven't verified email address` already verify thier accounts",
  })
  @ResponseSchema(AuthValidateEmailResponse)
  async requestUserEmailVerification(
    @Body({ validate: true, required: true }) data: AuthValidateEmailRequest
  ): Promise<AuthValidateEmailResponse> {
    const date = await this.loginService.validateEmailAddress(data.email);

    return { message: 'Email Verification Link Successfully Sent', date };
  }
}
