import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req, res) {
  try {
    const body = await req.json();
    let { employeeId } = body;

    employeeId = parseInt(employeeId);

    const blogs = await prisma.$queryRaw`
    SELECT *
    FROM (
      SELECT
        b.id,
        b.title,
        b.description,
        b.content,
        b.image,
        b.slug,
        b.published,
        b.delete_request,
        b.author_id,
        b.bloglive_id
      FROM public."Blog" b
      WHERE b.author_id = ${employeeId}
    
      UNION ALL
    
      SELECT
        bl.id,
        bl.title,
        bl.description,
        bl.content,
        bl.image,
        bl.slug,
        bl.published,
        bl.delete_request,
        bl.author_id,
        null
      FROM public."Bloglive" bl
      LEFT JOIN public."Blog" b ON bl.id = b.bloglive_id
      WHERE bl.author_id = ${employeeId} and b.bloglive_id IS NULL
    ) AS combined
    ORDER BY title;
    `;

    return NextResponse.json({ result: blogs }, { status: 200 });
  } catch (error) {
    console.error("Error during blog fetching:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}
