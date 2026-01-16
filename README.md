🌲 YelpCamp – Campground Review App
キャンプ場の投稿・レビュー・地図表示ができるフルスタック Web アプリケーションです。
Express を中心に、認証・画像アップロード・地図表示など、Web アプリの基本機能を一通り実装しています。

🚀 Features（主な機能）
🏕 キャンプ場の CRUD
- 新規作成 / 編集 / 削除
- 価格・場所・説明・画像の登録
- Mapbox を使った位置情報の自動マッピング
🖼 画像アップロード
- Cloudinary を利用した画像アップロード
- 画像の複数枚アップロード
- 編集時の画像削除にも対応
👤 ユーザー認証
- Passport.js によるログイン / ログアウト
- 新規登録
- 認証済みユーザーのみが投稿・編集可能
⭐ レビュー機能
- 各キャンプ場にレビュー（コメント + 評価）を投稿
- 自分のレビューの削除が可能
- バリデーション（Joi）で不正データを防止
🗺 Mapbox 連携
- キャンプ場の位置を地図上に表示
- ピン表示
- 地名から緯度経度を自動取得（Geocoding）
🔐 セキュリティ
- Helmet によるヘッダー強化
- MongoDB の NoSQL Injection 対策
- サニタイズ処理で XSS を防止

🛠 Tech Stack（技術構成）
Backend
- Node.js
- Express
- MongoDB
- Mongoose
- Passport.js（認証）
- Joi（バリデーション）
Frontend
- EJS（テンプレートエンジン）
- Bootstrap
- Vanilla JavaScript
- Mapbox GL JS
Infrastructure
- Cloudinary（画像ストレージ）
- Mapbox（地図 API）
- MongoDB Atlas（クラウド DB）

- 🎯 What I Learned（学んだこと）
- Express を使った MVC 構成の理解
- 認証・セッション管理の実装
- 外部 API（Cloudinary / Mapbox）の統合
- MongoDB のスキーマ設計
- バリデーションとセキュリティ対策
- SSR（EJS）による UI 実装
- デプロイ時の環境変数管理

