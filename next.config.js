const withPlugins = require("next-compose-plugins");
const withTypescript = require("@zeit/next-typescript");
const withCSS = require("@zeit/next-css");

module.exports = withPlugins([withTypescript, withCSS], {
  target: "serverless",
  webpack(config) {
    config.module.rules.push({
      test: /\.(png|svg|eot|otf|ttf|woff|woff2)$/,
      use: {
        loader: "url-loader",
        options: {
          limit: 8192,
          publicPath: "/_next/static/",
          outputPath: "static/",
          name: "[name].[ext]"
        }
      }
    });
    return config;
  }
});
