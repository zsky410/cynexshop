import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { Product, ProductOffering, ProductPackage } from "../types";

const parseNumber = (value: unknown): number | null => {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  }
  return null;
};

const normalizePackages = (value: unknown): ProductPackage[] => {
  if (!value || !Array.isArray(value)) return [];

  return value.reduce<ProductPackage[]>((acc, pkg) => {
    if (typeof pkg !== "object" || pkg === null) return acc;

    const record = pkg as Record<string, unknown>;
    const duration =
      typeof record.duration === "string" ? (record.duration as string) : "";
    const price = parseNumber(record.price);
    const originalPrice = parseNumber(record.originalPrice);

    if (duration === "" && price === null) {
      return acc;
    }

    const normalized: ProductPackage = {
      duration,
      price: price ?? 0,
    };

    if (originalPrice !== null && originalPrice !== undefined) {
      normalized.originalPrice = originalPrice;
    }

    acc.push(normalized);
    return acc;
  }, []);
};

const normalizeOfferings = (value: unknown): ProductOffering[] => {
  if (!value || !Array.isArray(value)) return [];

  return value.reduce<ProductOffering[]>((acc, offering) => {
    if (typeof offering !== "object" || offering === null) return acc;

    const record = offering as Record<string, unknown>;
    const packages = normalizePackages(record.packages);

    if (packages.length === 0) return acc;

    const normalized: ProductOffering = {
      packages,
    };

    if (typeof record.id === "string") normalized.id = record.id as string;
    if (typeof record.type === "string")
      normalized.type = record.type as string;
    if (typeof record.label === "string")
      normalized.label = record.label as string;
    if (typeof record.description === "string")
      normalized.description = record.description as string;

    acc.push(normalized);
    return acc;
  }, []);
};

const mergeOfferingsToOptions = (
  offerings: ProductOffering[]
): ProductPackage[] => {
  const firstOffering = offerings.find(
    (offering) => offering.packages.length > 0
  );
  return firstOffering ? firstOffering.packages : [];
};

const mapRowToProduct = (row: Record<string, unknown>): Product => {
  const offerings = normalizeOfferings(row.offerings);

  const firstPackage = mergeOfferingsToOptions(offerings)[0];

  const basePrice =
    parseNumber(row.base_price) ??
    parseNumber(row.price) ??
    firstPackage?.price ??
    null;
  const baseOriginalPrice =
    parseNumber(row.base_original_price) ??
    parseNumber(row.original_price) ??
    firstPackage?.originalPrice ??
    null;

  return {
    id: String(row.id ?? ""),
    slug: (row.slug as string) ?? null,
    name: (row.name as string) ?? "",
    category: (row.category as string) ?? null,
    image: (row.image_url as string) ?? (row.image as string) ?? null,
    image_url: (row.image_url as string) ?? null,
    price: basePrice,
    basePrice,
    originalPrice: baseOriginalPrice ?? undefined,
    baseOriginalPrice,
    discountPercentage: parseNumber(row.discount_percentage),
    isBestSeller: Boolean(row.is_best_seller ?? row.isBestSeller ?? false),
    isNew: Boolean(row.is_new ?? row.isNew ?? false),
    status: (row.status as "inStock" | "outOfStock" | null) ?? null,
    warranty: (row.warranty as string) ?? null,
    upgradeMethod: (row.upgrade_method as string) ?? null,
    likes: parseNumber(row.likes),
    sold: parseNumber(row.sold),
    fulfillmentType: (row.fulfillment_type as string) ?? null,
    descriptionMarkdown:
      (row.description_markdown as string) ??
      (row.description as string) ??
      null,
    description: (row.description as string) ?? null,
    offerings,
  };
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (!isMounted) return;

        setProducts(
          (data ?? []).map((row) =>
            mapRowToProduct(row as Record<string, unknown>)
          )
        );
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const derived = useMemo(() => {
    if (products.length === 0) {
      return {
        products,
        newProducts: [] as Product[],
        bestSellerProducts: [] as Product[],
      };
    }

    const newProducts = products.filter((product) => product.isNew);
    const bestSellerProducts = products.filter((product) => product.isBestSeller);

    return { products, newProducts, bestSellerProducts };
  }, [products]);

  return { ...derived, loading, error } as const;
};

export const useProductById = (id?: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setProduct(null);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const loadProduct = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (error) throw error;

        if (!isMounted) return;

        setProduct(
          data ? mapRowToProduct(data as Record<string, unknown>) : null
        );
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { product, loading, error } as const;
};
