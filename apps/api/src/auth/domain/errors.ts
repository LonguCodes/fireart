export enum AuthErrors {
  UserNotFound = '404:UserNotFound',
  DuplicateUsername = '409:DuplicateUsername',
  TokenGenerationFailed = '500:TokenGenerationFailed',
  Internal = '500:Internal',
  UsernameOrPasswordInvalid = '401:UsernameOrPasswordInvalid',
  InvalidToken = '400:InvalidToken',
}
