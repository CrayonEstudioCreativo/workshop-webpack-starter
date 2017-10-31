import webpack from "webpack";
import path from "path";
import autoprefixer from "autoprefixer";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import CleanWebpackPlugin from "clean-webpack-plugin";

const extractCSS = new ExtractTextPlugin({
  filename: "css/[name].bundle.css"
});

export default {
  context: path.resolve(__dirname, "src"),
  entry: {
    app: "./js/app.js",
    app2: "./js/app2.js"
  },
  output: {
    path: path.resolve(__dirname, "public"),
    publicPath: "/",
    filename: "js/[name].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|svg)$/,
        include: [
          path.resolve(__dirname, "src"),
          path.resolve(__dirname, "node_modules")
        ],
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000, // Convert images < 10k to base64 strings
              name: "images/[hash].[ext]"
            }
          }
        ]
      },
      {
        test: /\.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
        include: [
          path.resolve(__dirname, "src"),
          path.resolve(__dirname, "node_modules")
        ],
        use: [
          {
            loader: "file-loader",
            options: {
              name: "fonts/[hash].[ext]",
              limit: 10000
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, "src"),
        use: extractCSS.extract({
          use: [
            "css-loader",
            "sass-loader",
            {
              loader: "postcss-loader",
              options: {
                plugins: [
                  autoprefixer({
                    browsers: ["last 3 versions"]
                  })
                ]
              }
            }
          ]
        })
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "src"),
        use: [
          {
            loader: "babel-loader"
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: "commons",
      filename: "js/commons.js"
    }),
    extractCSS,
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "../index.html",
      minify: false,
      hash: true
    }),
    new CleanWebpackPlugin(["public"], {
      root: path.resolve(__dirname)
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, "public"),
    open: true
  },
  devtool: "source-map"
};
