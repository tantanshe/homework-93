import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Artist } from './artist.schema';

export type AlbumDocument = Album & Document;

@Schema()
export class Album {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  year: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Artist' })
  artist: Artist;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
