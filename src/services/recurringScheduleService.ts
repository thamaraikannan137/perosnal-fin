import type { RecurringSchedule, RecurringScheduleCreateInput } from '../types';

const RECURRING_SCHEDULE_STORAGE_KEY = 'mockRecurringSchedules';

const simulateDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const recurringScheduleService = {
  getSchedules: async (filters?: { assetId?: string; liabilityId?: string }): Promise<RecurringSchedule[]> => {
    await simulateDelay(200);
    const schedules = JSON.parse(localStorage.getItem(RECURRING_SCHEDULE_STORAGE_KEY) || '[]') as RecurringSchedule[];
    
    if (filters) {
      return schedules.filter((schedule) => {
        if (filters.assetId && schedule.assetId !== filters.assetId) return false;
        if (filters.liabilityId && schedule.liabilityId !== filters.liabilityId) return false;
        return true;
      });
    }
    
    return schedules.filter((s) => s.isActive);
  },

  getScheduleById: async (id: string): Promise<RecurringSchedule | undefined> => {
    await simulateDelay(200);
    const schedules = JSON.parse(localStorage.getItem(RECURRING_SCHEDULE_STORAGE_KEY) || '[]') as RecurringSchedule[];
    return schedules.find((s) => s.id === id);
  },

  createSchedule: async (schedule: RecurringScheduleCreateInput): Promise<RecurringSchedule> => {
    await simulateDelay(300);
    const schedules = JSON.parse(localStorage.getItem(RECURRING_SCHEDULE_STORAGE_KEY) || '[]') as RecurringSchedule[];
    const newSchedule: RecurringSchedule = {
      id: `schedule-${Date.now()}`,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...schedule,
    };
    schedules.push(newSchedule);
    localStorage.setItem(RECURRING_SCHEDULE_STORAGE_KEY, JSON.stringify(schedules));
    return newSchedule;
  },

  updateSchedule: async (id: string, changes: Partial<RecurringSchedule>): Promise<RecurringSchedule> => {
    await simulateDelay(300);
    const schedules = JSON.parse(localStorage.getItem(RECURRING_SCHEDULE_STORAGE_KEY) || '[]') as RecurringSchedule[];
    const index = schedules.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Schedule not found');

    const updatedSchedule = {
      ...schedules[index],
      ...changes,
      updatedAt: new Date().toISOString(),
    };
    schedules[index] = updatedSchedule;
    localStorage.setItem(RECURRING_SCHEDULE_STORAGE_KEY, JSON.stringify(schedules));
    return updatedSchedule;
  },

  deleteSchedule: async (id: string): Promise<void> => {
    await simulateDelay(200);
    const schedules = JSON.parse(localStorage.getItem(RECURRING_SCHEDULE_STORAGE_KEY) || '[]') as RecurringSchedule[];
    const filtered = schedules.filter((s) => s.id !== id);
    localStorage.setItem(RECURRING_SCHEDULE_STORAGE_KEY, JSON.stringify(filtered));
  },

  // Get upcoming payments for the next N months
  getUpcomingPayments: async (assetId?: string, liabilityId?: string, months = 12): Promise<Array<{ date: string; amount: number; schedule: RecurringSchedule }>> => {
    await simulateDelay(200);
    const schedules = await recurringScheduleService.getSchedules({ assetId, liabilityId });
    const upcoming: Array<{ date: string; amount: number; schedule: RecurringSchedule }> = [];
    const today = new Date();
    
    schedules.forEach((schedule) => {
      if (!schedule.isActive) return;
      
      const startDate = new Date(schedule.startDate);
      const endDate = schedule.endDate ? new Date(schedule.endDate) : null;
      
      for (let i = 0; i < months; i++) {
        const paymentDate = new Date(today.getFullYear(), today.getMonth() + i, schedule.dayOfMonth);
        
        // Skip if before start date
        if (paymentDate < startDate) continue;
        
        // Skip if after end date
        if (endDate && paymentDate > endDate) continue;
        
        // Skip if already passed this month
        if (i === 0 && paymentDate < today) continue;
        
        upcoming.push({
          date: paymentDate.toISOString().split('T')[0],
          amount: schedule.amount,
          schedule,
        });
      }
    });
    
    return upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },
};

