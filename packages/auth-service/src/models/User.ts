import { Schema, model, InferSchemaType } from 'mongoose';

const userSchema = new Schema({
  id: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  tier: { type: String, enum: ['basic', 'gold', 'platinum'], required: true }
});

export type User = InferSchemaType<typeof userSchema> & { _id: string };
export default model('User', userSchema);
