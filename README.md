# TCDA Size Guide (Slip-on only) (GitHub Pages)

このフォルダは **CSV → 自動サイズ表表示** のミニサイトです。

## できること
- 商品を選ぶ → cm / inch を切り替える → CSVを自動で読み込み、表を表示
- 「表をコピー（TSV）」で Numbers / Excel に貼り付けやすい形式でコピー
- 「CSVをダウンロード」で、表示中のCSVをそのままダウンロード

## 使い方（GitHub Pages）
1. GitHubで新規リポジトリを作成（例: `tcda-size-guide`）
2. このフォルダ内のファイルをリポジトリ直下へアップロード
3. GitHub → Settings → Pages
   - Source: `Deploy from a branch`
   - Branch: `main` / `(root)` を選択して Save
4. 公開URLにアクセス（例: `https://<username>.github.io/tcda-size-guide/`）

## CSVの差し替え
`/data/` にあるCSVを差し替えるだけで表示が更新されます（同じファイル名にする）。

### 現在使っているファイル名（安全な英数字名）
- aop_womens_crew_cm.csv / aop_womens_crew_inch.csv
- aop_mens_crew_cm.csv / aop_mens_crew_inch.csv
- aop_recycled_hoodie_cm.csv / aop_recycled_hoodie_inch.csv
- aop_recycled_zip_hoodie_cm.csv / aop_recycled_zip_hoodie_inch.csv
- mens_slipon_cm.csv / mens_slipon_inch.csv（※今はプレースホルダー）
- womens_slipon_cm.csv / womens_slipon_inch.csv（※今はプレースホルダー）

> スリッポンのCSVをアップしたら、上の2ファイルを中身ごと置き換えればOKです。

## メモ
- 一部CSVは「Unnamed: 0」みたいな列名になる形式でしたが、このサイト側で自動判定して表にします。
- 文字は白・背景は黒のデザインです。
