# Expenditure Book

* ほぼ支出を専門的に管理するための家計簿
* 総資産を把握するのが目的ではなく、日常における支出の金額や傾向を俯瞰するのが目的

## DB 構造の操作について

* コマンドラインからクエリを叩くよりも dbeaver からエディタで入力して確認するのが楽
    * 確認できたら保存しておく
    * ==> コードに @Table とか書いて動かしたらテーブル生える

## ドキュメント

* [クラス図](./Document/class_diagram.md)
* [ER図](./Document/entity_relationship_diagram.md)

## 技術スタック

* Java + Spring Boot + Spring Data JPA
* Bulma CSS framework
* Vue.js (?) + billboard.js
* MySQL

## ビルドについて

* Gradle との兼ね合いに注意
    * JDK とのバージョンに問題なければ `gradlew build` で jar ができる
        * Eclipse からではなくプロンプトから直接叩いた
    * java -jar ExpenditureBook-1.0.0.jar --server.port=3000
      * ポートの指定も可能

## Conventional Commits

* changeloguru
  * CHANGELOG.md を生成可能 ※ 途中のコミットから

## CCN の計測

* Powershell
  * lizard と jinja2 をインストール済みであること
    * liZard -l java -C 7 [--csv|--html] > outputfile
      * -C 7  -> CCN = 7 (初期値は 15)
      * -T nloc=27  -> メソッドの長さ
        * メソッド名とブロックの閉じカッコもカウントしてるみたい
      * -x "除外するフォルダ"  -> チェック対象から外す
      * -a 4  -> メソッドのパラメータ数
      * -s cyclomatic_complexity  -> 複雑度で並び替え
    * サンプル
      * lizard -l java -C 7 -T nloc=27 -s cyclomatic_complexity -a 4 -x "./src/test/*" --csv > lizard.csv
      * lizard -l java -C 7 -T nloc=27 -s cyclomatic_complexity -a 4 -x "./src/test/*" --html > lizard.html
