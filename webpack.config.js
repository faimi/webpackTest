//引入html-webpack-plugin
const HtmlWebpackPlugin = require("html-webpack-plugin");
const isDev = process.env.NODE_ENV === "development";
const config = require("./public/config")[isDev ? "dev" : "build"];
module.exports = {
  // mode:'development',
  mode: isDev ? "development" : "production",
  module: {
    rules: [
      {
        // test: /\.jsx?$/,
        // use: ["babel-loader"],
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
        exclude: /node_modules/ //排除 node_modules 目录
      }
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
  devtool: "cheap-module-eval-source-map" //开发环境下使用
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
