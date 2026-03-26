import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class ProviderGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        if (request.user && request.user.role === 'provider') {
            return true;
        }
        throw new ForbiddenException('Access denied: Provider role required');
    }
}
