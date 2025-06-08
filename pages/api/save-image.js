import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imageData } = req.body;
  if (!imageData) {
    return res.status(400).json({ error: 'No image data provided' });
  }

  // 一時保存ディレクトリ
  const tmpDir = path.join(process.cwd(), 'tmp');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir);
  }

  // ファイル名生成
  const filename = `webcam_${Date.now()}.png`;
  const filePath = path.join(tmpDir, filename);

  // base64データからPNG保存
  const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
  fs.writeFileSync(filePath, base64Data, 'base64');

  return res.status(200).json({ filename, filePath });
}
