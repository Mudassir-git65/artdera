import {
  CATEGORIES,
  COLLECTIONS,
  CREATORS,
  PRODUCTS,
  hydrateEditorialData,
  normalizeEditorialImage,
  type Creator,
  type EditorialCollection,
  type Product,
} from "./artdera";

type HomepagePayload = {
  products: Product[];
  creators: Creator[];
  collections: EditorialCollection[];
};

let homepagePromise: Promise<boolean> | undefined;

export function refreshHomepageCatalog() {
  if (homepagePromise) return homepagePromise;
  homepagePromise = fetch("/api/homepage", { credentials: "omit" })
    .then(async (response) => {
      if (!response.ok) return false;
      const body = (await response.json()) as { success?: boolean; data?: HomepagePayload };
      if (!body.success || !body.data || body.data.products.length < 4) return false;
      const products = body.data.products.slice(0, 8).map((product, index) => ({
        ...product,
        room: product.room.length
          ? product.room
          : ["Living room", "Bedroom", "Office", "Dining room", "Restaurant", "Hotel"],
        images: [normalizeEditorialImage(product.images[0], index)],
      }));
      const creators = body.data.creators.map((creator, index) => ({
        ...creator,
        portrait: normalizeEditorialImage(creator.portrait, index, "creator"),
      }));
      hydrateEditorialData({
        categories: [...CATEGORIES],
        products,
        creators: creators.length ? creators : [...CREATORS],
        collections: body.data.collections.length ? body.data.collections : [...COLLECTIONS],
      });
      return true;
    })
    .catch(() => false)
    .finally(() => {
      homepagePromise = undefined;
    });
  return homepagePromise;
}

export function subscribeToNewsletter(email: string, source = "homepage") {
  return fetch("/api/newsletter", {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, source }),
  }).then(async (response) => {
    const body = (await response.json()) as {
      success?: boolean;
      error?: { message?: string };
    };
    if (!response.ok || !body.success) {
      throw new Error(body.error?.message ?? "The newsletter request could not be completed");
    }
  });
}
