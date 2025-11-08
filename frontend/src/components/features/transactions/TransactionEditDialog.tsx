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
import { Button } from '../../common';
import type { Transaction, TransactionUpdateInput, TransactionType } from '../../../types';

const transactionTypeOptions: { value: TransactionType; label: string }[] = [
  { value: 'emi_payment', label: 'EMI Payment' },
  { value: 'payment', label: 'Payment' },
  { value: 'deposit', label: 'Deposit' },
  { value: 'withdrawal', label: 'Withdrawal' },
  { value: 'interest', label: 'Interest' },
  { value: 'adjustment', label: 'Adjustment' },
];

interface TransactionEditDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (id: string, values: TransactionUpdateInput) => void;
  transaction: Transaction | null;
}

export const TransactionEditDialog = ({
  open,
  onClose,
  onSubmit,
  transaction,
}: TransactionEditDialogProps) => {
  const [formValues, setFormValues] = useState<TransactionUpdateInput>({
    type: 'emi_payment',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    description: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (transaction) {
      setFormValues({
        type: transaction.type,
        amount: transaction.amount,
        date: transaction.date,
        description: transaction.description || '',
        notes: transaction.notes || '',
      });
    }
    setErrors({});
  }, [transaction, open]);

  const handleChange = (field: keyof TransactionUpdateInput) => (
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
    if (!validate() || !transaction) return;

    onSubmit(transaction.id, {
      ...formValues,
      amount: Number(formValues.amount),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Transaction</DialogTitle>
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
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionEditDialog;

