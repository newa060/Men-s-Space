export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  sortOrder: number;
}

export function formatGalleryItem(row: {
  id: string;
  title: string;
  image_url: string;
  sort_order: number;
}): GalleryItem {
  return {
    id: row.id,
    title: row.title,
    image: row.image_url,
    sortOrder: row.sort_order,
  };
}
