import Papa from "papaparse";
import { MenuItem } from "./types";

export async function fetchMenuFromGoogleSheet(sheetUrl: string): Promise<MenuItem[]> {
  try {
    const res = await fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQdPLFc73XvKGEZUYTGjJto0nfXBrt85rIDILZr1lil_-vr_RM_mFg5OgSpyRirX3zVKhNNOs8yy_AH/pub?output=csv&gid=1087523456",
      { cache: "no-store" }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch CSV: ${res.statusText}`);
    }

    const csv = await res.text();
    const { data } = Papa.parse(csv, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
    });

    const parsed = (data as any[]).map((item) => ({
      id: item.id ? String(item.id).trim() : '',
      name: item.name ? String(item.name).trim() : '',
      description: item.description ? String(item.description).trim() : '',
      price: item.price !== undefined && item.price !== null ? Number(item.price) : NaN,
      category: item.category ? String(item.category).trim() : '',
      type: item.type ? String(item.type).trim() : '',
      image: item.image ? String(item.image).trim() : '',
      longDescription: item.longDescription ? String(item.longDescription).trim() : '',
      language: item.language ? String(item.language).trim() : 'Marathi',
    }));

    const validItems = parsed.filter((it) => {
      return (
        it.id !== '' &&
        it.name !== '' &&
        it.category !== '' &&
        !Number.isNaN(it.price) &&
        it.type !== '' &&
        (it.type === 'veg' || it.type === 'non-veg')
      );
    }) as MenuItem[];

    return validItems;
  } catch (error) {
    console.error('Error fetching menu data:', error);
    return [];
  }
}