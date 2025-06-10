export type WithId<T> = T & { _id: any };
type WithTimestamps<T> = T & { createdAt: Date; updatedAt: Date };
type Maybe<T> = T | null | undefined;