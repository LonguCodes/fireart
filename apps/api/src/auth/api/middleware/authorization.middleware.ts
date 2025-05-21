import {
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Maybe, Result } from 'typescript-functional-extensions';
import { AppRequest } from '../../../core/common/app-request';
import { JwtPayload } from 'jsonwebtoken';
import { TokenService } from '../../domain/service/token.service';

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
  constructor(@Inject() private readonly tokenService: TokenService) {}

  use(req: AppRequest, res: any, next: (error?: Error | any) => void) {
    Maybe.from(req.headers.authorization).match({
      none: () => next(),
      some: (header) =>
        Result.success<string, Error>(header)
          .ensure(
            (header) => header.startsWith('Bearer '),
            new UnauthorizedException(),
          )
          .map((header) => header.substring(7))
          .bind((token) =>
            this.tokenService
              .validateAccessToken(token)
              .mapError(() => new UnauthorizedException()),
          )
          .tap((decoded) => {
            req.user = decoded as JwtPayload;
            next();
          })
          .tapFailure((error) => {
            throw error;
          }),
    });
  }
}
