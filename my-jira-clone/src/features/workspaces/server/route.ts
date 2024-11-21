import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { ID, Query } from "node-appwrite"

import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  MEMBERS_ID,
  WORKSPACE_ID,
} from "@/config"
import { MemberRoles } from "@/features/members/types"
import { getMember } from "@/features/members/util"
import { sessionMiddleware } from "@/lib/sessionMiddleware"
import { generateInvitateCode } from "@/lib/utils"

import { createWorkspacesSchema, updateWorkspaceSchema } from "../schemas"

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user")
    const databases = c.get("databases")

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userid", user.$id),
    ])

    if (members.total === 0) {
      return c.json({ data: { documents: [], total: 0 } })
    }

    const worspacesIds = members.documents.map((member) => member.workspaceid)

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACE_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", worspacesIds)],
    )

    return c.json({ data: workspaces })
  })
  .post(
    "/",
    zValidator("form", createWorkspacesSchema),
    sessionMiddleware,
    async (c) => {
      const database = c.get("databases")
      const storage = c.get("storage")
      const user = c.get("user")

      const { name, image } = c.req.valid("form")

      let uploadedImageUrl: string | undefined

      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image,
        )

        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id,
        )

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`
      }

      const workspace = await database.createDocument(
        DATABASE_ID,
        WORKSPACE_ID,
        ID.unique(),
        {
          name,
          userid: user.$id,
          imageUrl: uploadedImageUrl,
          inviteCode: generateInvitateCode(6),
        },
      )

      await database.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        userid: user.$id,
        workspaceid: workspace.$id,
        role: MemberRoles.ADMIN,
      })

      return c.json({ data: workspace })
    },
  )
  .patch(
    "/:workspaceId",
    sessionMiddleware,
    zValidator("form", updateWorkspaceSchema),
    async (c) => {
      const databases = c.get("databases")
      const storage = c.get("storage")
      const user = c.get("user")

      const { workspaceId } = c.req.param()
      const { name, image } = c.req.valid("form")

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      })

      if (!member || member.role !== MemberRoles.ADMIN) {
        return c.json({ error: "Unauthorized" }, 401)
      }

      let uploadedImageUrl: string | undefined

      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image,
        )

        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id,
        )

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`
      } else {
        uploadedImageUrl = image
      }

      const workspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACE_ID,
        workspaceId,
        {
          name,
          imageUrl: uploadedImageUrl,
        },
      )

      return c.json({
        data: workspace,
      })
    },
  )

export default app
