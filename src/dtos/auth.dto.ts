/* eslint-disable prettier/prettier */
import { UserType } from "@prisma/client";
import { Exclude } from "class-transformer";
import { IsNotEmpty, IsEmail, IsString, MinLength, MaxLength, Matches, IsEnum, IsOptional} from "class-validator"

export class SignUpDTO {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(50)
    password: string;

    @IsNotEmpty()
    @Matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, { message: "Phone must be a valid number" })
    phone: string;


    @IsOptional()
    @IsNotEmpty()
    @IsString()
    productKey?: string;
}

export class SignInDTO {

    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(10)
    @MaxLength(50)
    password: string;
}

export class ProductKeyDTO {

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsEnum(UserType)
    userType: UserType;

}


export class ResponseSignUpDTO {

    @IsString()
    name: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    phone: string;

    @Exclude()
    password: string

    constructor(partil: Partial<ResponseSignUpDTO>) {
        Object.assign(this, partil)
    }
}