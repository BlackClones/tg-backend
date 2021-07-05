import { getModelForClass, prop, modelOptions, Severity, mongoose, pre, Ref, DocumentType } from '@typegoose/typegoose';

import { UserType, TransactionType, TransactionStatus, BusinessType } from '../../contracts/user.contracts';
import * as crypto from '../../utils/crypto';

class Transaction {
  @prop({ required: true, enum: TransactionType })
  public type!: TransactionType;

  @prop({ required: true })
  public amount!: number;

  @prop({ required: true })
  public date!: string;

  @prop({ required: true, enum: TransactionStatus, default: TransactionStatus.pending })
  public status!: TransactionStatus;
}

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
class Wallet {
  @prop({ required: true, default: 0 })
  public balance!: number;

  @prop({ default: 0 })
  public promoDiscounts?: number;

  @prop({ default: 0 })
  public referalBonus?: number;

  @prop({ ref: () => Transaction })
  public transactions?: Ref<Transaction>[];
}

class Profile {
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

class Business {
  @prop({ required: true })
  public businessName!: string;

  @prop({ required: true })
  public businessAdress!: string;

  @prop({ required: true })
  public type!: BusinessType;

  @prop({ required: true })
  public businessEmail?: string;

  @prop({ required: true })
  public country!: string;

  @prop({ required: true })
  public state!: string;

  @prop({ required: true })
  public city!: string;
}

/* Typegoose Hook to hash password and save into db record */
@pre<UserCollection>('save', function () {
  if (this.isModified('password') || this.isNew) {
    this.password = crypto.encryptPassword(this.password);
  }
})
/* Declare user class */

@modelOptions({
  options: { allowMixed: Severity.ALLOW, customName: 'user' },
})
export class UserCollection {
  @prop({ required: true, immutable: true, type: mongoose.Types.ObjectId })
  public _id!: string;

  @prop({ required: true, immutable: true, type: mongoose.Types.ObjectId })
  public userId!: string;

  @prop({ required: true, unique: true })
  public phone!: string;

  @prop({ required: true, unique: true })
  public email!: string;

  @prop({ required: true, type: String, enum: UserType })
  public role!: UserType;

  @prop({ default: false })
  public isVerified!: boolean;

  @prop({ _id: false })
  profile!: Profile;

  @prop({ _id: false })
  business?: Business;

  @prop({ _id: false })
  public wallet!: Wallet;

  @prop({ default: null })
  public resetPasswordToken?: string | null;

  @prop({ required: true, minlength: 8, maxlength: 15 })
  public password!: string;

  validatePassword(this: DocumentType<UserCollection>, inputPassword: string) {
    return crypto.validPassword(inputPassword, this.password);
  }
}

export const UserModel = getModelForClass(UserCollection);
