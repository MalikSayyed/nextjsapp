import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { PrismaClient } from "@prisma/client";
import path from "path";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function DELETE(req) {
  try {
    const data = await req.formData();
    console.log("data is: ", data);
    const published = data.get("published");
    const slug = data.get("slug");
    const blogLiveId = data.get("blogLiveId");
    let selectedId = data.get("selectedId");
    selectedId = parseInt(selectedId);
    const previousimage = data.get("previousimage");
    if (!previousimage) {
      return NextResponse.json({ success1: false });
    }

    const previousImagePath = `./public/${previousimage}`;

    if (fs.existsSync(previousImagePath)) {
      // Delete the file
      fs.unlinkSync(previousImagePath);
      console.log("File deleted successfully");
    } else {
      console.log("File does not exist");
    }

    if (published === "Y") {
      await prisma.bloglive.delete({
        where: { id: selectedId },
      });
    } else if (
      blogLiveId === undefined ||
      blogLiveId === null ||
      blogLiveId === "null" ||
      blogLiveId === ""
    ) {
      await prisma.blog.delete({
        where: { id: selectedId },
      });
    } else {
      const modifiedSlug = slug;
      const parts = modifiedSlug.split("-");

      if (parts[parts.length - 1] === "00000") {
        parts.pop();
      }

      const originalSlug = parts.join("-");

      const filenameParts = previousimage.split(".");
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

      await prisma.blog.delete({
        where: { id: selectedId },
      });
      await prisma.bloglive.delete({
        where: { id: parseInt(blogLiveId) },
      });
    }

    return NextResponse.json(
      { result: "blog deleted successfully" },
      { status: 200 }
    );

    // Respond with success message
  } catch (error) {
    console.error("Error during blog delete:", error);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}
