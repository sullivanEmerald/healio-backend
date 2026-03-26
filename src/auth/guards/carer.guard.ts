import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class CarerGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        if (request.user && request.user.role === 'carer') {
            return true;
        }
        throw new ForbiddenException('Access denied: Carer role required');
    }
}
