# DirectorySelectButton

フォルダー選択専用のボタンコンポーネント。エクスプローラーを開いてフォルダーを選択できます。

## 特徴

- ✅ フォルダー選択専用（`webkitdirectory`属性使用）
- ✅ 型安全なコールバック
- ✅ Electron環境でのパス取得サポート
- ✅ フォルダー内のファイル一覧取得
- ✅ 宣言的なAPI設計

## 基本的な使用方法

### パターン1: フォルダーパスのみを取得

```typescript
import { DirectorySelectButton } from "./DirectorySelectButton";

const button = new DirectorySelectButton({
    buttonText: "フォルダーを選択",
    onDirectorySelected: (directoryPath) => {
        console.log("選択されたフォルダー:", directoryPath);
        // 例: C:\Users\username\Documents\MyFolder
    }
});

document.body.appendChild(button.dom.element);
```

### パターン2: フォルダーパスとファイル一覧の両方を取得

```typescript
const button = new DirectorySelectButton({
    buttonText: "プロジェクトフォルダーを選択",
    onDirectorySelectedWithFiles: (details) => {
        console.log("フォルダーパス:", details.directoryPath);
        console.log("ファイル数:", details.files.length);
        
        details.files.forEach(file => {
            console.log("ファイル:", file.name, file.webkitRelativePath);
        });
    }
});
```

### パターン3: 後からイベントを追加

```typescript
const button = new DirectorySelectButton({
    buttonText: "フォルダーを選択"
});

button
    .addOnDirectorySelectedEvent((path) => {
        console.log("選択:", path);
    })
    .setDisabled(false);
```

## LV1コンポーネント: DirectoryInputC

より低レベルな制御が必要な場合は、`DirectoryInputC`を直接使用できます。

```typescript
import { DirectoryInputC } from "../../../UiComponent/Base/LV1UIComponents/DirectoryInputComponent";

const input = new DirectoryInputC()
    .setStyleCSS({ display: 'none' })
    .onDirectoryPathSelected((path) => {
        console.log("選択されたフォルダー:", path);
    });

const customButton = new ButtonC({ text: "選択" })
    .addTypedEventListener("click", () => {
        input.click();
    });
```

## API

### DirectorySelectButtonProps

```typescript
interface DirectorySelectButtonProps {
    buttonText?: string;                    // ボタンのテキスト
    acceptMultiple?: boolean;               // 複数フォルダー選択（実験的）
    onDirectorySelected?: (path: string) => void;
    onDirectorySelectedWithFiles?: (details: { 
        directoryPath: string; 
        files: File[] 
    }) => void;
    width?: string;                         // ボタンの幅
}
```

### メソッド

- `setButtonText(text: string)` - ボタンのテキストを変更
- `setDisabled(disabled: boolean)` - 無効/有効状態を設定
- `openDirectoryDialog()` - プログラムからフォルダー選択ダイアログを開く
- `addOnDirectorySelectedEvent(callback)` - パス選択イベントを追加
- `addOnDirectorySelectedWithFilesEvent(callback)` - 詳細情報イベントを追加

## 注意事項

1. **ブラウザ互換性**: `webkitdirectory`属性はモダンブラウザでサポートされていますが、標準仕様ではありません
2. **Electron環境**: `file.path`プロパティはElectron環境でのみ利用可能
3. **フォルダー内のファイル**: フォルダーを選択すると、そのフォルダー内のすべてのファイルが`FileList`として取得されます
4. **複数フォルダー**: `acceptMultiple`は実験的機能で、ブラウザによって動作が異なる場合があります

## FileSelectButton との違い

| 機能 | FileSelectButton | DirectorySelectButton |
|------|------------------|----------------------|
| 選択対象 | ファイル | フォルダー |
| フィルター | ✅ あり (`accept`属性) | ❌ なし |
| 複数選択 | ✅ 標準サポート | ⚠️ 実験的 |
| 取得データ | ファイルパス | フォルダーパス + ファイル一覧 |

## 使用例: 実践的なシナリオ

### プロジェクトフォルダーの読み込み

```typescript
const loadProjectButton = new DirectorySelectButton({
    buttonText: "プロジェクトを開く",
    onDirectorySelectedWithFiles: async (details) => {
        const { directoryPath, files } = details;
        
        // プロジェクト設定ファイルを探す
        const configFile = files.find(f => f.name === 'config.json');
        if (configFile) {
            const text = await configFile.text();
            const config = JSON.parse(text);
            console.log("プロジェクト設定:", config);
        }
        
        // すべてのTypeScriptファイルを抽出
        const tsFiles = files.filter(f => f.name.endsWith('.ts'));
        console.log(`${tsFiles.length}個のTSファイルを検出`);
    }
});
```
