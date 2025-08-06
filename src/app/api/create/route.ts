import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Get the session to verify user is authenticated
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { name, description, price, phone, image , public_id} = body;

    // Validate required fields
    if (!name || !description || !price || !phone) {
      return NextResponse.json(
        { error: "Missing required fields: name, description, price, phone" },
        { status: 400 }
      );
    }

    // Validate price is a number
    const priceNumber = parseFloat(price);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      return NextResponse.json(
        { error: "Price must be a valid positive number" },
        { status: 400 }
      );
    }
    // Find or create user based on session email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
        throw new Error("User not found");
    }

    // Create the marketplace product
    const product = await prisma.marketplaceProduct.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        price: priceNumber,
        phone: phone.trim(),
        image: image?.trim() || null,
        userId: user.id,
        publicId: public_id 
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          }
        }
      }
    });

    return NextResponse.json(
      { 
        message: "Product created successfully",
        product 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error creating product:", error);
    
    return NextResponse.json(
      { error: "Failed to create product. Please try again." },
      { status: 500 }
    );
  } 
}
