import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req, res) {
  try {
    const blogs = await prisma.bloglive.findMany({ where: { published: "Y" } });

    return NextResponse.json({ result: blogs }, { status: 200 });
  } catch (error) {
    console.error("Error during getting blogs data:", error);
    return NextResponse.json(
      { error: "Failed to get blogs data" },
      { status: 500 }
    );
  }
}
