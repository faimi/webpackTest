//引入html-webpack-plugin
const HtmlWebpackPlugin = require("html-webpack-plugin");
const isDev = process.env.NODE_ENV === "development";
const config = require("./public/config")[isDev ? "dev" : "build"];
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssPlugin = require("optimize-css-assets-webpack-plugin");
const apiMocker = require("mocker-api");
const SpeedMesureWebpackPlugin = require("speed-measure-webpack-plugin");
const smwp = new SpeedMesureWebpackPlugin();
const HappyPack = require("happypack");

const configs = {
  // mode:'development',
  mode: isDev ? "development" : "production",
  // entry: "./src/index.js",
  entry: {
    index: "./src/index.js",
    login: "./src/login.js"
  },
  output: {
    //路径必须是绝对路径
    path: path.resolve(__dirname, "dist"),
    //考虑到CDN缓存问题，并且可以指定hash串长度
    filename: "bundle.[hash:6].js",
    //通常是CDN地址，可以不配置，或者配置为/
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ["thread-loader","cache-loader", "babel-loader"],
        // use: "HappyPack/loader?id=js",
        //排除 node_modules 目录
        exclude: /node_modules/,
        include: [path.resolve(__dirname, "src")]
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          "cache-loader",
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
              reloadAll: true
            }
          },
          //替换之前的style-loader
          // MiniCssExtractPlugin.loader,
          // "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: function() {
                return [
                  //overrideBrowserslist被存储到.browserslistrc文件夹下
                  require("autoprefixer")()
                ];
              }
            }
          },
          "less-loader"
        ],
        // use: "HappyPack/loader?id=css",
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
        // use: [
        //   "cache-loader",
        //   {
        //     loader: "url-loader",
        //     options: {
        //       //资源大小小于10K,将资源转换为base64，超过10K，将图片拷贝到dist目录。将资源转换为 base64 可以减少网络请求次数，但是 base64 数据较大，如果太多的资源是 base64，会导致加载变慢，因此设置 limit 值时，需要二者兼顾。
        //       limit: 10240,
        //       //esModule设置为false，否则<img src={require('XXX.jpg')} />会出现 <img src=[Module Object] />
        //       esModule: false,
        //       //为了保留图片的原始扩展名
        //       name: "[name]_[hash:6].[ext]",
        //       //如果图片文件很多的话，设置文件存放路径，就会出现一个assets文件专门存放图片
        //       outputPath: "assets"
        //     }
        //   }
        // ],
        use: "HappyPack/loader?id=file",
        exclude: /node_modules/
      }
      // {
      //   test: /.html$/,
      //   use: "html-withimg-loader"
      // }
    ]
  },
  plugins: [
    //plugins数组放所有的webpack插件
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      //打包后的文件名
      filename: "index.html",
      minify: {
        //是否移除属性的双引号
        removeAttributeQuotes: false,
        //是否折叠空白
        collapseWhitespace: false
      },
      //hash默认是false
      // hash:true,
      config: config.template,
      chunks: ["index"]
    }),
    new HtmlWebpackPlugin({
      template: "./public/login.html",
      filename: "login.html",
      minify: {
        removeAttributeQuotes: false,
        collapseWhitespace: false
      },
      config: config.template,
      chunks: ["login"]
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin(
      [
        {
          from: "public/js/*.js",
          to: path.resolve(__dirname, "dist", "js"),
          //flatten属性只会拷贝文件，不会把文件路径也拷贝上
          flatten: true
        },
        {
          from: "public/css/*.css",
          to: path.resolve(__dirname, "dist", "css"),
          flatten: true
        }
      ],
      {
        //忽略another.css文件和another.js文件
        //ignore: ["another.css", "another.js"]
      }
    ),
    new webpack.ProvidePlugin({
      //Vue的配置必须有default，因为vue.em.js是靠export default导出的
      Vue: ["vue/dist/vue.esm.js", "default"],
      //React不需要default，因为React是靠module.export导出的
      React: "react",
      Component: ["react", "Component"],
      $: "jquery",
      _map: ["lodash", "map"]
    }),
    new MiniCssExtractPlugin({
      filename: "css1/[name].css"
      // publicPath:'../'
    }),
    new OptimizeCssPlugin(),
    //热更新
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      DEV: JSON.stringify("dev"),
      FLAG: "true"
    }),
    // new HappyPack({
    //   id: "js",
    //   use: ["thread-loader","cache-loader", "babel-loader"]
    // }),
    // new HappyPack({
    //   id: "css",
    //   use: [
    //     "thread-loader",
    //     "cache-loader",
    //     {
    //       loader: MiniCssExtractPlugin.loader,
    //       options: {
    //         hmr: isDev,
    //         reloadAll: true
    //       }
    //     },
    //     //替换之前的style-loader
    //     // MiniCssExtractPlugin.loader,
    //     // "style-loader",
    //     "css-loader",
    //     {
    //       loader: "postcss-loader",
    //       options: {
    //         plugins: function() {
    //           return [
    //             //overrideBrowserslist被存储到.browserslistrc文件夹下
    //             require("autoprefixer")()
    //           ];
    //         }
    //       }
    //     },
    //     "less-loader"
    //   ]
    // }),
    new HappyPack({
      id: "file", //和rule中的id=file对应
      use: [
        // "thread-loader",
        "cache-loader",
        {
          loader: "url-loader",
          options: {
            //资源大小小于10K,将资源转换为base64，超过10K，将图片拷贝到dist目录。将资源转换为 base64 可以减少网络请求次数，但是 base64 数据较大，如果太多的资源是 base64，会导致加载变慢，因此设置 limit 值时，需要二者兼顾。
            limit: 10240,
            //esModule设置为false，否则<img src={require('XXX.jpg')} />会出现 <img src=[Module Object] />
            esModule: false,
            //为了保留图片的原始扩展名
            name: "[name]_[hash:6].[ext]",
            //如果图片文件很多的话，设置文件存放路径，就会出现一个assets文件专门存放图片
            outputPath: "assets"
          }
        }
      ]
    })
  ],
  devServer: {
    port: "8000", //默认是8080
    quiet: false, //默认是false
    inline: true, //默认true，false的话开启iframe模式
    stats: "errors-only", //终端仅打印error，当启用了quiet或者是noInfo时，此属性不起作用
    overlay: false, //默认不启用，启用后当编译出错时，会在浏览器窗口全屏输出错误。
    clientLogLevel: "silent", //日志等级
    compress: true, //是否启用gzip
    hot: true,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        // 在配置代理时，去掉/api
        pathRewrite: {
          api: ""
        }
      }
    },
    // before(app) {
    //   app.get("/sex", (req, res) => {
    //     res.json({ sex: "girl" });
    //   });
    // }
    before(app) {
      apiMocker(app, path.resolve("./mock/mocker.js"));
    }
  },
  devtool: "cheap-module-eval-source-map", //开发环境下使用
  performance: {
    hints: "warning", // 枚举
    maxAssetSize: 30000000, // 整数类型（以字节为单位）
    maxEntrypointSize: 50000000, // 整数类型（以字节为单位）
    assetFilter: function(assetFilename) {
      // 提供资源文件名的断言函数
      return assetFilename.endsWith(".css") || assetFilename.endsWith(".js");
    }
  },
  resolve: {
    modules: ["./src/components", "node_modules"]
  }
};

module.exports = smwp.wrap(configs);

// module.exports = {
//     // mode: 'development',
//     module: {
//         //rules是个数组
//         rules: [
//             //loader需要配置在module.rules中
//             {
//                 //test是匹配规则，针对符合规则的文件进行处理
//                 test: /\.jsx?$/,
//                 //use可以是个字符串或者是个数组，数组的每一项可以是字符串或者对象
//                 use: {
//                     loader: 'babel-loader',
//                     options: {
//                         presets: ["@babel/preset-env"],
//                         plugins: [
//                             [
//                                 "@babel/plugin-transform-runtime",
//                                 {
//                                     "corejs": 3
//                                 }
//                             ]
//                         ]
//                     }
//                 },
//                 exclude: /node_modules/  //排除 node_modules 目录
//             }
//         ]
//     }
// }
