import mongoose, { Schema, Document } from "mongoose";

export interface IAsset extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  category: 'cash' | 'bank' | 'investment' | 'property' | 'vehicle' | 'jewelry' | 'other' | 'custom';
  value: number;
  purchaseDate?: string;
  location?: string;
  description?: string;
  owner: string;
  documents?: string[];
  documentUrl?: string;
  customFields?: {
    id: string;
    name: string;
    type: string;
    value: string | number | null;
    required: boolean;
  }[];
  customCategoryName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const assetSchema = new Schema<IAsset>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    name: {
      type: String,
      required: [true, "Asset name is required"],
      trim: true,
      minlength: [1, "Name must be at least 1 character"],
      maxlength: [100, "Name must be less than 100 characters"],
    },
    category: {
      type: String,
      enum: ['cash', 'bank', 'investment', 'property', 'vehicle', 'jewelry', 'other', 'custom'],
      required: [true, "Category is required"],
    },
    value: {
      type: Number,
      required: [true, "Value is required"],
      min: [0, "Value must be positive"],
    },
    purchaseDate: {
      type: String,
    },
    location: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description must be less than 500 characters"],
    },
    owner: {
      type: String,
      required: [true, "Owner is required"],
      trim: true,
    },
    documents: [{
      type: String,
    }],
    documentUrl: {
      type: String,
      trim: true,
    },
    customFields: [{
      id: String,
      name: String,
      type: String,
      value: Schema.Types.Mixed,
      required: Boolean,
    }],
    customCategoryName: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: "assets",
  }
);

// Create indexes for better query performance
assetSchema.index({ userId: 1, category: 1 });
assetSchema.index({ userId: 1, createdAt: -1 });

const Asset = mongoose.model<IAsset>("Asset", assetSchema);

export default Asset;

