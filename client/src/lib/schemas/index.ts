export const userSchema = {
  title: "User",
  type: "object",
  required: ["id", "email", "password", "tier"],
  properties: {
    id: { type: "string", title: "User ID" },
    email: { type: "string", format: "email", title: "Email Address" },
    password: { type: "string", title: "Password", minLength: 6 },
    tier: { type: "string", enum: ["basic", "gold", "platinum"], title: "User Tier" },
  },
};

export const accountSchema = {
  title: "Account",
  type: "object",
  required: ["userId", "type", "balance"],
  properties: {
    userId: { type: "string", title: "User ID" },
    type: { type: "string", title: "Account Type" },
    balance: { type: "number", title: "Balance", minimum: 0 },
  },
};

export const rewardSchema = {
  title: "Reward",
  type: "object",
  required: ["id", "description", "points"],
  properties: {
    id: { type: "string", title: "Reward ID" },
    description: { type: "string", title: "Description" },
    points: { type: "number", title: "Points", minimum: 0 },
  },
};

export const transferSchema = {
  title: "Transfer",
  type: "object",
  required: ["id", "status"],
  properties: {
    id: { type: "string", title: "Transfer ID" },
    status: {
      type: "string",
      title: "Status",
      enum: ["pending", "completed", "failed", "cancelled"],
    },
  },
};
