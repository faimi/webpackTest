//引入html-webpack-plugin
const HtmlWebpackPlugin=require('html-webpack-plugin');
module.exports = {
    mode:'development',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: ['babel-loader'],
                exclude: /node_modules/ //排除 node_modules 目录
            }
        ]
    },
    plugins:[
        //plugins数组放所有的webpack插件
        new HtmlWebpackPlugin({
            template:'./public/index.html',
            //打包后的文件名
            filename:'index.html',
            minify:{
                //是否移除属性的双引号
                removeAttributeQuotes:false,
                //是否折叠空白
                collapseWhitespace:false
            },
            //hash默认是false
            // hash:true
        })
    ]
}
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
