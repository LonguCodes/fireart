import { Body, Controller, HttpCode, Inject, Post } from '@nestjs/common';
import { IsPublic } from '../decorators/is-public';
import { CredentialsRequest } from '../request/credentials.request';
import { ResultAsync, Unit } from 'typescript-functional-extensions';
import { PasswordResetRequest } from '../request/password-reset.request';
import { PasswordResetConfirmationRequest } from '../request/password-reset-confirmation.request';
import { CommandBus } from '@nestjs/cqrs';
import { RequestPasswordResetCommand } from '../../domain/command/request-password-reset.command';
import { ConfirmPasswordResetCommand } from '../../domain/command/confirm-password-reset.command';
import { ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SignInCommand } from '../../domain/command/sign-in.command';
import { SignUpCommand } from '../../domain/command/sign-up.command';
import { TokenResponse } from '../response/token.response';

@Controller('auth')
@IsPublic()
export class AuthController {
  constructor(@Inject() private readonly commandBus: CommandBus) {}

  @Post('sign-up')
  @ApiOkResponse({
    description: 'Sign up using email and password. Automatically signs in',
    type: TokenResponse,
  })
  public signUp(@Body() body: CredentialsRequest) {
    return ResultAsync.from(
      this.commandBus.execute(new SignUpCommand(body.email, body.password)),
    )
      .bind(() =>
        ResultAsync.from(
          this.commandBus.execute(new SignInCommand(body.email, body.password)),
        ),
      )
      .map((valueObject) => new TokenResponse(valueObject.token))
      .toPromise();
  }

  @Post('sign-in')
  @ApiOkResponse({
    description: 'Sign in using email and password used during sign up',
    type: TokenResponse,
  })
  public signIn(@Body() body: CredentialsRequest) {
    return ResultAsync.from(
      this.commandBus.execute(new SignInCommand(body.email, body.password)),
    )
      .map((valueObject) => new TokenResponse(valueObject.token))
      .toPromise();
  }

  @Post('reset-password')
  @ApiOperation({
    description:
      'Request password reset using email address associated with an account',
  })
  @ApiResponse({ status: 204 })
  @HttpCode(204)
  public resetPassword(@Body() body: PasswordResetRequest) {
    return ResultAsync.from(
      this.commandBus.execute(new RequestPasswordResetCommand(body.email)),
    )
      .map(() => Unit.Instance)
      .toPromise();
  }

  @Post('reset-password/confirm')
  @ApiOperation({
    description: 'Confirm password reset using previously obtained token',
  })
  @ApiResponse({ status: 204 })
  @HttpCode(204)
  public confirmPasswordReset(@Body() body: PasswordResetConfirmationRequest) {
    return ResultAsync.from(
      this.commandBus.execute(
        new ConfirmPasswordResetCommand(body.token, body.password),
      ),
    )
      .map(() => Unit.Instance)
      .toPromise();
  }
}
