/* eslint-disable prettier/prettier */
import { houseType } from "@prisma/client";
import { Exclude, Expose, Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, IsOptional } from "class-validator";

/* eslint-disable prettier/prettier */



export class CreateHomeDTO {
    @IsNotEmpty()
    @IsString()
    adress: string;

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    number_of_bedrooms: number;

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    number_of_bathrooms: number;

    @IsNotEmpty()
    @IsString()
    city: string;

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    land_size: number;

    @IsEnum(houseType)
    houseType: houseType;

    @IsNotEmpty()
    images: homeImage[];
}

class homeImage {
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => ({ img_url: value }))
    img_url: string;
}
export class UpdateHomeDTO {
    @IsOptional()
    @IsNotEmpty()   
    @IsString()
    adress?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    number_of_bedrooms?: number;

    @IsOptional()
    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    number_of_bathrooms?: number;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    city?: string;

    @IsOptional()
    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    price?: number;

    @IsOptional()
    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    land_size?: number;

    @IsOptional()
    @IsEnum(houseType)
    houseType?: houseType;
}

export class UpdateImageDTO{
    @IsOptional()
    @IsString()
    img_url?: string
}

export class HomeResponseDTO {

    adress: string;

    @Exclude()
    number_of_bedrooms: number;
    @Expose({ name: "numberOfBedrooms" })
    numberOfBedrooms() {
        return this.number_of_bedrooms
    }

    @Exclude()
    number_of_bathrooms: number;
    @Expose({ name: "numberOfBathrooms" })
    numberOfBathrooms() {
        return this.number_of_bathrooms
    }

    @Exclude()
    create_at: Date;

    @Expose({ name: "listedDate" })
    listedDate() {
        return this.create_at
    }


    @Exclude()
    land_size: number;
    @Expose({ name: "landSize" })
    landSize() {
        return this.land_size
    }

    city: string;
    price: number;
    house_type: houseType;
    realtor_id: number;

    constructor(partial: Partial<HomeResponseDTO>) {
        Object.assign(this, partial)
    }
}

export class ImageResponseDTO{
    
    img_url:string

    constructor(partial: Partial<HomeResponseDTO>) {
        Object.assign(this, partial)
    }

}