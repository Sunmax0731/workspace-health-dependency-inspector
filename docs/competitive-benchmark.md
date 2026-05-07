# 競合・公式基準ベンチマーク

## 比較方針

ワークスペース健全性・依存関係インスペクター は、競合の全機能を再実装するのではなく、エディタ内で、Codex作業前に不足しやすいローカル前提を確認する。

| 参照先 | URL | 競合・公式標準の強み | 採用する評価基準 | 差別化 |
| --- | --- | --- | --- | --- |
| VS Code Extension API | https://code.visualstudio.com/api | コマンド、Webview、ワークスペース情報を拡張機能として統合できる。 | エディタ内で作業文脈と結果を確認できること。 | エディタ内で、Codex作業前に不足しやすいローカル前提を確認する。 |
| GitHub Desktop | https://docs.github.com/en/desktop/overview/about-github-desktop | Git の状態確認、ブランチ操作、差分確認をGUIで扱える。 | リリース、差分、検証ログ、ブランチ状態を追跡できること。 | エディタ内で、Codex作業前に不足しやすいローカル前提を確認する。 |
| PowerToys Run | https://learn.microsoft.com/en-us/windows/powertoys/run | ローカルアプリ、ファイル、コマンドをランチャーから素早く起動できる。 | 利用者が短時間で判断に進めること。 | エディタ内で、Codex作業前に不足しやすいローカル前提を確認する。 |

## 改善へ反映した点

- QCDS評価に競合比較と公式標準の確認を追加した。
- 実装だけでなく、README、導入手順、ユーザーガイド、手動テスト、リリース前資料を評価対象にした。
- 文字化けをQCDSのQuality/Satisfactionリスクとして検出する。
