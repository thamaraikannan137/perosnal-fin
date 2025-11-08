import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  Chip,
  Divider,
  Button,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import { MuiCard } from '../components/common';
import { formatCurrency, formatDate } from '../utils';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchLiabilityById } from '../store/slices/liabilitySlice';
import { transactionService } from '../services/transactionService';
import type { Transaction, TransactionCreateInput } from '../types';
import TransactionFormDialog from '../components/features/transactions/TransactionFormDialog';

export const LiabilityDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedLiability, loading } = useAppSelector((state) => state.liabilities);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadTransactions = useCallback(async () => {
    if (!id) return;
    setLoadingTransactions(true);
    try {
      const txns = await transactionService.getTransactions({ liabilityId: id });
      setTransactions(txns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoadingTransactions(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      dispatch(fetchLiabilityById(id));
      loadTransactions();
    }
  }, [id, dispatch, loadTransactions]);

  const handleAddTransaction = async (values: TransactionCreateInput) => {
    if (!id) return;
    await transactionService.createTransaction({ ...values, liabilityId: id });
    setDialogOpen(false);
    // Refresh liability data to show updated balance
    dispatch(fetchLiabilityById(id));
    loadTransactions();
  };

  if (loading) {
    return (
      <Box>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!selectedLiability) {
    return (
      <Box>
        <Typography>Liability not found</Typography>
        <Button onClick={() => navigate('/liabilities')}>Back to Liabilities</Button>
      </Box>
    );
  }

  // Group transactions by month
  const groupedTransactions = transactions.reduce((acc, txn) => {
    const date = new Date(txn.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(txn);
    return acc;
  }, {} as Record<string, Transaction[]>);

  const monthKeys = Object.keys(groupedTransactions).sort().reverse();

  // Calculate total paid
  const totalPaid = transactions
    .filter((txn: Transaction) => txn.type === 'emi_payment' || txn.type === 'payment')
    .reduce((sum: number, txn: Transaction) => sum + txn.amount, 0);

  return (
    <Stack spacing={3}>
      <Box>
        <Button
          variant="text"
          startIcon={<i className="ri-arrow-left-line" style={{ fontSize: '18px' }} />}
          onClick={() => navigate('/liabilities')}
          sx={{ mb: 2, textTransform: 'none' }}
        >
          Back to Liabilities
        </Button>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
          {selectedLiability.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Liability Details & Payment History
        </Typography>
      </Box>

      {/* Liability Details Card */}
      <MuiCard sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h5" color="error.main" fontWeight={700}>
                {formatCurrency(selectedLiability.balance)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Current Balance
              </Typography>
            </Box>
            <Chip
              label={
                selectedLiability.category === 'custom' && selectedLiability.customCategoryName
                  ? selectedLiability.customCategoryName
                  : selectedLiability.category.charAt(0).toUpperCase() + selectedLiability.category.slice(1)
              }
              color="error"
              variant="outlined"
              sx={{ fontWeight: 500 }}
            />
          </Box>

          <Divider />

          <Stack spacing={1.5}>
            {selectedLiability.institution && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Institution
                </Typography>
                <Typography variant="body1">{selectedLiability.institution}</Typography>
              </Box>
            )}
            {selectedLiability.interestRate !== undefined && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Interest Rate
                </Typography>
                <Typography variant="body1">{selectedLiability.interestRate}%</Typography>
              </Box>
            )}
            {selectedLiability.dueDate && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Next Due Date
                </Typography>
                <Typography variant="body1">{formatDate(selectedLiability.dueDate)}</Typography>
              </Box>
            )}
            <Box>
              <Typography variant="caption" color="text.secondary">
                Owner
              </Typography>
              <Typography variant="body1">{selectedLiability.owner}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Total Paid
              </Typography>
              <Typography variant="body1" color="success.main" fontWeight={600}>
                {formatCurrency(totalPaid)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Last Updated
              </Typography>
              <Typography variant="body1">{formatDate(selectedLiability.updatedAt)}</Typography>
            </Box>
            {selectedLiability.notes && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Notes
                </Typography>
                <Typography variant="body1">{selectedLiability.notes}</Typography>
              </Box>
            )}
          </Stack>

          {/* Custom Fields */}
          {selectedLiability.category === 'custom' && selectedLiability.customFields && selectedLiability.customFields.length > 0 && (
            <>
              <Divider sx={{ my: 1 }}>
                <Chip
                  label="Custom Fields"
                  size="small"
                  color="error"
                  variant="outlined"
                />
              </Divider>
              {selectedLiability.customFields.map((field) => (
                <Box key={field.id}>
                  <Typography variant="caption" color="text.secondary">
                    {field.name} {field.required && <span style={{ color: 'red' }}>*</span>}
                  </Typography>
                  <Typography variant="body1">
                    {field.type === 'currency' && field.value
                      ? formatCurrency(Number(field.value))
                      : field.type === 'percentage' && field.value
                      ? `${field.value}%`
                      : field.type === 'date' && field.value
                      ? formatDate(String(field.value))
                      : field.type === 'url' && field.value
                      ? <a href={String(field.value)} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2' }}>{field.value}</a>
                      : field.type === 'email' && field.value
                      ? <a href={`mailto:${field.value}`} style={{ color: '#1976d2' }}>{field.value}</a>
                      : field.type === 'phone' && field.value
                      ? <a href={`tel:${field.value}`} style={{ color: '#1976d2' }}>{field.value}</a>
                      : field.value || '—'}
                  </Typography>
                </Box>
              ))}
            </>
          )}
        </Stack>
      </MuiCard>

      {/* Transactions Section */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Payment History (EMI Tracking)
          </Typography>
          <Button
            variant="contained"
            color="error"
            startIcon={<i className="ri-add-line" style={{ fontSize: '18px' }} />}
            onClick={() => setDialogOpen(true)}
            sx={{ textTransform: 'none' }}
          >
            Record Payment
          </Button>
        </Box>

        {loadingTransactions ? (
          <Typography>Loading transactions...</Typography>
        ) : monthKeys.length === 0 ? (
          <MuiCard sx={{ p: 4, textAlign: 'center' }}>
            <i className="ri-file-list-line" style={{ fontSize: '48px', color: 'inherit', opacity: 0.5, marginBottom: '16px' }} />
            <Typography variant="body1" color="text.secondary">
              No payments recorded yet. Record your first EMI payment to start tracking.
            </Typography>
          </MuiCard>
        ) : (
          <Stack spacing={3}>
            {monthKeys.map((monthKey) => {
              const monthTransactions = groupedTransactions[monthKey];
              const [year, month] = monthKey.split('-');
              const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-IN', {
                month: 'long',
                year: 'numeric',
              });

              const monthTotal = monthTransactions
                .filter((txn: Transaction) => txn.type === 'emi_payment' || txn.type === 'payment')
                .reduce((sum: number, txn: Transaction) => sum + txn.amount, 0);

              return (
                <MuiCard key={monthKey} sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>
                      {monthName}
                    </Typography>
                    {monthTotal > 0 && (
                      <Typography variant="body1" color="success.main" fontWeight={600}>
                        Total Paid: {formatCurrency(monthTotal)}
                      </Typography>
                    )}
                  </Box>
                  <Timeline>
                    {monthTransactions.map((txn, index) => (
                      <TimelineItem key={txn.id}>
                        <TimelineSeparator>
                          <TimelineDot color={txn.type === 'emi_payment' ? 'success' : 'primary'}>
                            <i className="ri-money-rupee-circle-line" style={{ fontSize: '16px' }} />
                          </TimelineDot>
                          {index < monthTransactions.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                              <Typography variant="body1" fontWeight={500}>
                                {txn.description || (txn.type === 'emi_payment' ? 'EMI Payment' : txn.type)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {formatDate(txn.date)}
                              </Typography>
                              {txn.notes && (
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                  {txn.notes}
                                </Typography>
                              )}
                            </Box>
                            <Typography variant="h6" color="success.main" fontWeight={600}>
                              -{formatCurrency(txn.amount)}
                            </Typography>
                          </Box>
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                </MuiCard>
              );
            })}
          </Stack>
        )}
      </Box>

      <TransactionFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleAddTransaction}
        liabilityId={id}
      />
    </Stack>
  );
};

export default LiabilityDetailPage;

