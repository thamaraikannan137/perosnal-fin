import { useMemo } from 'react';
import { Chip, Stack } from '@mui/material';
import type { Liability } from '../../../types';
import { Button, DataGrid, type Column } from '../../common';
import { formatCurrency, formatDate } from '../../../utils';
import { LiabilityCategory } from '../../../types/models';

interface LiabilityListProps {
  liabilities: Liability[];
  loading?: boolean;
  onSelectLiability?: (liabilityId: string) => void;
  onEditLiability?: (liability: Liability) => void;
  onDeleteLiability?: (liability: Liability) => void;
}

const categoryLabels: Record<LiabilityCategory, string> = {
  credit: 'Credit',
  loan: 'Loan',
  mortgage: 'Mortgage',
  tax: 'Tax',
  other: 'Other',
};

export const LiabilityList = ({
  liabilities,
  loading = false,
  onSelectLiability,
  onEditLiability,
  onDeleteLiability,
}: LiabilityListProps) => {
  const filterOptions = useMemo(
    () =>
      Object.values(LiabilityCategory).map((value) => ({
        label: categoryLabels[value],
        value: value,
        field: 'category' as keyof Liability,
      })),
    []
  );

  const columns: Column<Liability>[] = [
    {
      id: 'name',
      label: 'Name',
      minWidth: 200,
      sortable: true,
    },
    {
      id: 'category',
      label: 'Category',
      minWidth: 120,
      sortable: true,
      format: (value) => (
        <Chip
          size="small"
          label={categoryLabels[value as LiabilityCategory]}
          color="error"
          variant="outlined"
          sx={{
            height: 24,
            fontSize: '0.75rem',
            fontWeight: 500,
          }}
        />
      ),
    },
    {
      id: 'institution',
      label: 'Institution',
      minWidth: 150,
      sortable: true,
      format: (value) => (value ? String(value) : '—'),
    },
    {
      id: 'owner',
      label: 'Owner',
      minWidth: 120,
      sortable: true,
    },
    {
      id: 'balance',
      label: 'Balance',
      minWidth: 150,
      align: 'right',
      sortable: true,
      format: (value) => (
        <strong style={{ color: 'inherit' }}>{formatCurrency(value as number)}</strong>
      ),
    },
    {
      id: 'interestRate',
      label: 'Interest Rate',
      minWidth: 120,
      align: 'right',
      sortable: true,
      format: (value) => (value !== null && value !== undefined ? `${value}%` : '—'),
    },
    {
      id: 'dueDate',
      label: 'Due Date',
      minWidth: 120,
      sortable: true,
      format: (value) => (value ? formatDate(value as string) : '—'),
    },
    {
      id: 'updatedAt',
      label: 'Updated',
      minWidth: 120,
      sortable: true,
      format: (value) => formatDate(value as string),
    },
  ];

  return (
    <DataGrid<Liability & Record<string, unknown>>
      data={liabilities as (Liability & Record<string, unknown>)[]}
      columns={columns}
      loading={loading}
      searchable={true}
      searchPlaceholder="Search liabilities..."
      filterable={true}
      filterOptions={filterOptions}
      onRowClick={onSelectLiability ? (row) => onSelectLiability((row as Liability).id) : undefined}
      actions={
        onEditLiability || onDeleteLiability
          ? (row) => {
              const liability = row as Liability;
              return (
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  {onEditLiability && (
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<i className="ri-edit-line" style={{ fontSize: '14px' }} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditLiability(liability);
                      }}
                      sx={{
                        textTransform: 'none',
                        minWidth: 'auto',
                        px: 1.5,
                      }}
                    >
                      Edit
                    </Button>
                  )}
                  {onDeleteLiability && (
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      startIcon={<i className="ri-delete-bin-line" style={{ fontSize: '14px' }} />}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteLiability(liability);
                      }}
                      sx={{
                        textTransform: 'none',
                        minWidth: 'auto',
                        px: 1.5,
                      }}
                    >
                      Delete
                    </Button>
                  )}
                </Stack>
              );
            }
          : undefined
      }
      emptyMessage="No liabilities found. Track your obligations to stay informed."
    />
  );
};

export default LiabilityList;

