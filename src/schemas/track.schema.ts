import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Album } from './album.schema';

export type TrackDocument = Track & Document;

@Schema()
export class Track {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  trackNumber: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Album' })
  album: Album;
}

export const TrackSchema = SchemaFactory.createForClass(Track);
