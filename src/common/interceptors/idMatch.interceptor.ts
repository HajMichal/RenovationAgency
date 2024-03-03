import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class idMatchInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const body = request.body;
    const params = request.params;
    const method = request.method;

    if (
      (method === 'PATCH' && user.sub != body.id) ||
      (method === 'DELETE' && user.id != params.id)
    )
      throw new UnauthorizedException('Not right access');

    return next.handle();
  }
}
