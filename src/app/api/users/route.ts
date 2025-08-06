import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
// moonlight drive
// Run like hell
// src/api/users/route.ts
export async function GET() {
  try {
    // Check if user is authenticated
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized - Please sign in" }, { status: 401 });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch products created by this user
    const userProducts = await prisma.marketplaceProduct.findMany({
      where: {
        userId: user.id
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(userProducts);
  } catch (error) {
    console.error("Error fetching user products:", error);
    return NextResponse.json({ error: "Failed to fetch user products" }, { status: 500 });
  } 
}
