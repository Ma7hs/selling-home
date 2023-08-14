/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { houseType } from '@prisma/client';
import { HomeResponseDTO } from 'src/dtos/home.dto';
import { PrismaService } from 'src/prisma/prisma.service';

interface CreateHomeProps {
    adress: string,
    city: string,
    number_of_bedrooms: number,
    number_of_bathrooms: number,
    price: number,
    land_size: number,
    houseType: houseType,
    images: { img_url: string }[]
}

interface UpdateHomeProps {
    adress?: string,
    city?: string,
    number_of_bedrooms?: number,
    number_of_bathrooms?: number,
    price?: number,
    land_size?: number,
    houseType?: houseType
}

interface UpdateImageProps {
    img_url?: string
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

    async createHome({ images, adress, city, houseType, land_size, number_of_bathrooms, number_of_bedrooms, price }: CreateHomeProps, userId: number) {
        console.log("Received images in service:", images);

        const home = await this.prismaService.home.create({
            data: {
                adress,
                city,
                house_type: houseType,
                land_size,
                number_of_bathrooms,
                number_of_bedrooms,
                price,
                realtor_id: userId
            }
        });

        const homeImages = images.map((img) => {
            console.log("Processing image:", img.img_url);
            return { img_url: img.img_url, home_id: home.id };
        });

        console.log("Processed images:", homeImages);
        console.log("Created home:", home);

        await this.prismaService.image.createMany({ data: homeImages });

        return new HomeResponseDTO(home);
    }

    async updateHome(data : UpdateHomeProps, id: number){
        const home = await this.prismaService.home.findUnique({
            where: {
                id: id
            }
        })
        if(!home){
            throw new NotFoundException
        }

        const updateHome = await this.prismaService.home.update({
            where: {
                id: id
            },
            data: data
        })

            
        return new HomeResponseDTO(updateHome)
    }

    async updateImages(data: UpdateImageProps, id: number){
        const findImage = await this.prismaService.image.findUnique({
            where:{
                id: id
            },  
        })

        if(!findImage){
            throw new NotFoundException
        }

        const updateImage = await this.prismaService.image.update({
            where: {
                id
            },
            data: data
        })

        return 'Image Updated'
    }

    async deleteHome(id: number){
        const findHome = await this.prismaService.home.findUnique({
            where:{
                id: id
            },  
        })

        if(!findHome){
            throw new NotFoundException
        }

        await this.prismaService.image.deleteMany({
            where:{
                home_id: id
            }
        })
        await this.prismaService.home.delete({
            where:{
                id: id
            }
        })

        return 'Home was deleted!'

    }

    async getRealtorByHome(id: number){
        const home = await this.prismaService.home.findUnique({
            where:{
                id
            },
            select:{
                realtor: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
                        user_type: true,
                        id: true
                    }
                }
            }
        })

        if(!home){
            throw new NotFoundException()
        }

        return home.realtor

    }
}