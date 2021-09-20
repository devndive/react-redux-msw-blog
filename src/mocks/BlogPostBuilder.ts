import { build, fake } from "@jackfranklin/test-data-bot";
import { v4 as uuidv4 } from "uuid";
import { BlogPost } from "../types";

const blogPostBuilder = build<BlogPost>("BlogPost", {
  fields: {
    id: fake(() => uuidv4()),
    title: fake((f) => f.lorem.words()),
    text: fake((f) => f.lorem.paragraphs()),
  },
});

export { blogPostBuilder };
