import CollectionClient from "@/components/CollectionClient";
import { getProducts } from "@/lib/shopify";

export const revalidate = 60;

export default async function CollectiePage() {
  const products = await getProducts(30);
  return <CollectionClient products={products} />;
}
