import type { Liability, LiabilityCreateInput, LiabilityUpdateInput } from '../types';
import { mockLiabilities } from '../data/financialData';

const simulateLatency = async <T>(data: T, delay = 300): Promise<T> => {
  await new Promise((resolve) => setTimeout(resolve, delay));
  return JSON.parse(JSON.stringify(data)) as T;
};

let liabilityData: Liability[] = [...mockLiabilities];

const generateId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 10);
};

export const liabilityService = {
  async getLiabilities(): Promise<Liability[]> {
    return simulateLatency(liabilityData);
  },

  async getLiabilityById(id: string): Promise<Liability | undefined> {
    const liability = liabilityData.find((item) => item.id === id);
    return simulateLatency(liability);
  },

  async createLiability(payload: LiabilityCreateInput): Promise<Liability> {
    const newLiability: Liability = {
      ...payload,
      id: generateId(),
      updatedAt: new Date().toISOString(),
    };
    liabilityData = [...liabilityData, newLiability];
    return simulateLatency(newLiability);
  },

  async updateLiability(id: string, payload: LiabilityUpdateInput): Promise<Liability> {
    let updatedLiability: Liability | undefined;
    liabilityData = liabilityData.map((liability) => {
      if (liability.id === id) {
        updatedLiability = {
          ...liability,
          ...payload,
          updatedAt: new Date().toISOString(),
        };
        return updatedLiability;
      }
      return liability;
    });

    if (!updatedLiability) {
      throw new Error('Liability not found');
    }

    return simulateLatency(updatedLiability);
  },

  async deleteLiability(id: string): Promise<string> {
    liabilityData = liabilityData.filter((liability) => liability.id !== id);
    return simulateLatency(id);
  },
};

