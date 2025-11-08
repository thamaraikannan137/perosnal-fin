# Dashboard Design Guidelines

## Component Usage

### Dashboard Page (HomePage)
- **DO NOT** use DataGrid component
- Use simple card-based lists with basic information
- Show recent/summary items only (5-10 items max)
- Focus on overview and quick actions
- Use MuiCard for sections
- Keep it clean and simple

### Dedicated Pages (AssetsPage, LiabilitiesPage)
- **DO** use DataGrid component with full features:
  - Sorting
  - Filtering
  - Search
  - Pagination
  - Full CRUD operations
  - All columns and details

## Dashboard Structure
1. Summary Cards (Total Assets, Liabilities, Net Worth)
2. Charts/Visualizations
3. Quick Action Buttons (Add Asset, Liability, Transaction)
4. Recent Transactions (simple list, not DataGrid)
5. Recent Assets (simple cards/list, not DataGrid)
6. Recent Liabilities (simple cards/list, not DataGrid)

## Key Principles
- Dashboard = Overview & Quick Access
- Dedicated Pages = Full Data Management
- Keep dashboard lightweight and fast
- Use "View All" links to navigate to full pages

