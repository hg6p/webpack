const { mode } = require("webpack-nano/argv");
const { merge } = require("webpack-merge");
const parts = require("./webpack.parts");
const path = require("path");
const cssLoaders = [parts.autoprefixer(), parts.tailwind()];

const commonConfig = merge([
  {
    entry: {
      app: {
        import: path.join(__dirname, "src", "index.js"),
        dependOn: "vendor",
      },
      vendor: ["react", "react-dom"],
    },
    optimization: {
      moduleIds: "named",
    },
    output: {
      chunkFilename: "chunk.[id].js",
    },
    stats: {
      usedExports: true,
    },
  },
  parts.setFreeVariable("HELLO", "hello from config"),
  parts.clean(),
  parts.page({ title: "Demo" }),
  parts.extractCSS({ loaders: cssLoaders }),
  parts.loadJavaScript(),
  parts.generateSourceMaps({ type: "source-map" }),
]);

const productionConfig = merge([
  // parts.compressionPlugin(),
  parts.minifyJavaScript(),
  parts.minifyCSS({ options: { preset: ["default"] } }),
  parts.eliminateUnusedCSS(),
  { recordsPath: path.join(__dirname, "records.json") },
  {
    optimization: {
      splitChunks: { chunks: "all" },
      runtimeChunk: { name: "runtime" },
    },
    output: {
      chunkFilename: "[name].[contenthash].js",
      filename: "[name].[contenthash].js",
      assetModuleFilename: "[name].[contenthash][ext][query]",
    },
  },
  parts.attachRevision(),
]);

const developmentConfig = merge([
  { entry: ["webpack-plugin-serve/client"] },
  parts.devServer(),
]);

const getConfig = (mode) => {
  switch (mode) {
    case "prod:legacy":
      process.env.BROWSERSLIST_ENV = "legacy";
      return merge(commonConfig, productionConfig);
    case "prod:modern":
      process.env.BROWSERSLIST_ENV = "modern";
      return merge(commonConfig, productionConfig);
    case "production":
      return merge(commonConfig, productionConfig, { mode: "none" });
    case "development":
      return merge(commonConfig, developmentConfig, { mode });
    default:
      throw new Error(`Trying to use an unknown mode, ${mode}`);
  }
};

module.exports = getConfig(mode);
