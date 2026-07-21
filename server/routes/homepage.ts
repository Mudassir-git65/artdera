import { Router } from "express";
import { ArtworkModel, StoreModel } from "../models";
import { asyncRoute, ok } from "../lib/http";

export const homepageRouter = Router();

homepageRouter.get(
  "/",
  asyncRoute(async (_req, res) => {
    const artworks = await ArtworkModel.find({
      status: "published",
      moderationStatus: "approved",
    })
      .select(
        "storeId slug title description category medium yearCreated artworkType editionTotal price discountPrice width height measurementUnit isFramed colours images isSponsored createdAt",
      )
      .sort({ isSponsored: -1, createdAt: -1 })
      .limit(8)
      .lean();
    const storeIds = [...new Set(artworks.map((artwork) => String(artwork.storeId)))];
    const stores = await StoreModel.find({ _id: { $in: storeIds }, isPublished: true })
      .select("slug name tagline shortDescription logoUrl city country verificationStatus")
      .lean();
    const storeMap = new Map(stores.map((store) => [String(store._id), store]));
    const products = artworks.map((artwork) => {
      const store = storeMap.get(String(artwork.storeId));
      return {
        slug: artwork.slug,
        title: artwork.title,
        creatorSlug: store?.slug ?? "artdera-creator",
        categorySlug: String(artwork.category)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-"),
        price: artwork.discountPrice ?? artwork.price,
        currency: "PKR",
        kind:
          artwork.artworkType === "limited_edition"
            ? "Limited Edition"
            : artwork.artworkType === "print"
              ? "Open Edition"
              : "Original",
        editionOf: artwork.editionTotal,
        medium: artwork.medium,
        dimensions:
          artwork.width && artwork.height
            ? `${artwork.width} × ${artwork.height} ${artwork.measurementUnit ?? "cm"}`
            : "Dimensions available on request",
        year: artwork.yearCreated ?? new Date().getFullYear(),
        framed: Boolean(artwork.isFramed),
        colours: artwork.colours ?? [],
        room: [],
        description: artwork.description ?? "",
        images: artwork.images.slice(0, 1).map((image: { url: string }) => image.url),
        featured: Boolean(artwork.isSponsored),
        new: true,
      };
    });
    const creators = stores.map((store) => ({
      slug: store.slug,
      name: store.name,
      handle: `@${store.slug}`,
      location: [store.city, store.country].filter(Boolean).join(", ") || "Pakistan",
      discipline: store.tagline || "Independent creator",
      bio: store.shortDescription || "Discover this creator's current work on ArtDera.",
      verified: store.verificationStatus === "approved",
      portrait: store.logoUrl ?? "",
      works: products
        .filter((product) => product.creatorSlug === store.slug)
        .map((product) => product.slug),
    }));
    res.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=86400");
    return ok(res, {
      products,
      creators,
      collections: products.length
        ? [
            {
              slug: "the-artdera-edit",
              name: "The ArtDera Edit",
              blurb: "A concise edit of recently published work.",
              products: products.slice(0, 4).map((product) => product.slug),
              cover: products[0].images[0],
            },
          ]
        : [],
    });
  }),
);
