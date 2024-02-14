import { ProxyAdapter } from "@graphql-debugger/adapter-proxy";
import { traceSchema } from "@graphql-debugger/trace-schema";
import { hashSchema } from "@graphql-debugger/utils";

import fs from "fs";
import { buildSchema } from "graphql";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const adapter = new ProxyAdapter();

  const disposable = vscode.commands.registerCommand(
    "graphql-debugger.openPanel",
    async () => {
      const panel = vscode.window.createWebviewPanel(
        "graphqlDebugger",
        "GraphQL Debugger",
        vscode.ViewColumn.Beside,
        {
          enableScripts: true,
          localResourceRoots: [
            vscode.Uri.parse("http://localhost:16686"),
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

      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const document = await vscode.workspace.openTextDocument(
          editor.document.uri,
        );

        const text = document.getText();
        const schema = buildSchema(text);

        const tracedSchema = traceSchema({ schema, adapter });
        const hash = hashSchema(tracedSchema);
        let schemaid: string | undefined = undefined;

        try {
          const debuggerSchema = await adapter.schema.findFirst({
            where: {
              hash,
            },
          });

          schemaid = debuggerSchema?.id;
        } catch (e) {
          console.error(e);
          vscode.window.showInformationMessage(`Error finding schema: ${e}`);
        }

        if (!schemaid) {
          vscode.window.showInformationMessage("Schema not found.");
        }

        panel.webview.html = getWebviewContent(
          context,
          panel.webview,
          schemaid as string,
        );
      }
    },
  );

  context.subscriptions.push(disposable);
}

function getWebviewContent(
  context: vscode.ExtensionContext,
  webview: vscode.Webview,
  schemaId: string,
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

  const scriptToSetSchemaId = `<script nonce="${nonce}">localStorage.setItem("SCHEMA_ID", "${schemaId}");</script>`;

  html = html.replace(
    /<meta http-equiv="Content-Security-Policy".*?>/,
    `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} https:; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">`,
  );

  html = html.replace("</head>", `${scriptToSetSchemaId}</head>`);

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
