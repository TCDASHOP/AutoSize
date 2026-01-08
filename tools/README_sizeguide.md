# サイズガイド 自動更新（A案：products_master.csv）

## 目的
- 新アイテム追加時に **JS(app.js) を編集しない**
- **データ（CSV/画像/台帳）だけ追加**して、ドロップダウン・測り方画像・サイズ表を自動反映
- inch表は cm表から自動生成（1/8inch丸め＋分数表記）

## あなたが普段触るのはここだけ
1) data/products_master.csv に1行追加（新アイテム）
2) data/<key>_cm.csv を追加（サイズ表cm）
3) assets/guide_*.jpg を追加（必要なら）
4) Pythonista 3で tools/build_all.py を実行（manifest + inch生成）
5) 生成物をGitHubへpush

## 生成されるもの
- data/manifest.json（JSが読む商品台帳）
- data/<key>_inch.csv（cm→inch変換結果）

## 実行（Pythonista 3）
- tools/build_all.py を開いて ▶︎実行

※ 本番UIは変更していません。app.jsは「manifestがあればそれを使う／無ければ従来の内蔵リストで動く」フェイルセーフ付きです。
