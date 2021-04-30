import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

export type FiscalDocument = Fiscal & Document;

@Schema()
export class Fiscal {
  @Prop()
  uuid: string;

  @Prop({ type: Object })
  data: { [key: string]: any };
}

export const FiscalSchema = SchemaFactory.createForClass(Fiscal);
