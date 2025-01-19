# ビルド

## 動作環境構築

* `docker compose up` で DB コンテナを起動する
* build_jar.{ bat | sh } にて jar ファイルを作成する
  * 出来上がった jar を起動する `java -jar <作成した jar ファイル>`
    * java -jar ExpenditureBook-1.0.0.jar --server.port=3000
      * 上記の様にポートの指定も可能

## 開発環境について

* mise による開発言語の管理
  * java のバージョンなどを管理
  * `mise i` で .mise.toml に従って必要なバージョンがインストールされ切り替わる
    * `mise ls` で現在インストール済みと使用しているバージョンを確認
    * `mise ls-remote java` で java のインストール可能なバージョンを表示

* Eclipse を使用
  * [ファイル] - [ファイルシステムからプロジェクトを開く] でプロジェクトルート( README.md を含む )を開くこと
    * src を開くとプロジェクトがうまく読み込まれないかも
  * Gradle の Java ホームを設定するのが大事 ( 上記の mise 管理も影響 )
    * [ウィンドウ]-[設定]から Gradle に関する設定を行う
      * /home/minamo/.local/share/mise/installs/java/21.0.0
        * の様な値を設定する
      * Gradle のビルドを実行するのではなく、リフレッシュすることで色々動く様子
  * Spring Boot など必要なプラグインなどをインストールする必要がある
    * 下記記載のバージョンなどは参考までに実際に使っていたもの
    * マーケットプレイスより
      * Spring Tool 4(aka Spring Tool Suite-4) 4.27.0.RELEASE
    * 手動
      * lombok
        * 公式から jar をダウンロードして実行 `java -jar <lombok.jarのパス>`
      * EditorConfig
      * Buildship Gradle Integration 3.0
        * これは Eclipse 標準かも

* `docker compose up` で DB 用のコンテナが立ち上がる
  * コンテナにファイルを送信する `docker cp <送るファイルのパス> expenditure-db:<送り先のパス>`
    * コマンドによってコンテナの名前指定の方法( db や expenditure-db )が違うことがあるので注意
  * コンテナの中で作業がしたい場合は `docker compose exec db /bin/bash` で DB コンテナに繋がる
    * `my.conf` の中に user, password を書いておく ( db コンテナの /etc/mysql/conf.d に接続済み )
      * コンテナ内でデータをインポートする場合は必須
      * コンテナ内で `mysql ExpenditureBook < {データ}` でインポートできる
        * ！文字コードに注意！コンテナの中で実行せずに dbeaver など外部のツールで INSERT や UPDATE を発行する方が良いかも
          * 逆に環境の影響で DB に変な値で書き込んでいたらコンテナに繋いで出力が必要になったりするので使い分ける

* java プログラムを実行することで DB のマイグレーションなどが起こる
  * コードに @Table と書いて動かしたらテーブルが生える
  * 必要なら DB をインポートするなりしてデータをセットする

* Gradle との兼ね合いに注意
  * JDK とのバージョンに問題なければ `gradlew build` で jar ができる
    * Eclipse からではなくプロンプトから直接叩いた
    * `build_jar.{ bat | sh }` があるので実行、もしくは参考にする

## Git のフック環境

* フックを利用して何かを行いたい場合、フックのパスを Git で管理できる別の場所に移すこともできる
* git config --local core.hooksPath .githooks
  * [参考](https://qiita.com/MasaoSasaki/items/fb741b54d807a49c2817)

