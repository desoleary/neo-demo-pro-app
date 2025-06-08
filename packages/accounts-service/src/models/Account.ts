import { InferSchemaType, model, Schema } from 'mongoose';

const accountSchema = new Schema({
  userId: { type: String, required: true },
  type: { type: String, required: true },
  balance: { type: Number, required: true }
});

export type Account = InferSchemaType<typeof accountSchema> & { _id: string };
export default model('Account', accountSchema);
