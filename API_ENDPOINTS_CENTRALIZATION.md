# API Endpoints Centralization

All API endpoints are now maintained in a centralized location for better maintainability and consistency.

## 📍 Location

**File:** `frontend/src/config/constants.ts`

## 🎯 Benefits

1. **Single Source of Truth**: All endpoints defined in one place
2. **Easy Maintenance**: Update endpoints in one location
3. **Type Safety**: Functions with parameters ensure correct usage
4. **Consistency**: No hardcoded strings scattered across codebase
5. **Future-Proof**: Easy to add new endpoints

## 📋 Available Endpoints

### Auth Endpoints
```typescript
API_ENDPOINTS.AUTH.LOGIN        // '/auth/login'
API_ENDPOINTS.AUTH.LOGOUT       // '/auth/logout'
API_ENDPOINTS.AUTH.REGISTER     // '/auth/register'
API_ENDPOINTS.AUTH.PROFILE      // '/auth/profile'
API_ENDPOINTS.AUTH.REFRESH      // '/auth/refresh'
```

### User Endpoints
```typescript
API_ENDPOINTS.USERS             // '/users'
API_ENDPOINTS.USER_BY_ID(id)    // '/users/:id' (dynamic)
```

### Asset Endpoints
```typescript
API_ENDPOINTS.ASSETS            // '/assets'
API_ENDPOINTS.ASSET_BY_ID(id)   // '/assets/:id' (dynamic)
API_ENDPOINTS.ASSET_SUMMARY     // '/assets/summary'
```

### Liability Endpoints
```typescript
API_ENDPOINTS.LIABILITIES           // '/liabilities'
API_ENDPOINTS.LIABILITY_BY_ID(id)   // '/liabilities/:id' (dynamic)
API_ENDPOINTS.LIABILITY_SUMMARY     // '/liabilities/summary'
```


## 🔧 Updated Services

All service files now use centralized endpoints:

### ✅ assetService.ts
- `getAssets()` → uses `API_ENDPOINTS.ASSETS`
- `getAssetById()` → uses `API_ENDPOINTS.ASSET_BY_ID(id)`
- `createAsset()` → uses `API_ENDPOINTS.ASSETS`
- `updateAsset()` → uses `API_ENDPOINTS.ASSET_BY_ID(id)`
- `deleteAsset()` → uses `API_ENDPOINTS.ASSET_BY_ID(id)`
- `getAssetSummary()` → uses `API_ENDPOINTS.ASSET_SUMMARY`

### ✅ liabilityService.ts
- `getLiabilities()` → uses `API_ENDPOINTS.LIABILITIES`
- `getLiabilityById()` → uses `API_ENDPOINTS.LIABILITY_BY_ID(id)`
- `createLiability()` → uses `API_ENDPOINTS.LIABILITIES`
- `updateLiability()` → uses `API_ENDPOINTS.LIABILITY_BY_ID(id)`
- `deleteLiability()` → uses `API_ENDPOINTS.LIABILITY_BY_ID(id)`
- `getLiabilitySummary()` → uses `API_ENDPOINTS.LIABILITY_SUMMARY`

### ✅ authService.ts
- `login()` → uses `API_ENDPOINTS.AUTH.LOGIN`
- `register()` → uses `API_ENDPOINTS.AUTH.REGISTER`
- `getProfile()` → uses `API_ENDPOINTS.AUTH.PROFILE`
- `refreshToken()` → uses `API_ENDPOINTS.AUTH.REFRESH`
- Also uses `STORAGE_KEYS.AUTH_TOKEN` for localStorage

### ✅ userService.ts
- `getUsers()` → uses `API_ENDPOINTS.USERS`
- `getUserById()` → uses `API_ENDPOINTS.USER_BY_ID(id)`
- `createUser()` → uses `API_ENDPOINTS.USERS`
- `updateUser()` → uses `API_ENDPOINTS.USER_BY_ID(id)`
- `deleteUser()` → uses `API_ENDPOINTS.USER_BY_ID(id)`

## 📝 Usage Example

```typescript
// Before (hardcoded)
await apiClient.get('/assets/123');

// After (centralized)
import { API_ENDPOINTS } from '../config/constants';
await apiClient.get(API_ENDPOINTS.ASSET_BY_ID('123'));
```

## 🔐 Storage Keys

Also centralized localStorage keys:

```typescript
STORAGE_KEYS.AUTH_TOKEN         // 'auth_token'
STORAGE_KEYS.USER_PREFERENCES   // 'user_preferences'
STORAGE_KEYS.THEME              // 'theme'
```

## 🚀 Adding New Endpoints

To add a new endpoint:

1. **Add to constants.ts:**
```typescript
export const API_ENDPOINTS = {
  // ... existing endpoints ...
  
  // New Feature Endpoints
  FEATURE: '/feature',
  FEATURE_BY_ID: (id: string) => `/feature/${id}`,
} as const;
```

2. **Use in service:**
```typescript
import { API_ENDPOINTS } from '../config/constants';

export const featureService = {
  async getFeatures() {
    return apiClient.get(API_ENDPOINTS.FEATURE);
  },
  
  async getFeatureById(id: string) {
    return apiClient.get(API_ENDPOINTS.FEATURE_BY_ID(id));
  },
};
```

## ✨ Best Practices

1. ✅ **Always** import from `constants.ts`
2. ✅ **Never** hardcode endpoint strings in service files
3. ✅ Use **function syntax** for dynamic IDs: `(id: string) => \`/path/\${id}\``
4. ✅ Keep endpoint structure **consistent** with backend
5. ✅ Add **comments** for future/mock endpoints

---

**Last Updated:** 2025-11-09  
**Status:** ✅ Complete - All endpoints centralized

