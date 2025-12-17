# TCDA Size Finder (GitHub Pages)

## 使い方（最短）
1. このフォルダを GitHub リポジトリにアップロード（`index.html` がルートにある状態）
2. GitHub → Settings → Pages → Deploy from a branch
3. Branch: `main` / Folder: `/root` を選択 → Save
4. 表示されたURLにアクセス

## ロゴ
- `logo.svg` をあなたのロゴ画像に差し替えOK（同名で置換）
- PNGを使うなら `logo.png` にして `index.html` の `<img src>` を変更

## データ
- `data.json` に、今回アップロードされたCSVを元に変換したサイズ表が入っています
- 追加アイテムが増えたら、同じ形式で `data.json` の `items` を増やせば拡張できます

## 仕様（重要）
- 計算はブラウザ内で完結（サーバー送信なし）
- トップス/アウター：胸囲（ヌード）＋ゆとり → 仕上がり胸囲（身幅×2）で推奨
- シューズ：足長（実寸） → サイズ表の推奨足長（上限）で推奨
