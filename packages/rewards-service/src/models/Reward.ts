import { Schema, model, InferSchemaType } from 'mongoose';

const rewardSchema = new Schema({
  id: { type: String, required: true },
  description: { type: String, required: true },
  points: { type: Number, required: true }
});

export type Reward = InferSchemaType<typeof rewardSchema> & { _id: string };
export default model('Reward', rewardSchema);
