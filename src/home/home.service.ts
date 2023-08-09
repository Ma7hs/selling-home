/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { houseType } from '@prisma/client';
import { Home as home } from '@prisma/client';
import { HomeResponseDTO } from 'src/dtos/home.dto';
import { PrismaService } from 'src/prisma/prisma.service';

interface CreateHomeProps {
    adress: string,
    realtor_id: number,
    city: string,
    number_of_bedrooms: number,
    number_of_bathrooms: number,
    price: number,
    land_size: number,
    houseType: houseType,
    images: { url: string }[]
}

interface FilterHome {
    city?: string,
    price?: {
        gte?: number,
        lte?: number
    },
    houseType?: houseType
}

const homeSelect = {
    id: true,
    adress: true,
    city: true,
    house_type: true,
    land_size: true,
    number_of_bathrooms: true,
    number_of_bedrooms: true,
    price: true
}

@Injectable()
export class HomeService {

    constructor(private readonly prismaService: PrismaService) { }

    async getAllHomes(filters: FilterHome): Promise<HomeResponseDTO[]> {
        const homes = await this.prismaService.home.findMany({
            select: {
                ...homeSelect,
                images: {
                    select: {
                        img_url: true
                    },
                    take: 1
                }
            },
            where: filters
        });

        if (!homes) {
            throw new NotFoundException()
        }

        return homes.map((home) => { return new HomeResponseDTO(home) })
    }

    async getHomeByID(id: number): Promise<HomeResponseDTO> {
        const home = await this.prismaService.home.findUnique({
            where: {
                id: id
            },
            select: {
                ...homeSelect,
                images: {
                    select: {
                        img_url: true
                    }
                },
                realtor: {
                    select: {
                        name: true,
                        phone: true,
                        email: true
                    }
                }
            }
        })
        if (!home) {
            throw new NotFoundException()
        }
        return new HomeResponseDTO(home)
    }

    async createHome({ images, adress, city, houseType, land_size, number_of_bathrooms, number_of_bedrooms, price, realtor_id }: CreateHomeProps) {
        const home = await this.prismaService.home.create({
            data: {
                adress,
                city,
                house_type: houseType,
                land_size,
                number_of_bathrooms,
                number_of_bedrooms,
                price,
                realtor_id: 9
            }
        })

        const homeImages = images.map((img) => {
            return { img_url: img.url, home_id: home.id }
        })

        await this.prismaService.image.createMany({data: homeImages})

        return new HomeResponseDTO(home)
    }

}
