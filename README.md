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

* [ファイル] - [ファイルシステムからプロジェクトを開く] でプロジェクトルート( README.md を含む )を開くこと
    * src を開くとプロジェクトがうまく読み込まれないかも

* mise による管理
    * java のバージョンなどを管理
    * `mise i` で .mise.toml に従って必要なバージョンをインストールして切り替わる
        * `mise ls` で現在インストール済みと使用しているバージョンを確認
        * `mise ls-remote java` で java のインストール可能なバージョンを表示

* Gradle の Java ホームを設定するのが大事 ( 上記の mise 管理 )
    * [ウィンドウ]-[設定]から Gradle に関する設定を行う
      * /home/minamo/.local/share/mise/installs/java/21.0.0
          * の様な値を設定する
      * Gradle のビルドを実行するのではなく、リフレッシュすることで色々動く様子

* `docker compose up` で DB 用のコンテナが立ち上がる
    * `docker compose exec db /bin/bash` で DB コンテナに繋がる
    * コンテナにファイルを送信する `docker cp <送るファイルのパス> expenditure-db:<送り先のパス>`
      * コンテナの指定の方法が違うので注意

* `my.conf` の中に user, password を書いておく ( db コンテナの /etc/mysql/conf.d に接続済み )
    * 書いてないとインポートできない
    * `mysql ExpenditureBook < {データ}` でインポートできる
        * ！文字コードに注意！コンテナの中で実行せずに dbeaver など外部のツールで UPDATE 発行する方が良いかも
            * 逆に環境の影響で DB に変な値で書き込んでいたらコンテナに繋いで出力した方が良いかも

* その後プロジェクトを動かすことで DB のマイグレーションなどが起こる
    * 必要なら DB をインポートするなりしてデータをセットする

* Spring Boot など必要なプラグインなどをインストールする必要がある
    * バージョンなどは参考までに実際に使っていたもの
    * マーケットプレイスより
        * Spring Tool 4(aka Spring Tool Suite-4) 4.27.0.RELEASE
    * 手動
        * lombok
            * 公式から jar をダウンロードして実行 `java -jar <lombok.jarのパス>`
        * EditorConfig
        * Buildship Gradle Integration 3.0
            * Eclipse 標準かも

* Gradle との兼ね合いに注意
    * JDK とのバージョンに問題なければ `gradlew build` で jar ができる
        * Eclipse からではなくプロンプトから直接叩いた
        * `build.bat` があるので実行、もしくは参考にする
    * java -jar ExpenditureBook-1.0.0.jar --server.port=3000
        * ポートの指定も可能

* git config --local core.hooksPath .githooks
    * [参考](https://zenn.dev/sun_asterisk/articles/97d2b4be675c06

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

