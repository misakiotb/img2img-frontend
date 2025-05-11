import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 仮のAPIエンドポイント
  const API_ENDPOINT = 'http://localhost:5000/api/convert';

  const handleConvert = async () => {
    setLoading(true);
    setError('');
    setImage(null);
    try {
      // APIにPOSTリクエスト
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: "シンプルでかわいい、アニメ風の線画を作成して", imagePath: input }),
      });
      if (!res.ok) throw new Error('APIリクエスト失敗');
      // 実際のAPIレスポンス形式に合わせて修正
      const data = await res.json();
      console.log(data);
      const b64 = data.data?.[0]?.b64_json;
      if (!b64) throw new Error('画像データが取得できませんでした');
      setImage(b64);
    } catch (e) {
      setError('変換に失敗しました: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInput('');
    setImage(null);
    setError('');
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>写真→ぬりえ 変換アプリ</h2>
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="写真のパスやURLを入力"
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ width: '100%', padding: 8, fontSize: 16 }}
        />
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={handleConvert} disabled={loading || !input} style={{ padding: '8px 16px' }}>
          {loading ? '変換中...' : '変換実行'}
        </button>
        <button onClick={handleClear} style={{ padding: '8px 16px' }}>
          クリア
        </button>
      </div>
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      <div style={{ minHeight: 200, border: '1px solid #ccc', textAlign: 'center', padding: 16 }}>
        {image ? (
          <img
            src={`data:image/png;base64,${image}`}
            alt="変換後画像"
            style={{ maxWidth: '100%', maxHeight: 300 }}
          />
        ) : (
          <span style={{ color: '#aaa' }}>ここに変換後画像が表示されます</span>
        )}
      </div>
    </div>
  );
}
