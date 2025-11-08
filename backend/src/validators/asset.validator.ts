import { z } from "zod";

const customFieldSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  value: z.union([z.string(), z.number(), z.null()]).optional(),
  required: z.boolean(),
});

export const createAssetSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
    category: z.enum(['cash', 'bank', 'investment', 'property', 'vehicle', 'jewelry', 'other', 'custom']),
    value: z.number().positive("Value must be positive"),
    purchaseDate: z.string().optional(),
    location: z.string().max(200).optional(),
    description: z.string().max(500).optional(),
    owner: z.string().min(1, "Owner is required"),
    documents: z.array(z.string()).optional(),
    documentUrl: z.string().url().optional().or(z.literal('')),
    customFields: z.array(customFieldSchema).optional(),
    customCategoryName: z.string().optional(),
  }),
});

export const updateAssetSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    category: z.enum(['cash', 'bank', 'investment', 'property', 'vehicle', 'jewelry', 'other', 'custom']).optional(),
    value: z.number().positive().optional(),
    purchaseDate: z.string().optional(),
    location: z.string().max(200).optional(),
    description: z.string().max(500).optional(),
    owner: z.string().min(1).optional(),
    documents: z.array(z.string()).optional(),
    documentUrl: z.string().url().optional().or(z.literal('')),
    customFields: z.array(customFieldSchema).optional(),
    customCategoryName: z.string().optional(),
  }),
  params: z.object({
    id: z.string().min(1, "Asset ID is required"),
  }),
});

export const getAssetByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Asset ID is required"),
  }),
});

