'use strict';

const path = require('path');
const util = require('util');
const Transform = require('stream').Transform;
const childProcess = require('child_process');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const gulp = require('gulp');
const gutil = require('gulp-util');
const changed = require('gulp-changed');
const babel = require('gulp-babel');
const browserSync = require('browser-sync');
const piping = require('piping');

const productionAssets = !!process.env.CIRCLE_ARTIFACTS;
const assets = process.env.CIRCLE_ARTIFACTS || 'dist/assets';
const env = {
    FB_ID: '217061478659410',
    GOOGLE_ID: '560563572238-0r0uacv3kh94sl6n6nnibsk85bf097ej.apps.googleusercontent.com',
    NODE_ENV: process.env.NODE_ENV || 'development',
    BACKEND_HOST: 'api.bogie.leops.me',
    BACKEND_PORT: '80',
    CDN_URL: productionAssets ? `https://cdn.bogie.leops.me/${process.env.CIRCLE_SHA1}` : 'http://localhost:3000'
};

const sources = {
    babel: ['src/**/*.js', 'web/**/*.js'],
    assets: ['src/assets/**/*', 'android/app/build/outputs/apk/app-*.apk']
};

const babelPlugins = [
    path.resolve(__dirname, './scripts/babelRelayPlugin')
];
const wpPlugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NormalModuleReplacementPlugin(/^\.\/(assets|components|mutations)\/[a-z]/, result => {
        if (result.context.match(/web/) !== null) {
            result.request = result.request.substr(2);
        }
    }),
    new webpack.DefinePlugin(
        Object.keys(env).reduce((carry, key) => {
            carry[`process.env.${key}`] = JSON.stringify(env[key]);
            return carry;
        }, {})
    )
];

const config = {
    devtool: productionAssets ? undefined : 'source-map',
    entry: productionAssets ? [
        'babel-polyfill',
        './index'
    ] : [
        'babel-polyfill',
        'react-hot-loader/patch',
        'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
        './index'
    ],
    resolve: {
        root: [
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, 'web')
        ],
        alias: {
            'react-native': 'react-native-web'
        }
    },
    externals: [{
        google: 'var gapi',
        fb: 'var FB'
    }],
    plugins: productionAssets ? wpPlugins.concat([
        new webpack.optimize.UglifyJsPlugin({
            comments: false,
            compress: {
                unsafe: true,
                collapse_vars: true,
                keep_fargs: false,
                warnings: false
            }
        })
    ]) : wpPlugins.concat([
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]),
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/,
            query: {
                presets: ['es2015', 'stage-0', 'react'],
                plugins: babelPlugins
            }
        }, {
            test: /\.(gif|jpe?g|png|svg)$/,
            loader: 'url-loader',
            query: {
                name: '[name].[hash:16].[ext]'
            }
        }, {
            test: /\.css?$/,
            loaders: ['style', 'raw']
        }]
    },
    output: {
        path: path.resolve(__dirname, assets),
        filename: 'bundle.js',
        publicPath: '/'
    }
};

gulp.task('client', () =>
    gulp.src('src/client.js')
        .pipe(webpackStream(config))
        .pipe(gulp.dest(assets))
);

gulp.task('watch', () => {
    gulp.watch(sources.assets, ['assets']);
    gulp.watch(sources.babel, ['babel']);
});

gulp.task('babel', () =>
    gulp.src(sources.babel)
        .pipe(changed('./dist/'))
        .pipe(babel({
            presets: ['stage-0', 'react'],
            plugins: [
                'transform-es2015-destructuring',
                'transform-es2015-modules-commonjs',
                'transform-es2015-parameters',
                'transform-es2015-unicode-regex'
            ].concat(babelPlugins)
        }))
        .pipe(gulp.dest('./dist/'))
);

gulp.task('server', ['babel'], () => {
    piping({
        main: 'dist/server.js',
        hook: true,
        throw: false,
        env: Object.assign({
            CLIENT_ID: 'fe0a8abb-8802-4ac0-9492-d5bcfbe072fe',
            CLIENT_SECRET: 'MQMm7jVTpuef8qEb',
            PORT: 5000
        }, env)
    });
});

const beforeAssets = [];
/*if (productionAssets) {
    beforeAssets.push('assemble:release')
}*/

gulp.task('assets', beforeAssets, () =>
    gulp.src(sources.assets)
        .pipe(changed(assets))
        .pipe(gulp.dest(assets))
        .pipe(browserSync.reload({
            stream: true
        }))
);

gulp.task('cdn', ['assets', 'server'], () => {
    const compiler = webpack(config);
    browserSync({
        proxy: 'localhost:5000',
        serveStatic: ['./dist/assets'],
        middleware: [
            webpackMiddleware(compiler, {
                noInfo: true,
                publicPath: config.output.publicPath
            }),
            webpackHotMiddleware(compiler, {
                log: console.log.bind(console),
                path: '/__webpack_hmr',
                heartbeat: 10 * 1000
            })
        ]
    });
});

class PrefixStream extends Transform {
    constructor(options) {
        if (typeof options === 'string') {
            options = {
                prefix: options
            };
        }

        options.decodeStrings = false;
        super(options);

        this.prefix = options.prefix;
    }

    _transform(chunk, encoding, done) {
        done(null, chunk.toString()
            .split(/\n+/)
            .map(line => `[${this.prefix}] ${line}`)
            .join('\n') + '\n'
        );
    }
}

gulp.task('assemble:release', done => {
    const proc = childProcess.exec(`${path.resolve(__dirname, 'android/gradlew')} assembleRelease`, {
        cwd: path.resolve(__dirname, 'android')
    }, err => {
        console.error(err);
        done();
    });

    proc.stdout
        .pipe(new PrefixStream('assemble:release'))
        .pipe(process.stdout);
    proc.stderr
        .pipe(new PrefixStream('assemble:release'))
        .pipe(process.stderr);
});

gulp.task('run:android', done => {
    const proc = childProcess.exec(`${path.resolve(__dirname, 'node_modules/.bin/react-native')} run-android`, err => {
        console.error(err);
        done();
    });

    proc.stdout
        .pipe(new PrefixStream('run:android'))
        .pipe(process.stdout);
    proc.stderr
        .pipe(new PrefixStream('run:android'))
        .pipe(process.stderr);
});

gulp.task('mobile:start', done => {
    const proc = childProcess.exec(`${path.resolve(__dirname, 'node_modules/.bin/react-native')} start`, err => {
        console.error(err);
        done(err);
    });

    proc.stdout
        .pipe(new PrefixStream('mobile:start'))
        .pipe(process.stdout);
    proc.stderr
        .pipe(new PrefixStream('mobile:start'))
        .pipe(process.stderr);
});

gulp.task('mobile', ['mobile:start', 'run:android']);
gulp.task('web', ['cdn', 'watch']);
gulp.task('default', ['web', 'mobile']);
