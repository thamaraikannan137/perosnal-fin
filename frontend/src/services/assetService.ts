import type { Asset, AssetCreateInput, AssetUpdateInput } from '../types';
import { apiClient } from './api';

// API Response types matching backend
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface AssetsResponse {
  assets: Asset[];
  total: number;
  pages: number;
}

interface AssetResponse {
  asset: Asset;
}

// Transform backend _id to frontend id
const transformAsset = (asset: any): Asset => {
  return {
    ...asset,
    id: asset._id || asset.id,
  };
};

export const assetService = {
  async getAssets(page: number = 1, limit: number = 50, category?: string): Promise<Asset[]> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (category) {
        params.append('category', category);
      }

      const response = await apiClient.get<ApiResponse<AssetsResponse>>(
        `/assets?${params.toString()}`
      );
      
      return response.data.assets.map(transformAsset);
    } catch (error) {
      console.error('Error fetching assets:', error);
      throw error;
    }
  },

  async getAssetById(id: string): Promise<Asset | undefined> {
    try {
      const response = await apiClient.get<ApiResponse<AssetResponse>>(`/assets/${id}`);
      return transformAsset(response.data.asset);
    } catch (error: any) {
      if (error.response?.status === 404) {
        return undefined;
      }
      console.error('Error fetching asset:', error);
      throw error;
    }
  },

  async createAsset(payload: AssetCreateInput): Promise<Asset> {
    try {
      const response = await apiClient.post<ApiResponse<AssetResponse>>('/assets', payload);
      return transformAsset(response.data.asset);
    } catch (error) {
      console.error('Error creating asset:', error);
      throw error;
    }
  },

  async updateAsset(id: string, payload: AssetUpdateInput): Promise<Asset> {
    try {
      const response = await apiClient.put<ApiResponse<AssetResponse>>(`/assets/${id}`, payload);
      return transformAsset(response.data.asset);
    } catch (error) {
      console.error('Error updating asset:', error);
      throw error;
    }
  },

  async deleteAsset(id: string): Promise<string> {
    try {
      await apiClient.delete(`/assets/${id}`);
      return id;
    } catch (error) {
      console.error('Error deleting asset:', error);
      throw error;
    }
  },

  async getAssetSummary(): Promise<{ totalValue: number; byCategory: any[] }> {
    try {
      const response = await apiClient.get<ApiResponse<{ totalValue: number; byCategory: any[] }>>(
        '/assets/summary'
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching asset summary:', error);
      throw error;
    }
  },
};
