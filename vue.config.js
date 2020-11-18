/* jshint esversion: 8 */
/*
  p.mume

  All static status page system.

  (c)2020 Star Inc.(https://starinc.xyz)
*/

module.exports = {
    pages: {
        index: {
            title: 'p.mume',
            entry: 'src/main.js',
            template: 'public/index.html',
            filename: 'index.html',
        }
    },
    devServer: {
        disableHostCheck: true
    }
};
