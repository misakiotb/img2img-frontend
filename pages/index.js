import { useState, useRef } from 'react';
import Webcam from 'react-webcam'; // 直接インポートに変更
import React from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Webカメラ関連
  // Webcam用のref。型をanyにしてgetScreenshotを安全に呼び出せるように
  const webcamRef = useRef(null);
  const [cameraImg, setCameraImg] = useState(null); // 撮影画像（base64）
  const [savedFilename, setSavedFilename] = useState(''); // 保存されたファイル名
  const [conversionDone, setConversionDone] = useState(false); // 変換完了フラグ

  // 今日の日付を取得してフォーマット
  const today = new Date();
  const formattedDate = `${today.getFullYear()}.${today.getMonth() + 1}.${today.getDate()}`;

  // カメラの準備完了状態
  const [cameraReady, setCameraReady] = useState(false);

  // 画像サイズ指定（参考記事と同じ640x480）
  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: 'user',
  };

  // 仮のAPIエンドポイント
  const API_ENDPOINT = 'http://localhost:5000/api/convert';

  // Webカメラで撮影
  // 撮影ボタン押下時の処理
  const handleCapture = () => {
    console.log('webcamRef.current:', webcamRef.current);
    console.log('typeof getScreenshot:', typeof webcamRef.current?.getScreenshot);
    // ref.currentが存在し、getScreenshotが関数なら呼び出す
    if (webcamRef.current && typeof webcamRef.current.getScreenshot === 'function') {
      const imgSrc = webcamRef.current.getScreenshot();
      setCameraImg(imgSrc);
    } else {
      setError('Webカメラが正しく初期化されていません');
    }
  };

  // 撮影画像を一時保存APIに送信
  const handleSaveImage = async () => {
    if (!cameraImg) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/save-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: cameraImg }),
      });
      if (!res.ok) throw new Error('画像保存APIエラー');
      const data = await res.json();
      setSavedFilename(data.filename); // これは /api/delete-image で使うのでファイル名のまま
      setInput(data.filePath);         // img2img APIには完全なパスを渡すため、filePath を設定
    } catch (e) {
      setError('画像保存に失敗: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  // img2img API呼び出し
  const handleConvert = async () => {
    setLoading(true);
    setError('');
    setImage(null);
    try {
      // APIにPOSTリクエスト
      const res = await fetch('http://localhost:5000/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: "シンプルでかわいい、アニメ風の線画を作成して", imagePath: input }),
      });
      if (!res.ok) {
        // APIサーバーからのエラーレスポンス内容をもう少し詳しく見てみる
        let apiErrorMsg = `APIリクエスト失敗 (ステータス: ${res.status})`;
        try {
          const errorData = await res.json();
          if (errorData && errorData.error) {
            apiErrorMsg += `: ${errorData.error}`;
          }
        } catch (jsonError) {
          // jsonパース失敗時は何もしない
        }
        throw new Error(apiErrorMsg);
      }
      // 実際のAPIレスポンス形式に合わせて修正
      const data = await res.json();
      const b64 = data.data?.[0]?.b64_json;
      if (!b64) throw new Error('画像データが取得できませんでした');
      setImage(b64);
      setConversionDone(true); // 変換完了フラグを立てる
      // 変換後に一時ファイル削除
      if (savedFilename) {
        try {
          const deleteRes = await fetch('/api/delete-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: savedFilename }),
          });
          if (!deleteRes.ok) {
            // 削除APIがエラーを返した場合、コンソールにログを出す
            console.error('一時ファイルの削除に失敗しました:', await deleteRes.text());
          }
        } catch (deleteErr) {
          console.error('一時ファイルの削除中にエラーが発生しました:', deleteErr);
        }
        setSavedFilename('');
      }
    } catch (e) {
      if (e.message.includes('Failed to fetch')) {
        setError('変換サーバーに接続できませんでした。サーバーが起動しているか確認してください。');
      } else {
        setError('変換に失敗しました: ' + e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => { 
    setInput('');
    setImage(null);
    setError('');
    setCameraImg(null); // 撮影画像もクリア
    setConversionDone(false); // 変換完了フラグをリセット

    // 一時保存されたファイルがあれば削除する
    if (savedFilename) {
      try {
        const deleteRes = await fetch('/api/delete-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: savedFilename }),
        });
        if (!deleteRes.ok) {
          console.error('クリア時に一時ファイルの削除に失敗しました:', await deleteRes.text());
        }
      } catch (deleteErr) {
        console.error('クリア時に一時ファイルの削除中にエラーが発生しました:', deleteErr);
      }
      setSavedFilename(''); // 削除API呼び出し後にクリア
    }
  };

  return (
    <>
      <style jsx global>{`
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        }
        button {
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          color: white; /* Default text color for buttons */
        }
        button:hover:not(:disabled) {
          opacity: 0.9; /* Slight hover effect */
        }
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(10deg); }
        }
        .loading-pencil {
          font-size: 48px; /* 絵文字のサイズ */
          display: inline-block;
          animation: wiggle 0.7s ease-in-out infinite alternate;
        }
      `}</style>
      <div style={{ maxWidth: 700, margin: 'auto', padding: 20 }}>
      <h2>AI体験 📸写真→ぬりえ 変換アプリ　（体験日：{formattedDate}）</h2>

      {/* Webカメラプレビューと撮影画像オーバーレイ (通常時) / 撮影した写真 (変換後) */}
      { !conversionDone ? (
      <div style={{ marginBottom: 16, textAlign: 'center', position: 'relative', width: 640, height: 480, margin: 'auto' }}>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/png"
          videoConstraints={videoConstraints}
          width={640} // 親要素に合わせる
          height={480} // 親要素に合わせる
          style={{ borderRadius: 8, border: '1px solid #ccc', display: 'block' }} // display: blockで余白を消す
          onUserMedia={() => setCameraReady(true)}
          onUserMediaError={err => setError('カメラが利用できません: ' + (err?.message || err))}
        />
        {/* 撮影画像プレビュー (オーバーレイ) */}
        {cameraImg && (
          <img
            src={cameraImg}
            alt="撮影画像"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%', // 親要素に合わせる
              height: '100%', // 親要素に合わせる
              borderRadius: 8,
              border: '1px solid #eee',
              zIndex: 2, // Webcamより手前に表示
            }}
          />
        )}
      </div>
      ) : (
        cameraImg && ( // 変換後に撮影した写真を表示
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <img src={cameraImg} alt="撮影した写真" style={{ maxWidth: '100%', maxHeight: 300, border: '1px solid #ccc', borderRadius: 8 }} />
          </div>
        )
      )}
      <div style={{ textAlign: 'center', marginTop: 8, marginBottom: 16 }}>
        { !conversionDone && (
          <>
            <button onClick={handleCapture} disabled={!cameraReady} style={{ padding: '6px 18px', marginRight: 8, backgroundColor: '#6c757d' }}>撮影／さつえい</button>
            <button onClick={handleSaveImage} disabled={!cameraImg} style={{ padding: '6px 18px', marginRight: 8, backgroundColor: '#007bff' }}>この写真を つかう</button>
            <button onClick={handleConvert} disabled={loading || !input} style={{ padding: '8px 16px', marginRight: 8, backgroundColor: '#28a745' }}>
              {loading ? '変換中...' : 'ぬりえ に 変換'}
            </button>
          </>
        )}
        <button onClick={handleClear} style={{ padding: '8px 16px', marginRight: 8, backgroundColor: '#dc3545' }}>
          クリア
        </button>
      </div>

      { !conversionDone && (
        <>
          {/* 既存の入力欄 */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="写真のパス"
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ width: '100%', padding: 8, fontSize: 16 }}
        />
      </div>

                {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
        </>
      )}
      <div style={{ minHeight: 200, border: '1px solid #ccc', textAlign: 'center', padding: 16 }}>
        {loading && !image ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <span className="loading-pencil">✏️</span>
            <p>ぬりえを生成中です...</p>
          </div>
        ) : image ? (
          <img
            src={`data:image/png;base64,${image}`}
            alt="変換後画像"
            style={{ maxWidth: '100%', maxHeight: 480, border: '1px solid #ccc', borderRadius: 8 }}
          />
        ) : (
          !conversionDone && <p>ここに変換後のぬりえが表示されます。</p> // 通常時のみプレースホルダー表示
        )}
      </div>
    </div>
    </>
  );
}
