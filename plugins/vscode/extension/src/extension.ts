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
        },
      );

      panel.webview.html = getWebviewContent();
    },
  );

  context.subscriptions.push(disposable);
}

function getWebviewContent() {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>GraphQL Debugger</title>
    </head>
    <body>
      <h1>GraphQL Debugger</h1>
    </body>
    </html>`;
}

export function deactivate() {}
