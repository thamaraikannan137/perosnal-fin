import { z } from "zod";

const customFieldSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  value: z.union([z.string(), z.number(), z.null()]).optional(),
  required: z.boolean(),
});

export const createLiabilitySchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
    category: z.enum(['credit', 'loan', 'mortgage', 'tax', 'other', 'custom']),
    balance: z.number().positive("Balance must be positive"),
    interestRate: z.number().min(0).max(100).optional(),
    dueDate: z.string().optional(),
    institution: z.string().max(100).optional(),
    owner: z.string().min(1, "Owner is required"),
    notes: z.string().max(500).optional(),
    customFields: z.array(customFieldSchema).optional(),
    customCategoryName: z.string().optional(),
  }),
});

export const updateLiabilitySchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    category: z.enum(['credit', 'loan', 'mortgage', 'tax', 'other', 'custom']).optional(),
    balance: z.number().positive().optional(),
    interestRate: z.number().min(0).max(100).optional(),
    dueDate: z.string().optional(),
    institution: z.string().max(100).optional(),
    owner: z.string().min(1).optional(),
    notes: z.string().max(500).optional(),
    customFields: z.array(customFieldSchema).optional(),
    customCategoryName: z.string().optional(),
  }),
  params: z.object({
    id: z.string().min(1, "Liability ID is required"),
  }),
});

export const getLiabilityByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Liability ID is required"),
  }),
});

