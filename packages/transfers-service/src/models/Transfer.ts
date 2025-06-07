import { Schema, model, InferSchemaType } from 'mongoose';

const transferSchema = new Schema({
  id: { type: String, required: true },
  status: { type: String, required: true }
});

export type Transfer = InferSchemaType<typeof transferSchema> & { _id: string };
export default model('Transfer', transferSchema);
