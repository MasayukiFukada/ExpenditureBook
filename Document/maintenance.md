# 保守

## Conventional Commits

* changeloguru
  * CHANGELOG.md を生成可能 
    * ※ Conventional Commits を行っているのは途中のコミットから

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
