import { rest } from "msw";
import { BlogPost, ListResponse } from "../types";
import { v4 as uuidv4 } from "uuid";
import { blogPostBuilder } from "./BlogPostBuilder";

let items: BlogPost[] = Array(50)
  .fill(undefined)
  .map(() => blogPostBuilder());

const PAGE_SIZE = 20;

export const handlers = [
  rest.get("/api/posts", (req, res, ctx) => {
    const page = req.url.searchParams.get("page")
      ? Number.parseInt(req.url.searchParams.get("page") ?? "1")
      : 1;

    const listResponse: ListResponse<BlogPost> = {
      page,
      per_page: PAGE_SIZE,
      total: items.length,
      total_pages: Math.ceil(items.length / PAGE_SIZE),
      data: items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    };

    return res(ctx.json(listResponse));
  }),
  rest.post("/api/posts", (req, res, ctx) => {
    const { title, text } = req.body as { title: string; text: string };
    items.push({ id: uuidv4(), title, text });

    return res(ctx.json({ data: items }));
  }),
  rest.put("/api/posts/:id", (req, res, ctx) => {
    const { id } = req.params;
    const { title, text } = req.body as { title: string; text: string };

    const updatedItem = { id, title, text };

    items = items.map((i) => {
      if (i.id === id) {
        return updatedItem;
      }

      return i;
    });

    return res(ctx.json({ data: updatedItem }));
  }),
  rest.delete("/api/posts/:id", (req, res, ctx) => {
    const { id } = req.params;

    items = items.filter((i) => i.id !== id);

    return res(ctx.json({ success: true, id }));
  }),
];
