//引入html-webpack-plugin
const HtmlWebpackPlugin = require("html-webpack-plugin");
const isDev = process.env.NODE_ENV === "development";
const config = require("./public/config")[isDev ? "dev" : "build"];
const path = require("path");
module.exports = {
  // mode:'development',
  mode: isDev ? "development" : "production",
  entry: "./src/index.js",
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
        use: ["babel-loader"],
        //排除 node_modules 目录
        exclude: /node_modules/
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: function() {
                return [
                  require("autoprefixer")({
                    overrideBrowserslist: [">0.25%", "not dead"]
                  })
                ];
              }
            }
          },
          "less-loader"
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
        use: [
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
        ],
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
      config: config.template
    })
  ],
  devServer: {
    port: "8000", //默认是8080
    quiet: false, //默认是false
    inline: true, //默认true，false的话开启iframe模式
    stats: "errors-only", //终端仅打印error，当启用了quiet或者是noInfo时，此属性不起作用
    overlay: false, //默认不启用，启用后当编译出错时，会在浏览器窗口全屏输出错误。
    clientLogLevel: "silent", //日志等级
    compress: true //是否启用gzip
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
  }
};

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
