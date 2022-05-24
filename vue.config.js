const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  // devServer:{
  // 	port:8080,
  // 	proxy:{
  // 		'/api':{
  // 			target:"https://localhost:8080",
  // 			ws:true,
  // 			changeOrigin:true,
  // 			pathRewrite:{
  // 				'^/api':''
  // 			}
  // 		}
  // 	}
  // }
})
