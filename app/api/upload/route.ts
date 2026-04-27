import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Check if token exists
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      console.error('BLOB_READ_WRITE_TOKEN is not set in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error: Blob storage token is missing' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum 5MB allowed.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = await file.arrayBuffer();

    // Create unique filename
    const timestamp = Date.now();
    const filename = `portfolio-${timestamp}-${file.name}`;

    // Upload to Vercel Blob with explicit token
    const blob = await put(filename, buffer, {
      access: 'public',
      addRandomSuffix: false,
      token: token,  // Explicitly pass token
    });

    console.log('File uploaded successfully:', filename, blob.url);
    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Upload error:', error instanceof Error ? error.message : String(error));
    console.error('Full error:', error);
    
    // Provide more specific error message
    if (error instanceof Error && error.message.includes('401')) {
      return NextResponse.json(
        { error: 'Authentication failed. Blob token may be invalid or expired.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Upload failed. Please try again.' },
      { status: 500 }
    );
  }
}
