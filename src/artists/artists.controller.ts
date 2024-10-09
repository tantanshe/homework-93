import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { Model } from 'mongoose';
import { CreateArtistDto } from './create-artist.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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
  }

  @Post()
  @UseInterceptors(FileInterceptor('image', { dest: './public/images' }))
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
}
