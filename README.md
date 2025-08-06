# OLX Clone - A Full-Stack Marketplace Application


This is a full-stack marketplace application built with Next.js, TypeScript, and Tailwind CSS. It allows users to buy and sell products, with features like Google authentication, product creation with image uploads, and a user profile page to manage listings.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js with Google Provider
- **Database**: MongoDB with Prisma ORM
- **Image Hosting**: Cloudinary for image storage and delivery
- **Form Management**: React Hook Form with Zod for validation
- **API**: Next.js API Routes

## Features

- **User Authentication**: Secure sign-in with Google using NextAuth.js.
- **Product Marketplace**: Browse all available products.
- **Search Functionality**: Filter products by name or description.
- **Sell Products**: A dedicated form to create new product listings.
- **Image Uploads**: Compress and upload product images to Cloudinary.
- **User Profile**: View and manage your own product listings.
- **Delete Products**: Users can delete their own products.
- **Responsive Design**: The application is fully responsive and works on all screen sizes.

## API Endpoints

The application uses Next.js API routes to handle backend logic.

- `POST /api/auth/[...nextauth]`: Handles Google OAuth authentication.
- `POST /api/create`: Creates a new product listing. Requires authentication.
- `DELETE /api/delete`: Deletes a user's product. Requires authentication.
- `GET /api/get`: Fetches all products for the marketplace. Requires authentication.
- `GET /api/users`: Fetches all products for the currently logged-in user. Requires authentication.
- `POST /api/cloudinary`: Generates a signature for client-side image uploads to Cloudinary.

## Database Schema

The `schema.prisma` file defines the database models for MongoDB.

### `User` Model
- `id`: String (ObjectID)
- `username`: String
- `email`: String (unique)
- `createdAt`: DateTime
- `marketplaceProducts`: Relation to `MarketplaceProduct` model

### `MarketplaceProduct` Model
- `id`: String (ObjectID)
- `name`: String
- `description`: String
- `price`: Float
- `phone`: String
- `image`: String (optional)
- `createdAt`: DateTime
- `publicId`: String (unique, for Cloudinary)
- `userId`: String (ObjectID, relation to `User`)
- `user`: Relation to `User` model

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- A MongoDB Atlas account
- A Cloudinary account

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/your_username/olx-clone.git
    cd olx-clone
    ```

2.  **Install NPM packages**
    ```sh
    npm install
    ```

3.  **Set up environment variables**

    Create a `.env` file in the root of your project and add the following variables:

    ```env
    # Prisma
    DATABASE_URL="your_mongodb_connection_string"

    # NextAuth
    GOOGLE_CLIENT_ID="your_google_client_id"
    GOOGLE_CLIENT_SECRET="your_google_client_secret"
    NEXTAUTH_SECRET="a_random_secret_string"
    NEXTAUTH_URL="http://localhost:3000"

    # Cloudinary
    CLOUDINARY_CLOUD_NAME="your_cloudinary_cloud_name"
    CLOUDINARY_API_KEY="your_cloudinary_api_key"
    CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
    ```

4.  **Push the Prisma schema to the database**
    ```sh
    npx prisma db push
    ```

5.  **Run the development server**
    ```sh
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
