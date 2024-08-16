import { NextRequest, NextResponse } from "next/server";
import fs, { writeFile } from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req) {
  try {
    const data = await req.formData();
    const image = data.get("image");
    const title = data.get("title");
    const description = data.get("description");
    const content = data.get("content");
    const published = data.get("published");
    const author_id = data.get("author_id");
    const blogLiveId = data.get("blogLiveId");
    let selectedId = data.get("selectedId");
    selectedId = parseInt(selectedId);
    const previousimage = data.get("previousimage");
    if (!image) {
      return NextResponse.json({ success1: false });
    }

    let slug = title
      .toLowerCase() // Convert the title to lowercase
      .replace(/[^\w\s-]/g, "") // Remove non-word characters (excluding spaces and dashes)
      .trim() // Trim leading and trailing spaces
      .replace(/\s+/g, "-") // Replace spaces with dashes
      .replace(/-+/g, "-");

    if (
      (blogLiveId !== undefined &&
        blogLiveId !== null &&
        blogLiveId !== "null" &&
        blogLiveId !== "") ||
      published === "Y"
    ) {
      slug = `${slug}-00000`;
    }

    if (published === "Y") {
      await prisma.bloglive.update({
        where: { id: selectedId },
        data: {
          author_id: parseInt(author_id),
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
          author_id: parseInt(author_id),
        },
      });
    } else {
      await prisma.blog.update({
        where: { id: selectedId },
        data: {
          author_id: parseInt(author_id),
        },
      });
      await prisma.bloglive.update({
        where: { id: parseInt(blogLiveId) },
        data: {
          author_id: parseInt(author_id),
        },
      });
    }

    if (published === "Y" && typeof image === "string") {
      const blog1 = await prisma.bloglive.findUnique({
        where: { id: selectedId },
      });
      if (
        blog1.title === title &&
        blog1.description === description &&
        blog1.content === content
      ) {
        return NextResponse.json(
          {
            result: "blog updated successfully, only author need to be updated",
          },
          { status: 200 }
        );
      }
    }

    if (typeof image === "object") {
      const filenameParts = image.name.split(".");
      const fileExtension = filenameParts[filenameParts.length - 1];

      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const path = `./public/blog_images/${slug}.${fileExtension}`;
      await new Promise((resolve, reject) => {
        fs.writeFile(path, buffer, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }

    if (typeof image === "string") {
      const previousImagePath = `./public/${previousimage}`;

      const fileExtension = path.extname(previousImagePath);

      const trimmedExtension = fileExtension.replace(".", "");

      const modifiedSlug = slug;
      const parts = modifiedSlug.split("-");

      if (parts[parts.length - 1] === "00000") {
        parts.pop();
      }

      const originalSlug = parts.join("-");

      const newPath = `./public/blog_images/${originalSlug}.${trimmedExtension}`;

      if (fs.existsSync(previousImagePath)) {
        fs.renameSync(previousImagePath, newPath); // Rename the previous image file
      }

      const newImagePath = `/blog_images/${slug}.${trimmedExtension}`;

      if (published === "Y") {
        await prisma.blog.create({
          data: {
            title,
            description,
            content,
            slug,
            image: newImagePath,
            published: "N",
            author_id: parseInt(author_id),
            bloglive_id: selectedId,
          },
        });
      } else {
        await prisma.blog.update({
          where: { id: selectedId },
          data: {
            title,
            description,
            content,
            slug,
            image: newImagePath,
            published: "N",
            author_id: parseInt(author_id),
          },
        });
      }

      return NextResponse.json(
        { result: "blog updated successfully" },
        { status: 200 }
      );
    }

    if (typeof image === "object") {
      const filenameParts = image.name.split(".");
      const fileExtension = filenameParts[filenameParts.length - 1];

      const imagePath = `/blog_images/${slug}.${fileExtension}`;

      if (published === "Y") {
        await prisma.blog.create({
          data: {
            title,
            description,
            content,
            slug,
            image: imagePath,
            published: "N",
            author_id: parseInt(author_id),
            bloglive_id: selectedId,
          },
        });
      } else {
        await prisma.blog.update({
          where: { id: selectedId },
          data: {
            title,
            description,
            content,
            slug,
            image: imagePath,
            published: "N",
            author_id: parseInt(author_id),
          },
        });
      }

      return NextResponse.json(
        { result: "blog updated successfully" },
        { status: 200 }
      );
    }
    // Respond with success message
  } catch (error) {
    console.error("Error during blog addition:", error);
    return NextResponse.json(
      { success1: false, error: "Failed to add blog" },
      { status: 500 }
    );
  }
}
