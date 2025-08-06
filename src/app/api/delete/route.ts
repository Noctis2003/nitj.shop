import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
export async function DELETE(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized - Please sign in" }, { status: 401 });
    }

    // Get product ID from request body
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find the product and verify ownership
    const product = await prisma.marketplaceProduct.findUnique({
      where: { id: productId },
      include: { user: true }
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if the user owns this product
    if (product.userId !== user.id) {
      return NextResponse.json({ error: "You can only delete your own products" }, { status: 403 });
    }

    const result = await cloudinary.uploader.destroy(product.publicId);
    console.log("Cloudinary delete result:", result);

    // Delete the product
    await prisma.marketplaceProduct.delete({
      where: { id: productId }
    });

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  } 
}
