# Asset Schema Documentation

## Overview
Enhanced asset model that supports multiple asset types with different field requirements.

## Asset Types and Field Usage

### 1. **Land / Property** (`land`, `property`)
**Required Fields:**
- `name`: "Land at Salem"
- `category`: "land"
- `purchaseDate`: Date of purchase/registration
- `value`: Current market value
- `location`: "Salem, Tamil Nadu, India"
- `documentURL`: Land deed/registration document

**Optional:**
- `initialValue`: Original purchase price
- `description`: Detailed property description
- `owner`: Owner name(s)

---

### 2. **Gold Investment / Monthly Scheme** (`gold`, `gold_scheme`)
**Required Fields:**
- `name`: "Gold Monthly Scheme - Jan 2025"
- `category`: "gold_scheme"
- `purchaseDate`: Scheme start date
- `monthlyPayment`: Monthly contribution amount
- `value`: Current value
- `documentURL`: Scheme certificate/receipt

**Optional:**
- `endDate`: Scheme maturity date
- `rateOfReturn`: Interest rate (if applicable)
- `recurringPayment`: For auto-debit schemes

---

### 3. **Lent Money** (`lent_money`)
**Required Fields:**
- `name`: "Loan to Friend ABC"
- `category`: "lent_money"
- `purchaseDate`: Date loan was given
- `value`: Principal + pending interest
- `endDate`: Expected repayment date
- `documentURL`: Loan agreement

**Optional:**
- `rateOfReturn`: Interest rate charged
- `initialValue`: Original principal amount
- `description`: Loan terms and conditions

---

### 4. **Fixed Deposit** (`fixed_deposit`)
**Required Fields:**
- `name`: "FD - Bank X"
- `category`: "fixed_deposit"
- `purchaseDate`: FD start date
- `value`: Current value
- `endDate`: Maturity date
- `rateOfReturn`: Interest rate
- `institution`: Bank name

**Optional:**
- `accountNumber`: FD account number
- `monthlyPayment`: For recurring deposits
- `documentURL`: FD certificate
- `recurringPayment`: For monthly FD schemes

---

### 5. **Savings Account** (`savings`)
**Required Fields:**
- `name`: "Savings Account - Bank X"
- `category`: "savings"
- `value`: Current balance
- `institution`: Bank name

**Optional:**
- `accountNumber`: Account number
- `documentURL`: Bank statement
- `rateOfReturn`: Interest rate

---

## Field Descriptions

| Field | Type | Description | MVP Required |
|-------|------|-------------|--------------|
| `id` | UUID | Unique identifier | ✅ Yes |
| `userId` | UUID | User reference (for multi-user) | ❌ Future |
| `category` | Enum | Asset type | ✅ Yes |
| `name` | String | Asset name/label | ✅ Yes |
| `description` | String | Detailed notes | ❌ Optional |
| `value` | Number | Current value | ✅ Yes |
| `initialValue` | Number | Original purchase price | ❌ Optional |
| `purchaseDate` | Date | Acquisition date | ✅ Yes |
| `endDate` | Date | Maturity/end date | ❌ Type-specific |
| `rateOfReturn` | Number | Interest/ROI percentage | ❌ Type-specific |
| `monthlyPayment` | Number | Monthly contribution | ❌ Scheme types |
| `documentURL` | String | Document link | ✅ Yes |
| `location` | String | Physical location | ❌ Land/property |
| `owner` | String | Owner name | ✅ Yes |
| `institution` | String | Bank/institution | ❌ Financial assets |
| `accountNumber` | String | Account number | ❌ Optional |
| `notes` | String | Additional notes | ❌ Optional |
| `createdAt` | DateTime | Creation timestamp | ✅ Yes |
| `updatedAt` | DateTime | Last update timestamp | ✅ Yes |

## UI/UX Implementation

### Add/Edit Asset Form
1. **Step 1**: Select Asset Type (dropdown)
2. **Step 2**: Show conditional fields based on type
3. **Step 3**: Upload document (optional but recommended)
4. **Step 4**: Save

### Asset List View
- Show: Name, Type badge, Value, Purchase Date
- Click to expand: Full details + document link
- Actions: Edit, Delete, View Document

### Document Handling
- Allow file upload (PDF, images)
- Store in cloud storage (future: Firebase, S3)
- For MVP: Store URL/path
- Show download/view link in detail view

## Gain/Loss Tracking
When `initialValue` is present:
```javascript
const gainLoss = asset.value - (asset.initialValue || 0);
const gainLossPercent = ((gainLoss / asset.initialValue) * 100).toFixed(2);
```

## Validation Rules
- `value` must be > 0
- `rateOfReturn` must be 0-100 (percentage)
- `purchaseDate` <= today
- `endDate` >= `purchaseDate` (if both present)
- `documentURL` should be valid URL format

## Database Indexes (for future optimization)
- `userId` + `category`
- `userId` + `createdAt`
- `endDate` (for maturity alerts)

