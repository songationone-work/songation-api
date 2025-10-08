import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handler(req, res) {
  try {
    const { public_id, approve } = req.body;

    if (!public_id) return res.status(400).json({ error: 'No public_id' });

    if (approve) {
      const fullUrl = cloudinary.v2.url(public_id, {
        resource_type: 'video',
        type: 'authenticated',
        sign_url: true,
        expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiry
        transformation: [{ format: 'm3u8' }]
      });

      return res.json({ status: 'approved', fullUrl });
    } else {
      return res.json({ status: 'pending', message: 'Awaiting admin approval' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
}
