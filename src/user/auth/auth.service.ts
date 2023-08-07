/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable, ConflictException, HttpException } from '@nestjs/common';
import { ResponseSignUpDTO } from 'src/dtos/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { UserType } from '@prisma/client';

interface signUpProps {
    name: string,
    email: string,
    phone: string,
    password: string
}


interface signInProps {
    email: string,
    password: string
}


@Injectable()
export class AuthService {

    constructor(private readonly prismaService: PrismaService) { }

    async singUp({ email, password, name, phone }: signUpProps, userType : UserType) {
        const emailExists = await this.prismaService.user.findUnique({
            where: {
                email
            }
        });

        if (emailExists) {
            throw new ConflictException()
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await this.prismaService.user.create({
            data: {
                name: name,
                password: hashedPassword,
                email: email,
                phone: phone,
                user_type: userType

            }
        })

        return this.generateJWT(user.name, user.id)
    }

    async signIn({ email, password }: signInProps) {
        const findUser = await this.prismaService.user.findUnique({
            where: {
                email
            }
        })

        if (!findUser) {
            throw new HttpException("Invalid Credentials", 400)
        }

        const hashedPassword = findUser.password
        const isValidPassword = await bcrypt.compare(password, hashedPassword)
        
        if (!isValidPassword) {
            throw new HttpException("Invalid Credentials", 400)
        }
        
       return this.generateJWT(findUser.name, findUser.id)
       
    }

    private async generateJWT(name: string, id: number){
        const token = jwt.sign({
            name: name,
            id: id
        }, process.env.JSON_WEB_TOKEN_SECRET, {
            expiresIn: 3600
        })
        return token
    }

    async generateProductKey(email: string, userType : UserType){
        const productKey =  `${email}-${userType}-${process.env.PRODUCT_KEY_ACESS}`
        return await bcrypt.hash(productKey, 10)
    }
}
