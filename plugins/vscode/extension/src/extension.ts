import fs from "fs";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "graphql-debugger.openPanel",
    () => {
      const panel = vscode.window.createWebviewPanel(
        "graphqlDebugger",
        "GraphQL Debugger",
        vscode.ViewColumn.Beside,
        {
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.joinPath(
              context.extensionUri,
              "node_modules",
              "@graphql-debugger",
              "vscode-ui",
              "build",
            ),
          ],
        },
      );

      panel.webview.html = getWebviewContent(context, panel.webview);
    },
  );

  context.subscriptions.push(disposable);
}

function getWebviewContent(
  context: vscode.ExtensionContext,
  webview: vscode.Webview,
) {
  const indexPath = vscode.Uri.joinPath(
    context.extensionUri,
    "node_modules",
    "@graphql-debugger",
    "vscode-ui",
    "build",
    "index.html",
  );
  let html = fs.readFileSync(indexPath.fsPath, "utf8");

  html = html.replace(/(href|src)="([^"]*)"/g, (match, p1, p2) => {
    const assetPath = vscode.Uri.joinPath(
      context.extensionUri,
      "node_modules",
      "@graphql-debugger",
      "vscode-ui",
      "build",
      p2,
    );
    const assetUri = webview.asWebviewUri(assetPath);
    return `${p1}="${assetUri}"`;
  });

  const nonce = getNonce();
  html = html.replace(
    /<meta http-equiv="Content-Security-Policy".*?>/,
    `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} https:; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">`,
  );

  return html;
}

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export function deactivate() {}
