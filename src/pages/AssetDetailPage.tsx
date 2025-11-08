import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Stack,
  Typography,
  Chip,
  Divider,
  Button,
  alpha,
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
import { fetchAssetById } from '../store/slices/assetSlice';
import { transactionService } from '../services/transactionService';
import { recurringScheduleService } from '../services/recurringScheduleService';
import type { Transaction, TransactionCreateInput, RecurringSchedule, RecurringScheduleCreateInput } from '../types';
import TransactionFormDialog from '../components/features/transactions/TransactionFormDialog';
import RecurringPaymentDialog from '../components/features/recurring/RecurringPaymentDialog';

export const AssetDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedAsset, loading } = useAppSelector((state) => state.assets);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [recurringDialogOpen, setRecurringDialogOpen] = useState(false);
  const [recurringSchedule, setRecurringSchedule] = useState<RecurringSchedule | null>(null);
  const [upcomingPayments, setUpcomingPayments] = useState<Array<{ date: string; amount: number; schedule: RecurringSchedule }>>([]);

  const loadTransactions = useCallback(async () => {
    if (!id) return;
    setLoadingTransactions(true);
    try {
      const txns = await transactionService.getTransactions({ assetId: id });
      setTransactions(txns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoadingTransactions(false);
    }
  }, [id]);

  const loadRecurringSchedule = useCallback(async () => {
    if (!id) return;
    try {
      const schedules = await recurringScheduleService.getSchedules({ assetId: id });
      if (schedules.length > 0) {
        setRecurringSchedule(schedules[0]);
        const upcoming = await recurringScheduleService.getUpcomingPayments(id, undefined, 6);
        setUpcomingPayments(upcoming);
      } else {
        setRecurringSchedule(null);
        setUpcomingPayments([]);
      }
    } catch (error) {
      console.error('Failed to load recurring schedule:', error);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      dispatch(fetchAssetById(id));
      loadTransactions();
      loadRecurringSchedule();
    }
  }, [id, dispatch, loadTransactions, loadRecurringSchedule]);

  const handleAddTransaction = async (values: TransactionCreateInput) => {
    if (!id) return;
    await transactionService.createTransaction({ ...values, assetId: id });
    setDialogOpen(false);
    // Refresh asset data to show updated value
    dispatch(fetchAssetById(id));
    loadTransactions();
  };

  const handleSetupRecurring = async (values: RecurringScheduleCreateInput) => {
    if (!id) return;
    if (recurringSchedule) {
      // Update existing schedule
      await recurringScheduleService.updateSchedule(recurringSchedule.id, values);
    } else {
      // Create new schedule
      await recurringScheduleService.createSchedule({ ...values, assetId: id });
    }
    setRecurringDialogOpen(false);
    loadRecurringSchedule();
  };

  const handleRecordScheduledPayment = async (paymentDate: string, amount: number) => {
    if (!id) return;
    await transactionService.createTransaction({
      assetId: id,
      type: 'deposit',
      amount,
      date: paymentDate,
      description: `Monthly FD Contribution - ${new Date(paymentDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}`,
    });
    dispatch(fetchAssetById(id));
    loadTransactions();
    loadRecurringSchedule();
  };

  if (loading) {
    return (
      <Box>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!selectedAsset) {
    return (
      <Box>
        <Typography>Asset not found</Typography>
        <Button onClick={() => navigate('/assets')}>Back to Assets</Button>
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

  const getDaySuffix = (day: number) => {
    if (day >= 11 && day <= 13) return 'th';
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      land: 'Land',
      gold: 'Gold',
      gold_scheme: 'Gold Scheme',
      lent_money: 'Lent Money',
      savings: 'Savings Account',
      fixed_deposit: 'Fixed Deposit',
      investment: 'Investment',
      property: 'Property',
      retirement: 'Retirement',
      other: 'Other',
    };
    return labels[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Button
          variant="text"
          startIcon={<i className="ri-arrow-left-line" style={{ fontSize: '18px' }} />}
          onClick={() => navigate('/assets')}
          sx={{ mb: 2, textTransform: 'none' }}
        >
          Back to Assets
        </Button>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
          {selectedAsset.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Asset Details & History
        </Typography>
      </Box>

      {/* Asset Details Card */}
      <MuiCard sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h5" color="primary" fontWeight={700}>
                {formatCurrency(selectedAsset.value)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Current Value
              </Typography>
            </Box>
            <Chip
              label={getCategoryLabel(selectedAsset.category)}
              sx={{
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
                fontWeight: 500,
              }}
            />
          </Box>

          <Divider />

          <Stack spacing={1.5}>
            {/* Initial Value & Gain/Loss */}
            {selectedAsset.initialValue && (
              <>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Initial/Purchase Value
                  </Typography>
                  <Typography variant="body1">{formatCurrency(selectedAsset.initialValue)}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Gain/Loss
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: selectedAsset.value >= selectedAsset.initialValue ? 'success.main' : 'error.main',
                      fontWeight: 600 
                    }}
                  >
                    {selectedAsset.value >= selectedAsset.initialValue ? '+' : ''}
                    {formatCurrency(selectedAsset.value - selectedAsset.initialValue)} 
                    ({((selectedAsset.value - selectedAsset.initialValue) / selectedAsset.initialValue * 100).toFixed(2)}%)
                  </Typography>
                </Box>
              </>
            )}

            {/* Description */}
            {selectedAsset.description && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1">{selectedAsset.description}</Typography>
              </Box>
            )}

            {/* Purchase Date */}
            {selectedAsset.purchaseDate && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Purchase Date
                </Typography>
                <Typography variant="body1">{formatDate(selectedAsset.purchaseDate)}</Typography>
              </Box>
            )}

            {/* End/Maturity Date */}
            {selectedAsset.endDate && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  End/Maturity Date
                </Typography>
                <Typography variant="body1">{formatDate(selectedAsset.endDate)}</Typography>
              </Box>
            )}

            {/* Rate of Return */}
            {selectedAsset.rateOfReturn !== undefined && selectedAsset.rateOfReturn !== null && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Rate of Return / Interest Rate
                </Typography>
                <Typography variant="body1">{selectedAsset.rateOfReturn}% per annum</Typography>
              </Box>
            )}

            {/* Monthly Payment */}
            {selectedAsset.monthlyPayment && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Monthly Payment
                </Typography>
                <Typography variant="body1">{formatCurrency(selectedAsset.monthlyPayment)}</Typography>
              </Box>
            )}

            {/* Location */}
            {selectedAsset.location && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Location
                </Typography>
                <Typography variant="body1">{selectedAsset.location}</Typography>
              </Box>
            )}

            {/* Institution */}
            {selectedAsset.institution && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Institution
                </Typography>
                <Typography variant="body1">{selectedAsset.institution}</Typography>
              </Box>
            )}

            {/* Account Number */}
            {selectedAsset.accountNumber && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Account Number
                </Typography>
                <Typography variant="body1">{selectedAsset.accountNumber}</Typography>
              </Box>
            )}

            {/* Document URL */}
            {selectedAsset.documentURL && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Document Link
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  href={selectedAsset.documentURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<i className="ri-link" style={{ fontSize: '16px' }} />}
                  sx={{ textTransform: 'none', mt: 0.5 }}
                >
                  View External Document
                </Button>
              </Box>
            )}

            {/* Multiple Documents */}
            {selectedAsset.documents && selectedAsset.documents.length > 0 && (
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  Uploaded Documents ({selectedAsset.documents.length})
                </Typography>
                <Stack spacing={1}>
                  {selectedAsset.documents.map((doc) => {
                    const getFileIcon = (type: string) => {
                      if (type.includes('pdf')) return 'ri-file-pdf-line';
                      if (type.includes('image')) return 'ri-image-line';
                      if (type.includes('word') || type.includes('document')) return 'ri-file-word-line';
                      return 'ri-file-line';
                    };

                    return (
                      <Box
                        key={doc.id}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          p: 1.5,
                          border: 1,
                          borderColor: 'divider',
                          borderRadius: 1,
                          bgcolor: 'background.paper',
                          '&:hover': {
                            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                          <i className={getFileIcon(doc.type)} style={{ fontSize: '28px', color: '#2196f3' }} />
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" fontWeight={500} noWrap>
                              {doc.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Uploaded: {formatDate(doc.uploadedAt)}
                            </Typography>
                          </Box>
                        </Box>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => window.open(doc.url, '_blank')}
                          startIcon={<i className="ri-eye-line" style={{ fontSize: '16px' }} />}
                          sx={{ textTransform: 'none' }}
                        >
                          View
                        </Button>
                      </Box>
                    );
                  })}
                </Stack>
              </Box>
            )}

            {/* Owner */}
            <Box>
              <Typography variant="caption" color="text.secondary">
                Owner
              </Typography>
              <Typography variant="body1">{selectedAsset.owner}</Typography>
            </Box>

            {/* Created At */}
            {selectedAsset.createdAt && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Created
                </Typography>
                <Typography variant="body1">{formatDate(selectedAsset.createdAt)}</Typography>
              </Box>
            )}

            {/* Last Updated */}
            <Box>
              <Typography variant="caption" color="text.secondary">
                Last Updated
              </Typography>
              <Typography variant="body1">{formatDate(selectedAsset.updatedAt)}</Typography>
            </Box>

            {/* Notes */}
            {selectedAsset.notes && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Notes
                </Typography>
                <Typography variant="body1">{selectedAsset.notes}</Typography>
              </Box>
            )}
          </Stack>
        </Stack>
      </MuiCard>

      {/* Recurring Payment Section */}
      {recurringSchedule ? (
        <MuiCard sx={{ p: 3, bgcolor: (theme) => alpha(theme.palette.info.main, 0.05) }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
                Monthly Payment Schedule
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fixed Deposit - Monthly Contribution
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip label="Active" color="success" size="small" />
              <Button
                size="small"
                variant="outlined"
                startIcon={<i className="ri-edit-line" style={{ fontSize: '14px' }} />}
                onClick={() => setRecurringDialogOpen(true)}
                sx={{ textTransform: 'none' }}
              >
                Edit
              </Button>
            </Box>
          </Box>

          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Monthly Amount:
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {formatCurrency(recurringSchedule.amount)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Payment Day:
              </Typography>
              <Typography variant="body1">
                {recurringSchedule.dayOfMonth}{getDaySuffix(recurringSchedule.dayOfMonth)} of each month
              </Typography>
            </Box>
            {recurringSchedule.endDate && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  End Date:
                </Typography>
                <Typography variant="body1">{formatDate(recurringSchedule.endDate)}</Typography>
              </Box>
            )}
          </Stack>

          {upcomingPayments.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                Upcoming Payments (Next 6 Months)
              </Typography>
              <Stack spacing={1}>
                {upcomingPayments.slice(0, 6).map((payment, index) => {
                  const isPast = new Date(payment.date) < new Date();
                  const isToday = new Date(payment.date).toDateString() === new Date().toDateString();
                  const isRecorded = transactions.some(
                    (txn) => txn.date === payment.date && txn.amount === payment.amount
                  );

                  return (
                    <Box
                      key={index}
                      sx={{
                        p: 1.5,
                        borderRadius: 1,
                        bgcolor: isRecorded
                          ? alpha('#4caf50', 0.1)
                          : isToday
                          ? alpha('#2196f3', 0.1)
                          : 'background.paper',
                        border: 1,
                        borderColor: isRecorded ? 'success.main' : isToday ? 'primary.main' : 'divider',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {formatDate(payment.date)}
                          {isToday && (
                            <Chip label="Today" size="small" color="primary" sx={{ ml: 1, height: 20 }} />
                          )}
                          {isRecorded && (
                            <Chip label="Paid" size="small" color="success" sx={{ ml: 1, height: 20 }} />
                          )}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {payment.schedule.description || 'Monthly FD Contribution'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body1" fontWeight={600}>
                          {formatCurrency(payment.amount)}
                        </Typography>
                        {!isRecorded && !isPast && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleRecordScheduledPayment(payment.date, payment.amount)}
                            sx={{ textTransform: 'none', minWidth: 'auto', px: 1.5 }}
                          >
                            Record
                          </Button>
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          )}
        </MuiCard>
      ) : (
        <MuiCard sx={{ p: 3, textAlign: 'center', bgcolor: (theme) => alpha(theme.palette.info.main, 0.05) }}>
          <i className="ri-calendar-todo-line" style={{ fontSize: '48px', color: 'inherit', opacity: 0.5, marginBottom: '16px' }} />
          <Typography variant="body1" fontWeight={500} sx={{ mb: 1 }}>
            No Monthly Payment Schedule
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Set up automatic monthly payments for this Fixed Deposit
          </Typography>
          <Button
            variant="contained"
            startIcon={<i className="ri-calendar-line" style={{ fontSize: '18px' }} />}
            onClick={() => setRecurringDialogOpen(true)}
            sx={{ textTransform: 'none' }}
          >
            Set Up Monthly Payment
          </Button>
        </MuiCard>
      )}

      {/* Transactions Section */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Transaction History
          </Typography>
          <Button
            variant="contained"
            startIcon={<i className="ri-add-line" style={{ fontSize: '18px' }} />}
            onClick={() => setDialogOpen(true)}
            sx={{ textTransform: 'none' }}
          >
            Add Transaction
          </Button>
        </Box>

        {loadingTransactions ? (
          <Typography>Loading transactions...</Typography>
        ) : monthKeys.length === 0 ? (
          <MuiCard sx={{ p: 4, textAlign: 'center' }}>
            <i className="ri-file-list-line" style={{ fontSize: '48px', color: 'inherit', opacity: 0.5, marginBottom: '16px' }} />
            <Typography variant="body1" color="text.secondary">
              No transactions yet. Add your first transaction to track changes.
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

              return (
                <MuiCard key={monthKey} sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                    {monthName}
                  </Typography>
                  <Timeline>
                    {monthTransactions.map((txn, index) => (
                      <TimelineItem key={txn.id}>
                        <TimelineSeparator>
                          <TimelineDot
                            color={
                              txn.type === 'deposit'
                                ? 'success'
                                : txn.type === 'withdrawal'
                                ? 'error'
                                : 'primary'
                            }
                          >
                            <i
                              className={
                                txn.type === 'deposit'
                                  ? 'ri-arrow-down-line'
                                  : txn.type === 'withdrawal'
                                  ? 'ri-arrow-up-line'
                                  : 'ri-exchange-line'
                              }
                              style={{ fontSize: '16px' }}
                            />
                          </TimelineDot>
                          {index < monthTransactions.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                              <Typography variant="body1" fontWeight={500}>
                                {txn.description || txn.type}
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
                            <Typography
                              variant="h6"
                              color={txn.type === 'deposit' ? 'success.main' : 'error.main'}
                              fontWeight={600}
                            >
                              {txn.type === 'deposit' ? '+' : '-'}
                              {formatCurrency(txn.amount)}
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
        assetId={id}
      />

      <RecurringPaymentDialog
        open={recurringDialogOpen}
        onClose={() => setRecurringDialogOpen(false)}
        onSubmit={handleSetupRecurring}
        assetId={id}
        initialValues={recurringSchedule ? {
          amount: recurringSchedule.amount,
          dayOfMonth: recurringSchedule.dayOfMonth,
          startDate: recurringSchedule.startDate,
          endDate: recurringSchedule.endDate,
          description: recurringSchedule.description,
        } : undefined}
      />
    </Stack>
  );
};

export default AssetDetailPage;

