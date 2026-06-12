import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import { getProductByHandle, getProducts } from "@/lib/shopify";
import { shopifyImg } from "@/lib/img";

export const revalidate = 60;

type Props = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    return { title: "Product not found — KATACHI" };
  }

  const description =
    product.description.length > 160
      ? `${product.description.slice(0, 157)}...`
      : product.description;

  return {
    title: `${product.title} — KATACHI`,
    description,
    openGraph: {
      title: `${product.title} — KATACHI`,
      description,
      type: "website",
      images: product.featuredImage?.url
        ? [{ url: shopifyImg(product.featuredImage.url, 1200) }]
        : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const [product, allProducts] = await Promise.all([
    getProductByHandle(handle),
    getProducts(12).catch(() => []),
  ]);

  if (!product) {
    notFound();
  }

  const related = allProducts.filter((p) => p.handle !== handle).slice(0, 2);

  return <ProductDetail product={product} related={related} />;
}
