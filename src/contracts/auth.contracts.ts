import 'reflect-metadata';
import { Type } from 'class-transformer';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsString,
  IsEnum,
  MinLength,
  ValidateNested,
  IsDateString,
  IsOptional,
  MaxLength,
  IsDefined,
} from 'class-validator';
import { BaseResponseDTO } from './base.contracts';
import { BusinessType, UserType, WalletDTO } from './user.contracts';
import { prop } from '@typegoose/typegoose';

export class AuthValidateEmailRequest {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}

export class AuthValidateEmailResponse extends BaseResponseDTO {
  @IsString()
  @IsNotEmpty()
  date!: string;
}

export interface EmailDTO {
  name: string;
  recievers: string[];
  serviceName: string;
  subject: string;
  html: string;
  plainBody: string;
}

export class BusinessObject {
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  businessName!: string;

  @IsString()
  @IsNotEmpty()
  businessAdress!: string;

  @IsNotEmpty()
  @IsEnum(BusinessType)
  type!: BusinessType;

  @IsEmail()
  @IsOptional()
  businessEmail?: string;

  @IsString()
  @IsNotEmpty()
  country!: string;

  @IsString()
  @IsNotEmpty()
  state!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;
}

export class Profile {
  @prop({ required: true })
  public country!: string;

  @prop()
  public state?: string;

  @prop()
  public city?: string;

  @prop({ required: true })
  public name!: string;

  @prop()
  public dob?: string;

  @prop()
  public gpsCord?: string;
}
export class ProfileObject {
  @IsString()
  @IsNotEmpty()
  country!: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  name!: string;

  @IsDateString()
  @IsOptional()
  dob?: string;

  @IsString()
  @IsOptional()
  gpsCord?: string;
}

export class AuthRegisterRequest {
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsEnum(UserType)
  @IsNotEmpty()
  role!: UserType;

  @ValidateNested()
  @Type(() => ProfileObject)
  profile!: ProfileObject;

  @ValidateNested()
  @Type(() => BusinessObject)
  business?: BusinessObject;

  @IsString()
  @IsAlphanumeric()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  password!: string;
}

export class AuthRegisterResponse {
  @IsString()
  @IsNotEmpty()
  userId!: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
}

export class AuthLoginRequest {
  @IsEmail()
  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(10)
  phone?: string;

  @IsString()
  @IsAlphanumeric()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  password!: string;
}

export class AuthLoginResponse {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  phone!: string;

  @ValidateNested()
  @IsNotEmpty()
  @Type(() => ProfileObject)
  profile!: ProfileObject;

  /**
   * @TODO REPLACE WIHT ACTUAL OBJECT NOT JUST ANY
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => BusinessObject)
  business?: BusinessObject;

  @IsEnum(UserType)
  @IsNotEmpty()
  role!: UserType;

  @IsDefined()
  @IsNotEmpty()
  @Type(() => WalletDTO)
  wallet!: WalletDTO;
}

export class AuthRegisterResponseDTO extends BaseResponseDTO {
  @ValidateNested()
  @Type(() => AuthRegisterResponse)
  @IsString()
  @IsNotEmpty()
  result?: string;
}

export class AuthLoginResponseDTO extends BaseResponseDTO {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AuthLoginResponse)
  result?: AuthLoginResponse;
}
