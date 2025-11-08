import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
} from '@mui/material';
import { Button } from '../../../components/common';
import type { TransactionCreateInput, TransactionType } from '../../../types';

const transactionTypeOptions: { value: TransactionType; label: string }[] = [
  { value: 'emi_payment', label: 'EMI Payment' },
  { value: 'payment', label: 'Payment' },
  { value: 'deposit', label: 'Deposit' },
  { value: 'withdrawal', label: 'Withdrawal' },
  { value: 'interest', label: 'Interest' },
  { value: 'adjustment', label: 'Adjustment' },
];

interface TransactionFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: TransactionCreateInput) => void;
  assetId?: string;
  liabilityId?: string;
}

const defaultValues: TransactionCreateInput = {
  type: 'emi_payment',
  amount: 0,
  date: new Date().toISOString().split('T')[0],
  description: '',
  notes: '',
};

export const TransactionFormDialog = ({
  open,
  onClose,
  onSubmit,
  assetId,
  liabilityId,
}: TransactionFormDialogProps) => {
  const [formValues, setFormValues] = useState<TransactionCreateInput>(defaultValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Set default type based on context
    const defaultType = liabilityId ? 'emi_payment' : 'deposit';
    setFormValues({
      ...defaultValues,
      type: defaultType,
      date: new Date().toISOString().split('T')[0],
    });
    setErrors({});
  }, [open, assetId, liabilityId]);

  const handleChange = (field: keyof TransactionCreateInput) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'amount' ? Number(event.target.value) : event.target.value;
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
    if (!formValues.date) {
      currentErrors.date = 'Date is required';
    }
    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit({
      ...formValues,
      amount: Number(formValues.amount),
      assetId: assetId || undefined,
      liabilityId: liabilityId || undefined,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {liabilityId ? 'Record EMI Payment' : 'Add Transaction'}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Type"
            select
            value={formValues.type}
            onChange={handleChange('type')}
            fullWidth
          >
            {transactionTypeOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Amount"
            type="number"
            value={formValues.amount}
            onChange={handleChange('amount')}
            error={Boolean(errors.amount)}
            helperText={errors.amount}
            fullWidth
            required
            inputProps={{ min: 0 }}
          />
          <TextField
            label="Date"
            type="date"
            value={formValues.date}
            onChange={handleChange('date')}
            error={Boolean(errors.date)}
            helperText={errors.date}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Description"
            value={formValues.description}
            onChange={handleChange('description')}
            fullWidth
            placeholder={formValues.type === 'emi_payment' ? 'e.g., EMI Payment - October 2023' : ''}
          />
          <TextField
            label="Notes"
            value={formValues.notes}
            onChange={handleChange('notes')}
            fullWidth
            multiline
            minRows={3}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          {liabilityId ? 'Record Payment' : 'Add Transaction'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionFormDialog;

