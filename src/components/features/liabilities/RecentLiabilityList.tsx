import React from 'react';
import { Box, Stack, Typography, Chip, alpha } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Liability } from '../../../types';
import { formatCurrency, formatDate } from '../../../utils';
import { LiabilityCategory } from '../../../types/models';

interface RecentLiabilityListProps {
  liabilities: Liability[];
}

const categoryLabels: Record<LiabilityCategory, string> = {
  credit: 'Credit',
  loan: 'Loan',
  mortgage: 'Mortgage',
  tax: 'Tax',
  other: 'Other',
};

export const RecentLiabilityList: React.FC<RecentLiabilityListProps> = ({ liabilities }) => {
  const navigate = useNavigate();

  if (liabilities.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
        No recent liabilities
      </Typography>
    );
  }

  return (
    <Stack spacing={1.5}>
      {liabilities.map((liability) => (
        <Box
          key={liability.id}
          onClick={() => navigate(`/liabilities/${liability.id}`)}
          sx={{
            p: 2,
            borderRadius: 1,
            border: 1,
            borderColor: 'divider',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.05),
              borderColor: 'error.main',
              transform: 'translateX(4px)',
            },
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                <Typography variant="body1" fontWeight={600}>
                  {liability.name}
                </Typography>
                <Chip
                  size="small"
                  label={categoryLabels[liability.category]}
                  color="error"
                  variant="outlined"
                  sx={{
                    height: 20,
                    fontSize: '0.7rem',
                    fontWeight: 500,
                  }}
                />
              </Stack>
              {liability.institution && (
                <Typography variant="caption" color="text.secondary">
                  {liability.institution}
                </Typography>
              )}
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body1" fontWeight={700} color="error.main">
                {formatCurrency(liability.balance)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDate(liability.updatedAt)}
              </Typography>
            </Box>
          </Stack>
        </Box>
      ))}
    </Stack>
  );
};

export default RecentLiabilityList;
