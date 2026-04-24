// guards/provider-or-carer.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class ProviderOrCarerGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (user?.role === 'provider' || user?.role === 'carer') {
            return true;
        }

        throw new ForbiddenException('Access restricted to providers or carers');
    }
}