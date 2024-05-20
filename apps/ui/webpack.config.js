const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  mode: "none",
  entry: path.join(__dirname, "src", "index.tsx"),
  context: path.join(__dirname),
  target: "web",
  resolve: {
    extensions: [".ts", ".tsx", ".mjs", ".json", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: "/node_modules/",
        options: { transpileOnly: true },
      },
      {
        test: /\.(png|jpg|woff|woff2|eot|ttf)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "svg-url-loader",
            options: {
              limit: 10000,
            },
          },
        ],
      },
      {
        test: /\.(css|scss)$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
        exclude: /\.module\.css$/,
      },
    ],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "build"),
    publicPath: "",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: ["public"],
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        WEBPACK_DEV_PORT: JSON.stringify(process.env.WEBPACK_DEV_PORT),
        API_URL: JSON.stringify(process.env.API_URL),
        DEMO_MODE: JSON.stringify(process.env.DEMO_MODE),
      },
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      favicon: "./public/favicon.svg",
    }),
    new NodePolyfillPlugin(),
    ...(process.env.NODE_ENV === "production"
      ? [
          new CompressionPlugin({
            deleteOriginalAssets: true,
          }),
        ]
      : []),
  ],
  devServer: {
    static: {
      directory: "dist",
    },
    compress: true,
    port: process.env.WEBPACK_DEV_PORT,
  },
};
