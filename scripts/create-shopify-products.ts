/**
 * Shopify Admin API Script - Create Draft Products
 * 
 * Usage:
 *   npx ts-node scripts/create-shopify-products.ts --dry-run
 *   npx ts-node scripts/create-shopify-products.ts --execute
 * 
 * Environment Variables Required:
 *   SHOPIFY_STORE_DOMAIN      - e.g., "your-store.myshopify.com"
 *   SHOPIFY_ADMIN_ACCESS_TOKEN - Admin API access token
 */

import * as fs from "fs";

// Product data structure
interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  productType: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  featuredImage?: {
    url: string;
    altText?: string | null;
  };
}

interface CreateProductInput {
  title: string;
  handle: string;
  bodyHtml: string;
  productType: string;
  status: "DRAFT" | "ACTIVE";
  variants: {
    price: string;
    barcode?: string;
  }[];
  tags: string[];
}

// Load mock products
function loadMockProducts(): Product[] {
  const mockPath = "./lib/mockProducts.ts";

  if (!fs.existsSync(mockPath)) {
    throw new Error(`Mock products file not found: ${mockPath}`);
  }

  // Note: In a real scenario, we'd import the TypeScript module
  // For now, we use the hardcoded products (same as mockProducts.ts)
  return [
    {
      id: "gid://shopify/Product/1",
      title: "HIKARI MISKA",
      handle: "hikari-miska",
      description: "Handcrafted stoneware with soft glaze and a quiet, warm presence.",
      productType: "Ceramics",
      priceRange: { minVariantPrice: { amount: "98.00", currencyCode: "EUR" } },
    },
    {
      id: "gid://shopify/Product/2",
      title: "KAZE SAKE SET",
      handle: "kaze-sake-set",
      description: "Soft matte porcelain for table ceremonies — two cups, one carafe.",
      productType: "Ceramics",
      priceRange: { minVariantPrice: { amount: "124.00", currencyCode: "EUR" } },
    },
    {
      id: "gid://shopify/Product/3",
      title: "TSUKI SCHENKKAN",
      handle: "tsuki-schenkkan",
      description: "Asymmetrisch steengoed met ijzeroxideglazuur en een stevige, warme greep.",
      productType: "Ceramics",
      priceRange: { minVariantPrice: { amount: "89.00", currencyCode: "EUR" } },
    },
    {
      id: "gid://shopify/Product/4",
      title: "SUMI TRAY",
      handle: "sumi-tray",
      description: "Zwart gelakt mangohout met strak silhouet en subtiele houtskooldetails.",
      productType: "Wood",
      priceRange: { minVariantPrice: { amount: "84.00", currencyCode: "EUR" } },
    },
    {
      id: "gid://shopify/Product/5",
      title: "SHIZEN SCHAAL",
      handle: "shizen-schaal",
      description: "Onbehandeld esdoorn met zichtbare nerf, licht en onverwacht duurzaam.",
      productType: "Wood",
      priceRange: { minVariantPrice: { amount: "67.00", currencyCode: "EUR" } },
    },
    {
      id: "gid://shopify/Product/6",
      title: "ORI PLACEMAT",
      handle: "ori-placemat",
      description: "Dubbel geweven linnen in ongebleekte toon, eenvoudig en tijdloos.",
      productType: "Linen",
      priceRange: { minVariantPrice: { amount: "38.00", currencyCode: "EUR" } },
    },
    {
      id: "gid://shopify/Product/7",
      title: "NAMI BESTEK",
      handle: "nami-bestek",
      description: "Geborsteld messing, met de hand gebalanceerd voor dagelijks gebruik.",
      productType: "Metal",
      priceRange: { minVariantPrice: { amount: "112.00", currencyCode: "EUR" } },
    },
    {
      id: "gid://shopify/Product/8",
      title: "FURO KAARSENHOUDER",
      handle: "furo-kaarsenhouder",
      description: "Geslagen koper met matte afwerking — bestand tegen tijd en licht.",
      productType: "Metal",
      priceRange: { minVariantPrice: { amount: "74.00", currencyCode: "EUR" } },
    },
  ];
}

// Validate environment variables
function validateEnv(): { domain: string; token: string } {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  if (!domain) {
    throw new Error("❌ Missing environment variable: SHOPIFY_STORE_DOMAIN");
  }
  if (!token) {
    throw new Error("❌ Missing environment variable: SHOPIFY_ADMIN_ACCESS_TOKEN");
  }

  console.log("✓ Environment variables found");
  console.log(`  Store: ${domain}`);

  return { domain, token };
}

// GraphQL query to check if product exists
const PRODUCT_EXISTS_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      handle
      status
    }
  }
`;

// GraphQL mutation to create product
const CREATE_PRODUCT_MUTATION = `
  mutation CreateProduct($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        id
        handle
        title
        status
      }
      userErrors {
        field
        message
      }
    }
  }
`;

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string; extensions?: Record<string, unknown> }>;
}

interface ProductExistsData {
  productByHandle: {
    id: string;
    handle: string;
    status: string;
  } | null;
}

interface ProductCreateData {
  productCreate: {
    product: {
      id: string;
      handle: string;
      title: string;
      status: string;
    } | null;
    userErrors: Array<{ field: string[]; message: string }>;
  };
}

// Execute GraphQL query
async function executeGraphQL<T>(
  query: string,
  variables: Record<string, unknown>,
  domain: string,
  token: string
): Promise<T> {
  const response = await fetch(`https://${domain}/admin/api/2025-01/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
  }

  const result: GraphQLResponse<T> = await response.json();

  if (result.errors && result.errors.length > 0) {
    throw new Error(`GraphQL error: ${result.errors.map((e) => e.message).join(", ")}`);
  }

  return result.data as T;
}

// Check if product exists in Shopify
async function productExists(
  handle: string,
  domain: string,
  token: string
): Promise<boolean> {
  try {
    const result = await executeGraphQL<ProductExistsData>(
      PRODUCT_EXISTS_QUERY,
      { handle },
      domain,
      token
    );
    return result.productByHandle !== null;
  } catch (error) {
    console.warn(`⚠️  Could not check if product exists: ${handle}`, error);
    return false;
  }
}

// Create product in Shopify
async function createProduct(
  product: Product,
  domain: string,
  token: string
): Promise<boolean> {
  const input: CreateProductInput = {
    title: product.title,
    handle: product.handle,
    bodyHtml: product.description,
    productType: product.productType,
    status: "DRAFT",
    variants: [
      {
        price: product.priceRange.minVariantPrice.amount,
      },
    ],
    tags: [product.productType, product.handle],
  };

  try {
    const result = await executeGraphQL<ProductCreateData>(
      CREATE_PRODUCT_MUTATION,
      { input },
      domain,
      token
    );

    if (result.productCreate.userErrors && result.productCreate.userErrors.length > 0) {
      console.error(
        `❌ Failed to create ${product.title}:`,
        result.productCreate.userErrors.map((e) => e.message).join(", ")
      );
      return false;
    }

    if (result.productCreate.product) {
      console.log(
        `✓ Created: ${result.productCreate.product.title} (${result.productCreate.product.status})`
      );
      return true;
    }

    return false;
  } catch (error) {
    console.error(`❌ Error creating ${product.title}:`, error);
    return false;
  }
}

// Main execution
async function main() {
  const isDryRun = process.argv.includes("--dry-run");
  const isExecute = process.argv.includes("--execute");

  console.log("\n╔════════════════════════════════════════════════════════╗");
  console.log("║  Shopify Admin API - Create Draft Products Script      ║");
  console.log("╚════════════════════════════════════════════════════════╝\n");

  if (!isDryRun && !isExecute) {
    console.log("📖 Usage:");
    console.log("   npx ts-node scripts/create-shopify-products.ts --dry-run    # Preview what would happen");
    console.log("   npx ts-node scripts/create-shopify-products.ts --execute    # Actually create products\n");
    process.exit(1);
  }

  try {
    // Validate env
    const { domain, token } = validateEnv();

    // Load products
    const products = loadMockProducts();
    console.log(`✓ Loaded ${products.length} products from configuration\n`);

    if (isDryRun) {
      console.log("🔍 DRY RUN MODE - No changes will be made\n");
      console.log("Products to be processed:");
      products.forEach((p) => {
        console.log(`  • ${p.title.padEnd(25)} (${p.handle}) - €${p.priceRange.minVariantPrice.amount}`);
      });
      console.log(
        "\n💡 Note: Script will check if each product exists before creating.\n    Existing products will be skipped.\n"
      );
      console.log('To actually create products, run: npx ts-node scripts/create-shopify-products.ts --execute\n');
      return;
    }

    if (isExecute) {
      console.log("🚀 EXECUTE MODE - Creating products in Shopify...\n");

      let created = 0;
      let skipped = 0;
      let failed = 0;

      for (const product of products) {
        process.stdout.write(`  Checking ${product.title.padEnd(25)} ... `);

        const exists = await productExists(product.handle, domain, token);

        if (exists) {
          console.log("⊘ SKIPPED (already exists)");
          skipped++;
        } else {
          const success = await createProduct(product, domain, token);
          if (success) {
            created++;
          } else {
            failed++;
          }
        }
      }

      console.log("\n╔════════════════════════════════════════════════════════╗");
      console.log("║  Summary                                               ║");
      console.log("╚════════════════════════════════════════════════════════╝");
      console.log(`✓ Created:  ${created}`);
      console.log(`⊘ Skipped:  ${skipped}`);
      console.log(`❌ Failed:  ${failed}`);
      console.log(`Total:     ${products.length}\n`);

      if (failed === 0 && created > 0) {
        console.log("✅ All products created successfully!\n");
      }
    }
  } catch (error) {
    console.error("\n❌ Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
