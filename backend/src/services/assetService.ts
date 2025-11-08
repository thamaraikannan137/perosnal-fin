import Asset, { type IAsset } from "../models/Asset.js";
import { NotFoundError } from "../utils/errors.js";

export interface CreateAssetData {
  userId: string;
  name: string;
  category: string;
  value: number;
  purchaseDate?: string;
  location?: string;
  description?: string;
  owner: string;
  documents?: string[];
  documentUrl?: string;
  customFields?: any[];
  customCategoryName?: string;
}

export interface UpdateAssetData {
  name?: string;
  category?: string;
  value?: number;
  purchaseDate?: string;
  location?: string;
  description?: string;
  owner?: string;
  documents?: string[];
  documentUrl?: string;
  customFields?: any[];
  customCategoryName?: string;
}

class AssetService {
  async createAsset(data: CreateAssetData): Promise<IAsset> {
    const asset = await Asset.create(data);
    return asset;
  }

  async getAssetById(id: string, userId: string): Promise<IAsset> {
    const asset = await Asset.findOne({ _id: id, userId });
    if (!asset) {
      throw new NotFoundError("Asset not found");
    }
    return asset;
  }

  async getUserAssets(
    userId: string,
    page: number = 1,
    limit: number = 50,
    category?: string
  ): Promise<{ assets: IAsset[]; total: number; pages: number }> {
    const skip = (page - 1) * limit;
    const query: any = { userId };
    
    if (category) {
      query.category = category;
    }

    const [assets, total] = await Promise.all([
      Asset.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Asset.countDocuments(query)
    ]);

    return {
      assets,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  async updateAsset(id: string, userId: string, data: UpdateAssetData): Promise<IAsset> {
    const asset = await this.getAssetById(id, userId);
    
    Object.assign(asset, data);
    await asset.save();
    
    return asset;
  }

  async deleteAsset(id: string, userId: string): Promise<void> {
    const asset = await this.getAssetById(id, userId);
    await asset.deleteOne();
  }

  async getTotalValue(userId: string): Promise<number> {
    const result = await Asset.aggregate([
      { $match: { userId: userId as any } },
      { $group: { _id: null, total: { $sum: "$value" } } }
    ]);
    
    return result[0]?.total || 0;
  }

  async getAssetsByCategory(userId: string): Promise<{ category: string; total: number; count: number }[]> {
    const result = await Asset.aggregate([
      { $match: { userId: userId as any } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$value" },
          count: { $count: {} }
        }
      },
      {
        $project: {
          category: "$_id",
          total: 1,
          count: 1,
          _id: 0
        }
      }
    ]);
    
    return result;
  }
}

export default new AssetService();

