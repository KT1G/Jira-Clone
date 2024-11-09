import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID } from "node-appwrite";

import { DATABASE_ID, WORKSPACE_ID } from "@/config";
import { sessionMiddleware } from "@/lib/sessionMiddleware";

import { createWorkspacesSchema } from "../schemas";

const app = new Hono()
  .post(
    "/",
    zValidator("json", createWorkspacesSchema),
    sessionMiddleware,
    async (c) => {
      const database = c.get("databases")
      const user = c.get("user")

      const { name } = c.req.valid("json")

      const workspace = await database.createDocument(
        DATABASE_ID,
        WORKSPACE_ID,
        ID.unique(),
        {
          name,
          userid: user.$id
        }
      )
      return c.json({ data: workspace })
    }
  )

export default app