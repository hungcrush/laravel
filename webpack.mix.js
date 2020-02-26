let glob = require('glob');
let mix  = require('laravel-mix');
/*
 |--------------------------------------------------------------------------
 | Hanbiro Asset Management
 |--------------------------------------------------------------------------
 */

const getFileExtension = (fileName) => {
    let ext = fileName.split('.');
    ext = ext[ext.length - 1];

    if(ext === 'scss') ext = 'sass';
    if(ext === 'js' || ext === 'jsx') ext = 'react';
    return ext;
}

const mixingModule = (module) => {
    if(module.sources) {
        sources.map(mixData => {
            let method = getFileExtension(mixData[0]);
            mix[method](resourcePath + mixData[0], publicPath + mixData[1]);
        })
    }
}

const resourcePath = 'vendor/hanbiro/';
const publicPath = 'public/assets/';

const externals = {
    'jquery': {
        'commonjs': 'jquery',
        'commonjs2': 'jquery',
        'amd': 'jquery',
        'root': '$'
    },
    'lodash': '_',
    "window": "window",
    'react': 'React',
    'react-dom': 'ReactDOM',
    'react-is': 'ReactIs',
    'prop-types': 'PropTypes',
    'moment': 'moment',
    'classnames': 'classNames'
};

mix.webpackConfig({
    externals
})
    .options({ extractVueStyles: true });

let Base = require('./vendor/hanbiro/base/webpack.config.js');
mixingModule(Base);

// scan packages project
glob.sync('./packages/*/webpack.config.js').forEach(config => {
    let ModuleConfig = require(config);
    mixingModule(ModuleConfig);
});
