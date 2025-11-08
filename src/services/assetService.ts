import type { Asset, AssetCreateInput, AssetUpdateInput } from '../types';
import { mockAssets } from '../data/financialData';

const simulateLatency = async <T>(data: T, delay = 300): Promise<T> => {
  await new Promise((resolve) => setTimeout(resolve, delay));
  return JSON.parse(JSON.stringify(data)) as T;
};

let assetData: Asset[] = [...mockAssets];

const generateId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 10);
};

export const assetService = {
  async getAssets(): Promise<Asset[]> {
    return simulateLatency(assetData);
  },

  async getAssetById(id: string): Promise<Asset | undefined> {
    const asset = assetData.find((item) => item.id === id);
    return simulateLatency(asset);
  },

  async createAsset(payload: AssetCreateInput): Promise<Asset> {
    const newAsset: Asset = {
      ...payload,
      id: generateId(),
      updatedAt: new Date().toISOString(),
    };
    assetData = [...assetData, newAsset];
    return simulateLatency(newAsset);
  },

  async updateAsset(id: string, payload: AssetUpdateInput): Promise<Asset> {
    let updatedAsset: Asset | undefined;
    assetData = assetData.map((asset) => {
      if (asset.id === id) {
        updatedAsset = {
          ...asset,
          ...payload,
          updatedAt: new Date().toISOString(),
        };
        return updatedAsset;
      }
      return asset;
    });

    if (!updatedAsset) {
      throw new Error('Asset not found');
    }

    return simulateLatency(updatedAsset);
  },

  async deleteAsset(id: string): Promise<string> {
    assetData = assetData.filter((asset) => asset.id !== id);
    return simulateLatency(id);
  },
};

