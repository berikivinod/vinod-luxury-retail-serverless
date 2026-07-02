import type { NextApiRequest, NextApiResponse } from "next";
import stores from "@/data/stores.json";
import type { Store } from "@/types/store";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req.query;

  if (!query) {
    return res.status(200).json(stores);
  }

  const q = (query as string).toLowerCase();

  const filtered = stores.filter(
  (s: Store) =>
    s.city.toLowerCase().includes(q) ||
    s.state.toLowerCase().includes(q) ||
    s.zip.includes(q)
);

  return res.status(200).json(filtered);
}