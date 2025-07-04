# 画像変換フロントエンド プロジェクト仕様書

## 1. プロジェクト概要

このプロジェクトは、画像をアップロードしてAIで変換するためのフロントエンドアプリケーションです。Next.jsをベースに構築されており、バックエンドAPIと連携して画像処理を行います。

## 2. システム構成

### 2.1 フロントエンド
- **フレームワーク**: Next.js 14.2.3
- **UIライブラリ**: React 18.2.0
- **開発サーバー**: Next.js 開発サーバー (ポート: 3000)

### 2.2 バックエンド
- **APIエンドポイント**: `http://localhost:5000/api/convert`
- **通信プロトコル**: HTTP/HTTPS
- **認証**: 現在は未実装

## 3. 機能仕様

### 3.1 画像変換機能
- 画像のアップロードまたはURL指定による入力
- 変換処理の実行
- 変換結果の表示
- 入力のクリア機能

### 3.2 画面レイアウト
1. **ヘッダー**
   - アプリケーションタイトル

2. **入力エリア**
   - 画像パス/URL入力フィールド
   - 変換実行ボタン
   - クリアボタン

3. **表示エリア**
   - 変換前画像のプレビュー
   - 変換後画像の表示
   - ローディングインジケーター
   - エラーメッセージ表示

## 4. API仕様

### 4.1 リクエスト
- **エンドポイント**: `POST /api/convert`
- **Content-Type**: `application/json`
- **リクエストボディ**:
  ```json
  {
    "prompt": "シンプルでかわいい、アニメ風の線画を作成して",
    "imagePath": "画像のパスまたはURL"
  }
  ```

### 4.2 レスポンス
- **成功時 (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "b64_json": "base64エンコードされた画像データ"
      }
    ]
  }
  ```

- **エラー時 (4xx/5xx)**:
  ```json
  {
    "success": false,
    "error": "エラーメッセージ"
  }
  ```

## 5. 環境構築手順

### 5.1 開発環境

1. **前提条件**
   - Node.js (v16.14.0 以上推奨)
   - npm (v8.3.1 以上) または yarn

2. **セットアップ**
   ```bash
   # リポジトリをクローン
   git clone [リポジトリURL]
   cd img2img-frontend

   # 依存パッケージのインストール
   npm install
   ```

3. **環境変数の設定**
   `.env.local` ファイルを作成し、以下の環境変数を設定します。
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. **開発サーバーの起動**
   ```bash
   npm run dev
   ```
   - ブラウザで `http://localhost:3000` にアクセス

### 5.2 本番環境

1. **ビルド**
   ```bash
   npm run build
   ```

2. **起動**
   ```bash
   npm start
   ```

## 6. デプロイ手順

### 6.1 Vercel へのデプロイ
1. Vercel にログイン
2. 新しいプロジェクトを作成
3. GitHub リポジトリをインポート
4. 環境変数を設定
5. デプロイを実行

### 6.2 環境変数
| 変数名 | 説明 | 例 |
|--------|------|-----|
| NEXT_PUBLIC_API_URL | バックエンドAPIのURL | https://api.example.com |

## 7. 開発ガイドライン

### 7.1 コーディング規約
- コンポーネントは関数コンポーネントを使用
- 状態管理には React Hooks を使用
- スタイリングには CSS Modules または styled-components を使用
- コンポーネントは `components/` ディレクトリに配置
- ページは `pages/` ディレクトリに配置

### 7.2 ブランチ戦略
- `main`: 本番環境用ブランチ
- `develop`: 開発用ブランチ
- `feature/*`: 新機能開発用ブランチ
- `bugfix/*`: バグ修正用ブランチ

### 7.3 コミットメッセージ
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントの変更
- `style`: コードのフォーマット変更
- `refactor`: リファクタリング
- `test`: テストの追加・修正
- `chore`: ビルドプロセスの変更など

## 8. テスト

### 8.1 テストの実行
```bash
# テストの実行
npm test

# カバレッジレポートの生成
npm run test:coverage
```

### 8.2 テストカバレッジ
- コンポーネントのテストカバレッジ: 80% 以上を目標
- API 連携部分のテストを重点的に実装

## 9. トラブルシューティング

### 9.1 よくある問題

#### APIに接続できない
- バックエンドサーバーが起動しているか確認
- 環境変数 `NEXT_PUBLIC_API_URL` が正しく設定されているか確認
- CORSの設定を確認

#### 画像が表示されない
- 画像データの形式が正しいか確認
- コンソールエラーを確認
- バックエンドからのレスポンスを確認

## 10. 今後の拡張予定

### 10.1 予定されている機能
- [ ] ユーザー認証機能
- [ ] 変換履歴の保存・表示
- [ ] 複数の変換スタイルの選択
- [ ] レスポンシブデザインの最適化
- [ ] プログレッシブエンハンスメントの実装

### 10.2 技術的負債
- エラーハンドリングの強化
- テストカバレッジの向上
- パフォーマンス最適化

## 11. ライセンス

このプロジェクトは [MIT ライセンス](LICENSE) の下で公開されています。

## 12. 連絡先

質問や問題がある場合は、以下までお問い合わせください。
- メール: [メールアドレス]
- GitHub: [GitHubユーザー名]

---
最終更新日: 2025年6月7日
