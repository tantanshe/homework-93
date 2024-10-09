import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Album, AlbumDocument } from '../schemas/album.schema';
import { Model } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAlbumDto } from './create-album.dto';

@Controller('albums')
export class AlbumsController {
  constructor(
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
  ) {}

  @Get()
  async getAll(@Query('artist') artistId?: string) {
    if (artistId) {
      return this.albumModel.find({ artist: artistId });
    }
    return this.albumModel.find().populate('artist');
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const album = await this.albumModel.findById(id).populate('artist');
    if (!album) {
      throw new NotFoundException(`Album ${id} not found`);
    }
    return album;
  }

  @Post()
  @UseInterceptors(FileInterceptor('photo', { dest: './public/images' }))
  async create(
    @Body() albumData: CreateAlbumDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const album = await this.albumModel.create({
      name: albumData.name,
      year: albumData.year,
      artist: albumData.artist,
      photo: file ? 'images/' + file.filename : null,
    });
    return album;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const album = await this.albumModel.deleteOne({ _id: id });
    if (!album) {
      throw new NotFoundException(`Album ${id} not found`);
    }
    return { message: `Album ${id} is deleted` };
  }
}
