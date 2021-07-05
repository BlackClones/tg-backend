import { prop } from '@typegoose/typegoose';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import 'reflect-metadata';
export enum UserType {
  CUSTOMER = 'customer',
  MEMBER = 'member',
  BUSINESS = 'business',
  MERCHNANT = 'merchant',
  EMPLOYEE = 'employee',
  ADMIN = 'admio',
}

export enum TransactionStatus {
  pending = 'pending',
  success = 'success',
  cancelled = 'cancelled',
  refunded = 'refunded',
}
export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  SEND = 'send',
  RECIEVED = 'recieved',
  DISCOUNT = 'discount',
  REFERAL_BONUS = 'referal_bonuse',
  PUBLISHED_AD = 'published_advert',
}

export enum BusinessType {
  SOLE = 'sole',
  PARTNERSHIP = 'partnership',
  JOINT = 'joint',
  COORPORATE = 'coorporate',
}

export class TransactionDTO {
  @IsString()
  @IsOptional()
  type!: TransactionType;

  @IsString()
  @IsOptional()
  amount?: number;

  @prop({ type: Date })
  date?: string;

  @IsString()
  @IsOptional()
  success?: boolean;
}

export class WalletDTO {
  @IsString()
  @IsNotEmpty()
  balance!: number;

  @IsNumber()
  @IsOptional()
  promoDiscounts?: number;

  @IsNumber()
  @IsOptional()
  referalBonus?: number;

  @IsString()
  @IsOptional()
  transactions?: TransactionDTO[];
}
