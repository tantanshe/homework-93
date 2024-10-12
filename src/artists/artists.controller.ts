import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UploadedFile, UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { Model } from 'mongoose';
import { CreateArtistDto } from './create-artist.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { RoleGuard } from '../users/user-role.guard';
import { TokenAuthGuard } from '../auth/token-auth.guard';

@Controller('artists')
export class ArtistsController {
  constructor(
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,
  ) {}

  @Get()
  async getAll() {
    return this.artistModel.find();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const artist = this.artistModel.findOne({ _id: id });
    if (!artist) {
      throw new NotFoundException(`Artist ${id} not found`);
    }
    return artist;
  }

  @UseGuards(TokenAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('photo', { dest: './public/images' }))
  async create(
    @Body() artistData: CreateArtistDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const artist = await this.artistModel.create({
      name: artistData.name,
      info: artistData.info,
      photo: file ? 'images/' + file.filename : null,
    });
    return artist;
  }

  @UseGuards(TokenAuthGuard, RoleGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const artist = await this.artistModel.deleteOne({ _id: id });
    if (!artist) {
      throw new NotFoundException(`Artist ${id} not found`);
    }
    return { message: `Artist ${id} is deleted` };
  }
}
