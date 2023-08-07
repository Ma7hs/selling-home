/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Body, Controller, Post, HttpCode, Param, ParseEnumPipe, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ProductKeyDTO, SignInDTO, SignUpDTO } from 'src/dtos/auth.dto';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('/signup/:userType')
    @HttpCode(201)
    async signup(
        @Body() body: SignUpDTO,
        @Param('userType', new ParseEnumPipe(UserType)) userType: UserType
    ) {
        if(userType !== UserType.BUYER){
            if(!body.productKey){
                throw new UnauthorizedException()
            }else{
                const validProductKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY_ACESS}`
                const compareProductKey = await bcrypt.compare(validProductKey, body.productKey)
                
                if(!compareProductKey){
                    throw new UnauthorizedException()
                }
            }
        }
        return this.authService.singUp(body, userType)
    }

    @Post('/signin')
    signin(
        @Body() body: SignInDTO
    ) {
        return this.authService.signIn(body)
    }

    @HttpCode(201)
    @Post('/key')
    productKey(
        @Body() { email, userType }: ProductKeyDTO
    ) {
        return this.authService.generateProductKey(email, userType)
    }

}
