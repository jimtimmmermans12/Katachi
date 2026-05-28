# Shopify Admin API - Product Creation Script

## Overview

Safe TypeScript script to create draft products in Shopify via the Admin API. The script:

✓ Checks if each product already exists before creating  
✓ Creates products as **DRAFT** (not active)  
✓ Never modifies or deletes existing products  
✓ Supports dry-run preview  
✓ Uses secure environment variables (no hardcoded tokens)

## Prerequisites

### 1. Get Shopify Admin API Credentials

You need:
- **SHOPIFY_STORE_DOMAIN**: Your Shopify store domain (e.g., `uizjgi-vj.myshopify.com`)
- **SHOPIFY_ADMIN_ACCESS_TOKEN**: Admin API access token from Shopify

To create an Admin API token:
1. Go to your Shopify Admin: https://admin.shopify.com
2. Navigate to **Settings → Apps and integrations → API credentials**
3. Create a new app with scopes:
   - `write_products`
   - `read_products`
4. Copy the **Admin API token** (keep it secret!)

### 2. Environment Variables

Create a `.env.local` file in the project root:

```bash
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**⚠️ Security:**
- Never commit `.env.local` to git
- Never share your Admin API token
- Use environment-specific tokens in production

## Usage

### Option 1: Dry Run (Preview)

See what would happen without making any changes:

```bash
npx ts-node scripts/create-shopify-products.ts --dry-run
```

Output example:
```
✓ Environment variables found
  Store: your-store.myshopify.com
✓ Loaded 8 products from configuration

🔍 DRY RUN MODE - No changes will be made

Products to be processed:
  • HIKARI MISKA              (hikari-miska) - €98.00
  • KAZE SAKE SET             (kaze-sake-set) - €124.00
  • TSUKI SCHENKKAN           (tsuki-schenkkan) - €89.00
  ... [more products]

💡 Note: Script will check if each product exists before creating.
    Existing products will be skipped.
```

### Option 2: Execute (Actually Create)

Create the products in Shopify:

```bash
npx ts-node scripts/create-shopify-products.ts --execute
```

The script will:
1. Check if each product exists in Shopify
2. Skip products that already exist
3. Create new products as DRAFT status
4. Show summary of created/skipped/failed

Example output:
```
🚀 EXECUTE MODE - Creating products in Shopify...

  Checking HIKARI MISKA               ... ✓ Created: HIKARI MISKA (DRAFT)
  Checking KAZE SAKE SET              ... ✓ Created: KAZE SAKE SET (DRAFT)
  Checking TSUKI SCHENKKAN            ... ✓ Created: TSUKI SCHENKKAN (DRAFT)
  ...

╔════════════════════════════════════════════════════════╗
║  Summary                                               ║
╚════════════════════════════════════════════════════════╝
✓ Created:  8
⊘ Skipped:  0
❌ Failed:  0
Total:     8

✅ All products created successfully!
```

## Product Data

Products are loaded from `lib/mockProducts.ts` and include:

| Product | Price | Category | Handle |
|---------|-------|----------|--------|
| HIKARI MISKA | €98 | Ceramics | hikari-miska |
| KAZE SAKE SET | €124 | Ceramics | kaze-sake-set |
| TSUKI SCHENKKAN | €89 | Ceramics | tsuki-schenkkan |
| SUMI TRAY | €84 | Wood | sumi-tray |
| SHIZEN SCHAAL | €67 | Wood | shizen-schaal |
| ORI PLACEMAT | €38 | Linen | ori-placemat |
| NAMI BESTEK | €112 | Metal | nami-bestek |
| FURO KAARSENHOUDER | €74 | Metal | furo-kaarsenhouder |

## Safety Features

- ✅ **Non-destructive**: Never modifies or deletes existing products
- ✅ **Duplicate detection**: Checks if product exists by handle before creating
- ✅ **Draft status**: All products created as DRAFT, not visible to customers
- ✅ **No hardcoded secrets**: Uses environment variables only
- ✅ **Dry-run mode**: Preview changes before executing
- ✅ **Error handling**: Graceful failure with detailed messages
- ✅ **Logging**: Clear output showing what was done

## Troubleshooting

### Missing environment variables
```
❌ Error: Missing environment variable: SHOPIFY_STORE_DOMAIN
```
→ Add variables to `.env.local`

### Invalid Admin API token
```
GraphQL error: Invalid API credentials
```
→ Check token in Shopify Admin Settings

### Product creation fails
```
❌ Failed to create PRODUCT_NAME: ...
```
→ Check product handle is unique in Shopify

## Next Steps

After running `--execute`:

1. ✅ Products created as DRAFT in your Shopify store
2. 📸 Upload product images in Shopify Admin
3. ✏️ Review and edit product details if needed
4. 🚀 Publish products when ready

The collection page will automatically show published products via Storefront API.

## API Reference

Uses Shopify Admin API 2025-01 with GraphQL mutations:
- `Query: GetProductByHandle` - Check if product exists
- `Mutation: ProductCreate` - Create new product with variant

See: https://shopify.dev/docs/api/admin-graphql
