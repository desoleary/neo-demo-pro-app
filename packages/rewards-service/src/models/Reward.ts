import { Schema, model, Document, Types, Model } from 'mongoose';

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

interface IRewardModel extends Model<IReward> {
  // Add any static methods here if needed
}

const rewardSchema = new Schema<IReward, IRewardModel>(
  {
    id: { 
      type: String, 
      required: true, 
      unique: true,
      default: () => new Types.ObjectId().toString()
    },
    description: { 
      type: String, 
      required: true 
    },
    points: { 
      type: Number, 
      required: true 
    },
    redeemed: { 
      type: Boolean, 
      default: false 
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id.toString();
        ret._id = ret.id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Create indexes for better query performance
rewardSchema.index({ id: 1 });
rewardSchema.index({ points: 1 });
rewardSchema.index({ redeemed: 1 });

const RewardModel = model<IReward, IRewardModel>('Reward', rewardSchema);

export default RewardModel;
