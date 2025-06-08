import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { filename } = req.body;
  if (!filename) {
    return res.status(400).json({ error: 'No filename provided' });
  }

  const filePath = path.join(process.cwd(), 'tmp', filename);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return res.status(200).json({ success: true });
    } else {
      return res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
