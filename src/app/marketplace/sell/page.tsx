"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
const formSchema = z.object({
  productName: z.string().min(1, "Product name is required").max(20, "Product name must be less than 20 characters"),
  productDescription: z.string().min(1, "Description is required").max(200, "Description must be less than 200 characters"),
  productPrice: z.string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Price must be a valid positive number"),
  productImage: z.instanceof(File),
  productPhone: z
    .string()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits")
});

type FormData = z.infer<typeof formSchema>;

export default function ProductForm() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });
  
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
        <p className="text-white">Please sign in to register a product.</p>
      </div>
    );
  }

  const uploadToCloudinary = async (file: File) => {
    try {
      const formData = new FormData();

      // Get signature from your API
      const sign = await fetch('/api/cloudinary', {
        method: "POST",
        body: JSON.stringify({
          folder: "your_folder_name",
          public_id: uuidv4()
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      const { signature, timestamp, apiKey, cloudName, public_id } = await sign.json();
      console.log(signature, timestamp, apiKey, cloudName, public_id);

      // Compress image before upload
      const options = {
        maxSizeMB: 0.3, // Max size in MB
        maxWidthOrHeight: 1024, // Optional: resize
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);
      console.log("Compressed file size:", compressedFile.size / 1024 / 1024, "MB");

      // Prepare form data for Cloudinary
      formData.append("file", compressedFile);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('public_id', public_id);

      // Upload to Cloudinary
      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error("Failed to upload image");
      }

      console.log(data.secure_url);
      return {
        imageUrl: data.secure_url,
        public_id
      };
    } catch (error) {
      console.log("Error uploading to Cloudinary:", error);
      throw error;
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Upload image to Cloudinary
      const res = await uploadToCloudinary(data.productImage);
      const { imageUrl, public_id } = res;

      console.log("Image uploaded successfully:", imageUrl);
      console.log("public_id", public_id);
   
      // Prepare data for API
      const productData = {
        name: data.productName,
        description: data.productDescription,
        price: data.productPrice,
        image: imageUrl,
        phone: data.productPhone,
        public_id
      };

      // Send data to API
      const response = await axios.post(
        `/api/create`,
        productData,
  
      );
      
      console.log("Product added successfully:", response.data);
      
      // Reset form on success
      reset();
      
      // Show success message
      alert('Product registered successfully!');
      
      router.push('/marketplace');
    } catch (error) {
      console.error("Error submitting product:", error);
      setError("Failed to add product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('productImage', file, { shouldValidate: true });
    }
  };

  const productDescription = watch('productDescription');
  const descriptionLength = productDescription?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Product Registration</h1>
          <p className="text-purple-200">Add your product details below</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Product Name */}
          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-white mb-2">
              Product Name
            </label>
            <input
              {...register('productName')}
              type="text"
              id="productName"
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
              placeholder="Enter product name"
            />
            {errors.productName && (
              <p className="mt-1 text-sm text-red-300">{errors.productName.message}</p>
            )}
          </div>

          {/* Product Description */}
          <div>
            <label htmlFor="productDescription" className="block text-sm font-medium text-white mb-2">
              Description
            </label>
            <textarea
              {...register('productDescription')}
              id="productDescription"
              rows={4}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Describe your product..."
            />
            <div className="flex justify-between items-center mt-1">
              {errors.productDescription && (
                <p className="text-sm text-red-300">{errors.productDescription.message}</p>
              )}
              <p className={`text-sm ml-auto ${descriptionLength > 200 ? 'text-red-300' : 'text-purple-200'}`}>
                {descriptionLength}/200
              </p>
            </div>
          </div>

          {/* Product Price */}
          <div>
            <label htmlFor="productPrice" className="block text-sm font-medium text-white mb-2">
              Price
            </label>
            <input
              {...register('productPrice')}
              type="number"
              id="productPrice"
              min="0"
              step="0.01"
              onKeyPress={(e) => {
                // Allow only numbers, decimal point, and control keys
                if (!/[0-9.]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
              placeholder="0.00"
            />
            {errors.productPrice && (
              <p className="mt-1 text-sm text-red-300">{errors.productPrice.message}</p>
            )}
          </div>

          {/* Product Image */}
          <div>
            <label htmlFor="productImage" className="block text-sm font-medium text-white mb-2">
              Product Image
            </label>
            <div className="relative">
              <input
                type="file"
                id="productImage"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
              />
            </div>
            {errors.productImage && (
              <p className="mt-1 text-sm text-red-300">{errors.productImage.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="productPhone" className="block text-sm font-medium text-white mb-2">
              Phone Number
            </label>
            <input
              {...register('productPhone')}
              type="tel"
              id="productPhone"
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
              placeholder="1234567890"
              maxLength={10}
            />
            {errors.productPhone && (
              <p className="mt-1 text-sm text-red-300">{errors.productPhone.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-purple-800 disabled:to-indigo-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Uploading...
              </div>
            ) : (
              'Register Product'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}