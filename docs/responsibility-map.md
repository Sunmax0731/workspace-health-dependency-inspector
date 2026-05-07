# 責務マップ

## 目的

VS Codeワークスペースの依存と健康診断を、MVPの単一チェックから公開前に使える判断支援へ引き上げる。

## 責務分割

| 責務 | 担当 | 判断 |
| --- | --- | --- |
| 設定 | config | プロダクト名、必須項目、QCDS目標を保持する |
| 入力正規化 | input | 配列、単一オブジェクト、items 配列を統一する |
| 検証 | validators | 必須項目不足と状態異常を findings に変換する |
| レビュー導線 | review-model | 完了率、ステータス、次アクションを作る |
| レポート | report | Markdown / HTML の見える形に変換する |
| UI / ホスト連携 | UI layer | CLI、Webview、Popup、Plugin、EditorWindow からレビュー結果を表示する |

## 粒度の基準

- 検査ルールは validators に閉じる。
- 表示文言とカード構成は review-model / report に寄せる。
- ホストアプリ固有処理は UI layer に閉じ、コア検査を直接変更しない。
