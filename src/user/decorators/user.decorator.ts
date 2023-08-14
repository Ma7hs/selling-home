/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {createParamDecorator, ExecutionContext} from '@nestjs/common';

export interface UserProps{
    id: number,
    name: string,
    iat: number,
    exp: number
}

export const User = createParamDecorator((data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()
    return request.user
})