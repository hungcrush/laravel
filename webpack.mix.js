let glob = require('glob');
let mix  = require('laravel-mix');
let path = require('path');
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

const getConfigName = (path) => {
    let name = path.split('/');

    return name[name.length - 2];
}

const mixingModule = (moduleConfig, name) => {
    if(moduleConfig.sources) {
        moduleConfig.sources.map(mixData => {
            let method = getFileExtension(mixData[0]);
            mix = mix[method]( (mixData[0].match(/base|acl|core/) ? 'vendor/hanbiro/base/' : 'packages/' + name + '/') + mixData[0], publicPath + mixData[1]);
        })
    }
}

/*
 |--------------------------------------------------------------------------
 | Config webpack variables
 |--------------------------------------------------------------------------
 */

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
const alias = {

};

const modules = [
    'node_modules'
];

/*
 |--------------------------------------------------------------------------
 | Modules
 |--------------------------------------------------------------------------
 */
const scanedModules = [];

let Base = require('./vendor/hanbiro/base/webpack.config.js');


//-- scan packages project
glob.sync('./packages/*/webpack.config.js').forEach(config => {
    let module = require(config);
    let name = getConfigName(config);

    if(module.alias) {
        Object.keys(module.alias).map(al => {
            alias[al] = path.resolve(__dirname, 'packages/' + name + '/' + module.alias[al]);
        });
        console.log(alias);
    }

    scanedModules.push({module, name});
});


/**
 * -------------
 * Exect packages
 * ----------------------------
 */

mix.webpackConfig({
    externals,
    resolve: {
        alias,
        extensions: ['.js'],
        modules
    }
});
// Base mixing
mixingModule(Base);

scanedModules.map((Module) => {
    mixingModule(Module.module, Module.name);
})