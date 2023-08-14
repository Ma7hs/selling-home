/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Controller, Get, HttpCode, Post, Put, Delete, Param, Body, Query, ParseIntPipe, UnauthorizedException, UseGuards } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeResponseDTO, CreateHomeDTO, UpdateHomeDTO, UpdateImageDTO } from 'src/dtos/home.dto';
import { UserType, houseType } from '@prisma/client';
import { User, UserProps } from 'src/user/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decoratos/roles.decorator';

@Controller('home')
export class HomeController {

    constructor(private readonly homeService: HomeService) { }

    @Roles(UserType.REALTOR, UserType.ADMIN, UserType.BUYER)
    @UseGuards(AuthGuard)
    @HttpCode(201)
    @Get()
    allHomes(
        @Query('city') city?: string,
        @Query('maxPrice') maxPrice?: string,
        @Query('minPrice') minPrice?: string,
        @Query('houseType') houseType?: houseType,
    ): Promise<HomeResponseDTO[]> {

        const price = minPrice || maxPrice ? {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) })
        } : undefined

        const filters = {
            ...(city && { city }),
            ...(price && { price }),
            ...(houseType && { houseType })
        }

        return this.homeService.getAllHomes(filters)
    }

    @Roles(UserType.REALTOR, UserType.ADMIN, UserType.BUYER)
    @UseGuards(AuthGuard)
    @Get(':id')
    getHomeById(
        @Param("id") id: number
    ) {
        return this.homeService.getHomeByID(id)
    }

    @Roles(UserType.REALTOR)
    @UseGuards(AuthGuard)
    @Post()
    createHome(@Body() body: CreateHomeDTO, @User() user: UserProps) {
        const createdHome = this.homeService.createHome(body, user.id);
        return createdHome;
    }


    @Roles(UserType.REALTOR)
    @UseGuards(AuthGuard)
    @Put(':id')
    async updateHome(
        @Param("id", ParseIntPipe) id: number,
        @Body() body: UpdateHomeDTO,
        @User() user: UserProps
    ) {
        const realtorId = await this.homeService.getRealtorByHome(id)

        if (realtorId.id !== user.id) {
            throw new UnauthorizedException()
        }

        return this.homeService.updateHome(body, id)
    }

    @Put('/images/:id')
    updateImage(
        @Param("id", ParseIntPipe) id: number,
        @Body() body: UpdateImageDTO,
        @User() user: UserProps
    ) {
        return this.homeService.updateImages(body, id)
    }


    @Roles(UserType.REALTOR, UserType.ADMIN)
    @UseGuards(AuthGuard)
    @Delete(':id')
    async deleteHome(
        @Param('id') id: number,
        @User() user: UserProps
    ) {
        const realtorId = await this.homeService.getRealtorByHome(id)

        if (realtorId.id !== user.id) {
            throw new UnauthorizedException()
        }

        return this.homeService.deleteHome(id)
    }
}
