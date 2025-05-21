export interface PasswordResetRequestModel {
  id: string;
  identityId: string;
  expireAt: Date;
}
