# img2img-frontend

このプロジェクトは、画像変換APIをフロントエンドから利用するための Next.js アプリです。

## 主な機能
- 変換元写真の場所（パスやURL）を入力するテキスト欄
- 「変換実行」ボタンでAPIを呼び出し、変換後の画像を表示
- 「クリア」ボタンで入力欄と画像表示をリセット
- 変換後画像の表示エリア

## セットアップ手順
1. 必要なパッケージのインストール

```bash
npm install
```

2. 開発サーバーの起動

```bash
npm run dev
```

3. ブラウザで `http://localhost:3000` を開く

## APIエンドポイントについて

`pages/index.js` 内の `API_ENDPOINT` をご自身のAPIエンドポイントに合わせて修正してください。

https://github.com/misakiotb/img2img をローカル実行した画像変換APIエンドポイントを利用することを想定しており、デフォルトでは `http://localhost:5000/api/convert` になっています。

## APIレスポンス例

APIは以下の形式でJSONを返すことを想定しています：

```json
{
  "image": "...base64エンコード画像データ..."
}
```

---

何か不明点があれば、気軽に質問してください。
