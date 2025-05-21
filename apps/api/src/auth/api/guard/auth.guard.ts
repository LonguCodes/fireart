import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { PUBLIC_METADATA } from '../decorators/is-public';
import { AppRequest } from '../../../core/common/app-request';
import { Maybe } from 'typescript-functional-extensions';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): false | true | Promise<boolean> | Observable<boolean> {
    return Maybe.from(
      this.reflector.getAllAndOverride<boolean>(PUBLIC_METADATA, [
        context.getHandler(),
        context.getClass(),
      ]),
    )
      .or(() => !!context.switchToHttp().getRequest<AppRequest>().user)
      .match({
        some: () => true,
        none: () => false,
      });
  }
}
