import HomeClient from "@/components/HomeClient";
import { getProducts } from "@/lib/shopify";

export const revalidate = 60;

export default async function Home() {
  const products = await getProducts(3);
  return <HomeClient products={products} />;
}
