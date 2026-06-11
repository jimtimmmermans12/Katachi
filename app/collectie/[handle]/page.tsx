import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import { getProductByHandle } from "@/lib/shopify";
import { shopifyImg } from "@/lib/img";

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
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
