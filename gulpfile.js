var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    clean = require('gulp-clean'),
    mincss = require('gulp-mini-css'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    fs = require('fs'),
    path = require('path');

var livereload = require('gulp-livereload'),
    express = require('express'),
    openurl = require('openurl');

var config = require('./shark-deploy-conf.json');

var appConfig = config;
// webapp
var webappDir = appConfig.webapp;
// mock dir
var mockDir = appConfig.mock;
// build dir
var buildDir = appConfig.build;
var buildWebappDir = path.join(buildDir, appConfig.buildWebapp);
var buildStaticDir = path.join(buildDir, appConfig.buildStatic);
// path
var cssPath = appConfig.cssPath;
var imgPath = appConfig.imgPath;
var jsPath = appConfig.jsPath;
var htmlPath = appConfig.htmlPath;
var ajaxPath = appConfig.ajaxPrefix;
var scssPath = appConfig.scssPath;
 
function findAllPagejs(html) {
    var reg = /src=['"](\/js\/[a-z,A-Z,0-9,\/]+\.page\.js)["']/g;
    var list = [];
    while(true) {
        var matches = reg.exec(html);
        if(matches) {
            list.push(matches[matches.length - 1]);
        } else {
            return list;
        }
    }
}

/**
 * 插入livereload.js到html中 
 * 这个里面是一个websocket模式，会跟服务器保持长连接
 * 当服务器数据变化的时候，通知websocket 浏览器端，请求对应的文件
 * livereload.js文件会向服务器建立一个websocket的连接
 * 因为服务器端不能主动把css文件给浏览器端 一定要浏览器端主动请求
 * @param  {string} html 需要处理的内容
 * @return {string}      处理后的结果
 */
function injectHtml(html) {
    var index = html.lastIndexOf('</body>');
    if (index !== -1) {
        // 如果有 .page.js,注入一下到html中
        var pageJss = findAllPagejs(html);
        var list = [];
        for (var i = 0; i < pageJss.length; i++) {
            list.push('\n<script type="text/javascript">seajs.use("' + pageJss[i] + '");</script>\n');
        };
        var script1 = list.join('');
        var script2 = '\n<script>document.write(\'<script src="http://\' + (location.host || \'localhost\').split(\':\')[0] + \':' + appConfig.port + '/livereload.js?snipver=1"></\' + \'script>\')</script>\n';

        return html.substr(0, index) + script1 + script2 + html.substr(index);
    } else {
        return html;
    }
}

function headerStatic(staticPath, headers) {
    return function(req, res, next) {
        //console.log(req.path);
        var reqPath = req.path === '/' ? '/index' : req.path;
        var f = path.join(staticPath, reqPath);
        //console.log(f);
        if (fs.existsSync(f)) {
            if (headers) {
                for (var h in headers) {
                    res.set(h, headers[h]);
                }
            }
            if(req.originalUrl.indexOf('/xhr/file/upload.json')==0){
                console.log('文件上传用text/html...');
                res.set('Content-Type', 'text/html');
                res.send(injectHtml(fs.readFileSync(f, 'UTF-8')));
            }
            // 处理html格式
            else if (/\.html$/.test(reqPath)) {
                res.set('Content-Type', 'text/html');
                // 文本文件
                res.send(injectHtml(fs.readFileSync(f, 'UTF-8')));
            } else {
                if (/\.js$/.test(reqPath)) {
                    res.set('Content-Type', 'text/javascript');
                    res.send(fs.readFileSync(f, 'UTF-8'));
                } else if (/\.css$/.test(reqPath)) {
                    res.set('Content-Type', 'text/css');
                    res.send(fs.readFileSync(f, 'UTF-8'));
                } else {
                    res.send(fs.readFileSync(f));
                }
            }
        } else {
            if (reqPath !== '/livereload.js') {
                // console.warn('Not Found: ' + f);
            }
            next();
        }
    }
}

gulp.task('clean', function() {
    return  gulp.src(buildDir,{read: false})
        .pipe(clean());
});

gulp.task('mincss', ['clean'], function(){
    gulp.src(path.join(webappDir, cssPath,'**'))
        .pipe(gulpif('*.map', mincss())) //压缩css
        .pipe(concat('all.min.css'))//合并css
        .pipe(gulp.dest(path.join(buildWebappDir,cssPath)));
})

gulp.task('minjs',['mincss'],function(){
    gulp.src(path.join(webappDir, jsPath, '**'))
        .pipe(uglify()) //压缩js
        .pipe(concat('all.min.js'))//合并js
        .pipe(gulp.dest( path.join(buildWebappDir,jsPath)));
})
gulp.task('default', function(){
    console.log("gulp successfully runs~~~");
});

gulp.task('serve',function(){
    var app = express();
     // html
    app.use(appConfig.contextPath, headerStatic(webappDir, {}));

    app.listen(appConfig.port, function(err) {
        if (err) {
            return console.log(err);
        }
        // 设置了默认打开页面
        if (appConfig.openurl) {
            openurl.open(appConfig.openurl);
        }

        console.log('listening on %d', appConfig.port);
    });
})