import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './api/http/auth.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './api/guard/auth.guard';
import { AuthorizationMiddleware } from './api/middleware/authorization.middleware';
import { IdentityRepository } from './infrastructure/repository/identity.repository';
import { PasswordResetRequestRepository } from './infrastructure/repository/password-reset-request.repository';
import { TokenService } from './domain/service/token.service';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    IdentityRepository,
    PasswordResetRequestRepository,
    TokenService,
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthorizationMiddleware).forRoutes('*');
  }
}
