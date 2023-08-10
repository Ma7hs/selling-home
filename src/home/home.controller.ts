/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Controller, Get, HttpCode, Post, Put, Delete, Param, Body, Query, ParseFloatPipe, ParseEnumPipe } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeResponseDTO, CreateHomeDTO } from 'src/dtos/home.dto';
import { houseType } from '@prisma/client';


@Controller('home')
export class HomeController {

    constructor(private readonly homeService: HomeService){}

    @HttpCode(201)
    @Get()
    allHomes(
        @Query('city') city?: string,
        @Query('maxPrice') maxPrice?: string,
        @Query('minPrice') minPrice?: string,
        @Query('houseType') houseType?: houseType,
    ): Promise<HomeResponseDTO[]>{

        const price = minPrice || maxPrice ? {
            ...(minPrice && {gte: parseFloat(minPrice)}),
            ...(maxPrice && {lte: parseFloat(maxPrice)})
        } : undefined

        const filters = {
            ...(city && {city}),
            ...(price && {price}),
            ...(houseType && {houseType})
        }

        return this.homeService.getAllHomes(filters)
    }

    @Get(':id')
    getHomeById(
        @Param("id") id: number
    ){
        return this.homeService.getHomeByID(id)
    }

    @Post()
    createHome(@Body() body: CreateHomeDTO) {
        console.log("Received request body:", body);

        const createdHome = this.homeService.createHome(body);

        console.log("Response from service:", createdHome);

        return createdHome;
    }

    @Put(':id')
    updateHome(){
        return {}
    }

    @Delete(':id')
    deleteHome(){
        return "Home deleted in our system!"
    }
}
