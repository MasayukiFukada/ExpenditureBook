# ER図

![ER図](./entity_relationship_diagram.png)

## Expenditure

* 支出の記録テーブル
* ID は順番の(一応)要素を含めるので UUID v7 を用いる
* 間違って登録した時などは削除したいので削除も対応

## Category

* カテゴリテーブル
* ID は順番の要素は不要なので UUID v4 でも良い
* 過去の記録との絡みもあるので、削除はできないようにする

