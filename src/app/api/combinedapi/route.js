import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import md5 from "md5";
import fs, { writeFile } from "fs";
import path from "path";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function POST(req, res) {
  const body = await req.json();
  const { apiName } = body;
  if (apiName === "addemployee") {
    try {
      const { username, email, password } = body;

      const hashedPassword = md5(password);

      await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          userRole: "employee",
        },
      });

      return NextResponse.json(
        { result: "successfully created employee" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error during employee creation:", error);
      return NextResponse.json(
        { error: "Failed to add employee" },
        { status: 500 }
      );
    }
  } else if (apiName === "blockemployee") {
    try {
      const { selectedId } = body;

      await prisma.user.update({
        where: { id: selectedId },
        data: {
          blocked: "Y",
        },
      });

      return NextResponse.json(
        { result: "successfully blocked employee" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error during blocking employee:", error);
      return NextResponse.json(
        { error: "Failed to block employee" },
        { status: 500 }
      );
    }
  } else if (apiName === "unapproveblog") {
    try {
      const { selectedId } = body;

      const blog = await prisma.blog.findUnique({ where: { id: selectedId } });

      const filenameParts = blog.image.split(".");
      const fileExtension = filenameParts[filenameParts.length - 1];

      const filePath = path.join(
        process.cwd(),
        "public",
        "blog_images",
        `${blog.slug}.${fileExtension}`
      );

      // Delete the file
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          return;
        }
        console.log("File deleted successfully");
      });

      await prisma.blog.delete({ where: { id: selectedId } });

      return NextResponse.json(
        { result: "successfully unapproved blog" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error during unapproving blog:", error);
      return NextResponse.json(
        { error: "Failed to unapprove blog" },
        { status: 500 }
      );
    }
  } else if (apiName === "updateemployee") {
    try {
      const { selectedId, username, email, password } = body;

      if (username !== "") {
        await prisma.user.update({
          where: { id: selectedId },
          data: {
            username,
          },
        });
      }

      if (email !== "") {
        await prisma.user.update({
          where: { id: selectedId },
          data: {
            email,
          },
        });
      }

      if (password !== "") {
        const hashedPassword = md5(password);

        await prisma.user.update({
          where: { id: selectedId },
          data: {
            password: hashedPassword,
          },
        });
      }

      return NextResponse.json(
        { result: "successfully updated employee" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error during employee updation:", error);
      return NextResponse.json(
        { error: "Failed to update employee" },
        { status: 500 }
      );
    }
  } else if (apiName === "requestfordelete") {
    try {
      const { selectedId, published, blogLiveId } = body;

      if (published === "Y") {
        await prisma.bloglive.update({
          where: { id: selectedId },
          data: {
            delete_request: "Y",
          },
        });
      } else if (
        blogLiveId === undefined ||
        blogLiveId === null ||
        blogLiveId === "null" ||
        blogLiveId === ""
      ) {
        await prisma.blog.update({
          where: { id: selectedId },
          data: {
            delete_request: "Y",
          },
        });
      } else {
        await prisma.blog.update({
          where: { id: selectedId },
          data: {
            delete_request: "Y",
          },
        });
        await prisma.bloglive.update({
          where: { id: blogLiveId },
          data: {
            delete_request: "Y",
          },
        });
      }

      return NextResponse.json(
        { result: "successfully requested blog for delete" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error during blog delete request:", error);
      return NextResponse.json(
        { error: "Failed to request blog for delete" },
        { status: 500 }
      );
    }
  } else if (apiName === "canceldeleterequest") {
    try {
      const { selectedId, published, blogLiveId } = body;

      if (published === "Y") {
        await prisma.bloglive.update({
          where: { id: selectedId },
          data: {
            delete_request: "N",
          },
        });
      } else if (
        blogLiveId === undefined ||
        blogLiveId === null ||
        blogLiveId === "null" ||
        blogLiveId === ""
      ) {
        await prisma.blog.update({
          where: { id: selectedId },
          data: {
            delete_request: "N",
          },
        });
      } else {
        await prisma.blog.update({
          where: { id: selectedId },
          data: {
            delete_request: "N",
          },
        });
        await prisma.bloglive.update({
          where: { id: blogLiveId },
          data: {
            delete_request: "N",
          },
        });
      }

      return NextResponse.json(
        { result: "successfully cancelled delete request" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error during cancelling delete request:", error);
      return NextResponse.json(
        { error: "Failed to cancel delete request" },
        { status: 500 }
      );
    }
  } else if (apiName === "approveblog") {
    try {
      const { selectedId } = body;

      const blog = await prisma.blog.findUnique({
        where: { id: selectedId },
      });

      if (blog.bloglive_id === null) {
        await prisma.bloglive.create({
          data: {
            title: blog.title,
            description: blog.description,
            content: blog.content,
            image: blog.image,
            slug: blog.slug,
            published: "Y",
            delete_request: blog.delete_request,
            author_id: blog.author_id,
          },
        });

        await prisma.blog.delete({ where: { id: blog.id } });
      } else {
        const modifiedSlug = blog.slug;
        const parts = modifiedSlug.split("-");

        if (parts[parts.length - 1] === "00000") {
          parts.pop();
        }

        const originalSlug = parts.join("-");

        const filenameParts = blog.image.split(".");
        const fileExtension = filenameParts[filenameParts.length - 1];

        const filePath = path.join(
          process.cwd(),
          "public",
          "blog_images",
          `${originalSlug}.${fileExtension}`
        );

        // Delete the file
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
            return;
          }
          console.log("File deleted successfully");
        });

        const oldSlug = `${originalSlug}-00000`;
        const newSlug = originalSlug;

        const oldPath = path.join(
          process.cwd(),
          "public",
          "blog_images",
          `${oldSlug}.${fileExtension}`
        );
        const newPath = path.join(
          process.cwd(),
          "public",
          "blog_images",
          `${newSlug}.${fileExtension}`
        );

        fs.rename(oldPath, newPath, (err) => {
          if (err) {
            console.error("Error renaming file:", err);
            return;
          }
          console.log("File renamed successfully");
        });

        await prisma.bloglive.update({
          where: { id: blog.bloglive_id },
          data: {
            title: blog.title,
            description: blog.description,
            content: blog.content,
            published: "Y",
            delete_request: blog.delete_request,
            author_id: blog.author_id,
          },
        });
        await prisma.blog.delete({ where: { id: blog.id } });
      }

      return NextResponse.json(
        { result: "successfully approved blog" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error during approving blog:", error);
      return NextResponse.json(
        { error: error.message || error.toString() },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ error: "Invalid API name" }, { status: 400 });
}
