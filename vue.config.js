module.exports = {
    lintOnSave: false,
    devServer: {
        disableHostCheck: false,
        host: "localhost",
        port: 8085,
        https: false,
        hotOnly: false,
        proxy: null
    },
    // chainWebpack:config =>{
    //     config.when(process.env.NODE_ENV ==='production',config =>{
    //         config.entry('app').clear().add('./src/mian-prod.js')
    //     })
    //     config.when(process.env.NODE_ENV ==='devlopment',config =>{
    //         config.entry('app').clear().add('./src/mian.js')
    //     })
    // }

   
}