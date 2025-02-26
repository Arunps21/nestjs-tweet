import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const GetUserId = createParamDecorator(
  (_, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const userId = request?.user?.userId;

    if (!userId) {
      throw new UnauthorizedException('User ID not found in token');
    }

    return userId;
  },
);
