// netlify/functions/upload-photo.js
// Upload photo for Instagram Hall of Fame

const { createClient } = require('@supabase/supabase-js');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the multipart form data
    const contentType = event.headers['content-type'];
    if (!contentType || !contentType.startsWith('multipart/form-data')) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid content type' })
      };
    }

    // Extract form data
    const boundary = contentType.split('boundary=')[1];
    const body = event.body;
    const parts = body.split(`--${boundary}`);

    let photoFile = null;
    let plazaNumber = null;
    let petName = null;

    for (const part of parts) {
      if (part.includes('Content-Disposition')) {
        const contentDisposition = part.match(/Content-Disposition:.*?name="(.*?)"/);
        if (contentDisposition) {
          const fieldName = contentDisposition[1];

          if (fieldName === 'photo') {
            // Extract photo data
            const photoMatch = part.match(/Content-Type: (.*?)\r\n\r\n([\s\S]*?)\r\n--/);
            if (photoMatch) {
              const photoType = photoMatch[1];
              const photoData = photoMatch[2];

              // Validate photo type
              if (!photoType.startsWith('image/')) {
                return {
                  statusCode: 400,
                  body: JSON.stringify({ error: 'Invalid file type. Only images are allowed.' })
                };
              }

              // Validate file size (5MB limit)
              const fileSize = Buffer.byteLength(photoData, 'base64');
              if (fileSize > 5 * 1024 * 1024) {
                return {
                  statusCode: 400,
                  body: JSON.stringify({ error: 'File size exceeds 5MB limit' })
                };
              }

              photoFile = {
                data: photoData,
                type: photoType,
                size: fileSize
              };
            }
          } else if (fieldName === 'plaza_number') {
            const valueMatch = part.match(/\r\n\r\n(.*?)\r\n--/);
            if (valueMatch) {
              plazaNumber = valueMatch[1];
            }
          } else if (fieldName === 'pet_name') {
            const valueMatch = part.match(/\r\n\r\n(.*?)\r\n--/);
            if (valueMatch) {
              petName = valueMatch[1];
            }
          }
        }
      }
    }

    if (!photoFile) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No photo file provided' })
      };
    }

    if (!plazaNumber) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Plaza number is required' })
      };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = photoFile.type.split('/')[1];
    const filename = `bsg-${plazaNumber}-${timestamp}.${extension}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('bsg-photos')
      .upload(filename, Buffer.from(photoFile.data, 'base64'), {
        contentType: photoFile.type,
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading photo:', uploadError);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to upload photo' })
      };
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('bsg-photos')
      .getPublicUrl(filename);

    // Update plaza record with photo URL
    const { error: updateError } = await supabase
      .from('bsg_plazas')
      .update({
        photo_url: publicUrlData.publicUrl,
        photo_uploaded_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('plaza_number', plazaNumber);

    if (updateError) {
      console.error('Error updating plaza record:', updateError);
      // Don't fail the request if update fails, photo is already uploaded
    }

    // Create Instagram post (this would be done manually or via Instagram API)
    // For now, we'll just log the information
    console.log('Instagram post ready:', {
      plazaNumber,
      petName,
      photoUrl: publicUrlData.publicUrl,
      filename
    });

    // Track photo upload event
    await trackPhotoUpload({
      plazaNumber,
      petName,
      photoUrl: publicUrlData.publicUrl,
      timestamp: new Date().toISOString()
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        photoUrl: publicUrlData.publicUrl,
        filename,
        message: 'Photo uploaded successfully for Instagram Hall of Fame'
      })
    };

  } catch (error) {
    console.error('Error in upload-photo:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

// Track photo upload events
async function trackPhotoUpload(data) {
  console.log('Tracking photo upload event:', data);
  // TODO: Integrate with analytics service
  // TODO: Track in Supabase analytics table
  // TODO: Send notification for Instagram post creation
}