import mongoose, { Document, model, Schema, Types } from 'mongoose';

export interface IReward extends Document {
  id: string;
  _id: Types.ObjectId;
  description: string;
  points: number;
  redeemed: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v?: number;
}

const rewardSchema = new mongoose.Schema<IReward>({
  id: { type: String, required: true, index: true, unique: true },
  description: { type: String, required: true },
  points: { type: Number, required: true },
  redeemed: { type: Boolean, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

rewardSchema.index({ points: 1 });
rewardSchema.index({ redeemed: 1 });

const RewardModel = model<IReward>('Reward', rewardSchema);

export default RewardModel;