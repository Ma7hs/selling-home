/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
import { CanActivate, Injectable, ExecutionContext } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import * as jwt from "jsonwebtoken"
import { PrismaService } from "src/prisma/prisma.service"
import { UserProps } from "src/user/decorators/user.decorator"

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly reflector: Reflector,
        private readonly prismaService: PrismaService) { }

    async canActivate(context: ExecutionContext) {
        const roles = this.reflector.getAllAndOverride('roles', [
            context.getHandler(),
            context.getClass(),
        ])

        if (roles.length) {
            const request = context.switchToHttp().getRequest()
            const token = request?.headers?.authorization?.split('Bearer ')[1]
            try {
                const payload = await jwt.verify(token, process.env.JSON_WEB_TOKEN_SECRET) as UserProps
                console.log({payload})
                const user = await this.prismaService.user.findUnique({
                    where: {
                        id: payload.id
                    }
                })
                console.log({user})
                if (!user) {
                    return false
                } else if (roles.includes(user.user_type)) {
                       return true
                } else {
                    return false
                }
            } catch (error) {
                return false
            }
        }
        return true
    }
}