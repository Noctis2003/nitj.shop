import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Check if user is authenticated
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized - Please sign in" }, { status: 401 });
    }

    const products = await prisma.marketplaceProduct.findMany({
      include: {
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
