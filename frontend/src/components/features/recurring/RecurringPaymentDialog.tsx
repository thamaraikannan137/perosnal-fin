import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Typography,
  Box,
} from '@mui/material';
import { Button } from '../../common';
import type { RecurringScheduleCreateInput } from '../../../types';

interface RecurringPaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: RecurringScheduleCreateInput) => void;
  assetId?: string;
  liabilityId?: string;
  initialValues?: Partial<RecurringScheduleCreateInput>;
}

const defaultValues: RecurringScheduleCreateInput = {
  amount: 0,
  dayOfMonth: 1,
  startDate: new Date().toISOString().split('T')[0],
  endDate: '',
  description: '',
};

export const RecurringPaymentDialog = ({
  open,
  onClose,
  onSubmit,
  assetId,
  liabilityId,
  initialValues,
}: RecurringPaymentDialogProps) => {
  const [formValues, setFormValues] = useState<RecurringScheduleCreateInput & { isActive: boolean }>({
    ...defaultValues,
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialValues) {
      setFormValues({
        ...defaultValues,
        ...initialValues,
        isActive: true,
      });
    } else {
      setFormValues({
        ...defaultValues,
        dayOfMonth: new Date().getDate(),
        isActive: true,
      });
    }
    setErrors({});
  }, [open, initialValues]);

  const handleChange = (field: keyof typeof formValues) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'amount' || field === 'dayOfMonth' 
      ? Number(event.target.value) 
      : field === 'isActive'
      ? event.target.checked
      : event.target.value;
    
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validate = () => {
    const currentErrors: Record<string, string> = {};
    if (!formValues.amount || formValues.amount <= 0) {
      currentErrors.amount = 'Amount must be greater than 0';
    }
    if (!formValues.dayOfMonth || formValues.dayOfMonth < 1 || formValues.dayOfMonth > 31) {
      currentErrors.dayOfMonth = 'Day of month must be between 1 and 31';
    }
    if (!formValues.startDate) {
      currentErrors.startDate = 'Start date is required';
    }
    if (formValues.endDate && new Date(formValues.endDate) < new Date(formValues.startDate)) {
      currentErrors.endDate = 'End date must be after start date';
    }
    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit({
      assetId: assetId || undefined,
      liabilityId: liabilityId || undefined,
      amount: Number(formValues.amount),
      dayOfMonth: Number(formValues.dayOfMonth),
      startDate: formValues.startDate,
      endDate: formValues.endDate || undefined,
      description: formValues.description || undefined,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {initialValues ? 'Edit Recurring Payment' : 'Set Up Monthly Payment'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {assetId 
              ? 'Set up automatic monthly deposits for this Fixed Deposit'
              : 'Set up automatic monthly payments for this liability'}
          </Typography>
          
          <TextField
            label="Monthly Amount"
            type="number"
            value={formValues.amount}
            onChange={handleChange('amount')}
            error={Boolean(errors.amount)}
            helperText={errors.amount}
            fullWidth
            required
            inputProps={{ min: 0 }}
            InputProps={{
              startAdornment: <span style={{ marginRight: 8 }}>₹</span>,
            }}
          />

          <TextField
            label="Day of Month"
            type="number"
            value={formValues.dayOfMonth}
            onChange={handleChange('dayOfMonth')}
            error={Boolean(errors.dayOfMonth)}
            helperText={errors.dayOfMonth || 'Day of the month when payment should be made (1-31)'}
            fullWidth
            required
            inputProps={{ min: 1, max: 31 }}
          />

          <TextField
            label="Start Date"
            type="date"
            value={formValues.startDate}
            onChange={handleChange('startDate')}
            error={Boolean(errors.startDate)}
            helperText={errors.startDate}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="End Date (Optional)"
            type="date"
            value={formValues.endDate}
            onChange={handleChange('endDate')}
            error={Boolean(errors.endDate)}
            helperText={errors.endDate || 'Leave empty for indefinite recurring payments'}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Description"
            value={formValues.description}
            onChange={handleChange('description')}
            fullWidth
            placeholder={assetId ? 'e.g., Monthly FD Contribution' : 'e.g., Monthly EMI Payment'}
          />

          <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              <strong>How it works:</strong> This will create a schedule for automatic monthly payments. 
              You can record each payment manually when it's due, or set reminders.
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          {initialValues ? 'Update Schedule' : 'Create Schedule'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecurringPaymentDialog;

