import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    // Check if token exists
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    
    console.log('=== Upload Request Started ===');
    console.log('Token present:', !!token);
    console.log('Token length:', token?.length);
    console.log('Environment:', process.env.NODE_ENV);

    if (!token) {
      console.error('BLOB_READ_WRITE_TOKEN is not set');
      return NextResponse.json(
        { error: 'Server error: No Blob storage token configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    console.log('File received:', file?.name);
    console.log('File type:', file?.type);
    console.log('File size:', file?.size);

    if (!file) {
      console.error('No file provided in request');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      console.error('Invalid file type:', file.type);
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Only JPEG, PNG, WebP, and GIF are allowed.` },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error('File too large:', file.size, 'bytes');
      return NextResponse.json(
        { error: `File too large: ${file.size} bytes. Maximum 5MB allowed.` },
        { status: 400 }
      );
    }

    // Create unique filename
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `portfolio-${timestamp}-${sanitizedFileName}`;

    console.log('Uploading file:', filename);

    try {
      // Upload to Vercel Blob - pass token as option
      const blob = await put(filename, file, {
        access: 'public',
        token: token,
      });

      console.log('Upload successful:', filename);
      console.log('Blob URL:', blob.url);

      return NextResponse.json({ url: blob.url });
    } catch (blobError) {
      console.error('Vercel Blob error:', blobError instanceof Error ? blobError.message : String(blobError));
      console.error('Blob error details:', blobError);
      
      // Re-throw to be caught by outer catch
      throw blobError;
    }
  } catch (error) {
    console.error('=== Upload Error ===');
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Full error:', error);

    // Provide helpful error message
    let statusCode = 500;
    let errorMessage = 'Upload failed. Please try again.';

    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        statusCode = 401;
        errorMessage = 'Authentication failed. Blob token may be invalid.';
      } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
        statusCode = 403;
        errorMessage = 'Permission denied. Check Blob token permissions.';
      } else if (error.message.includes('ENOENT')) {
        statusCode = 400;
        errorMessage = 'File not found.';
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
