import React from 'react';
import { Box, Stack, Typography, Chip, alpha } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Asset } from '../../../types';
import { formatCurrency, formatDate } from '../../../utils';
import { AssetCategory } from '../../../types/models';

interface RecentAssetListProps {
  assets: Asset[];
}

const categoryLabels: Record<AssetCategory, string> = {
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
  custom: 'Custom',
};

export const RecentAssetList: React.FC<RecentAssetListProps> = ({ assets }) => {
  const navigate = useNavigate();

  if (assets.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
        No recent assets
      </Typography>
    );
  }

  return (
    <Stack spacing={1.5}>
      {assets.map((asset) => (
        <Box
          key={asset.id}
          onClick={() => navigate(`/assets/${asset.id}`)}
          sx={{
            p: 2,
            borderRadius: 1,
            border: 1,
            borderColor: 'divider',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
              borderColor: 'primary.main',
              transform: 'translateX(4px)',
            },
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                <Typography variant="body1" fontWeight={600}>
                  {asset.name}
                </Typography>
                <Chip
                  size="small"
                  label={asset.category === 'custom' && asset.customCategoryName 
                    ? asset.customCategoryName 
                    : categoryLabels[asset.category]}
                  sx={{
                    height: 20,
                    fontSize: '0.7rem',
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                    fontWeight: 500,
                  }}
                />
              </Stack>
              {asset.institution && (
                <Typography variant="caption" color="text.secondary">
                  {asset.institution}
                </Typography>
              )}
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body1" fontWeight={700} color="primary.main">
                {formatCurrency(asset.value)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDate(asset.updatedAt)}
              </Typography>
            </Box>
          </Stack>
        </Box>
      ))}
    </Stack>
  );
};

export default RecentAssetList;

