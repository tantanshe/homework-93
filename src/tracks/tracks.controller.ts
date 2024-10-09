import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Track, TrackDocument } from '../schemas/track.schema';
import { Model } from 'mongoose';
import { CreateTrackDto } from './create-track.dto';

@Controller('tracks')
export class TracksController {
  constructor(
    @InjectModel(Track.name)
    private trackModel: Model<TrackDocument>,
  ) {}

  @Get()
  async getAll(@Query('album') albumId?: string) {
    if (albumId) {
      return this.trackModel.find({ album: albumId }).populate('album');
    }
    return this.trackModel.find().populate('album');
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    const track = await this.trackModel.findById(id).populate('album');
    if (!track) {
      throw new NotFoundException(`Track ${id} not found`);
    }
    return track;
  }

  @Post()
  async create(@Body() trackData: CreateTrackDto) {
    const track = await this.trackModel.create({
      name: trackData.name,
      trackNumber: trackData.trackNumber,
      duration: trackData.duration,
      album: trackData.album,
    });
    return track;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const track = await this.trackModel.deleteOne({ _id: id });
    if (!track) {
      throw new NotFoundException(`Track ${id} not found`);
    }
    return { message: `Track ${id} is deleted` };
  }
}
