const fs = require('fs')
const glob = require('glob')
const sharedPackageJson = require('./package.json');
const BasePackage = require('./vendor/hanbiro/base/package.json');

const mergePackages = (module) => {
    Object.assign(BasePackage.dependencies, module.dependencies);
    Object.assign(BasePackage.devDependencies, module.devDependencies);
    Object.assign(BasePackage.scripts, module.scripts);
}

mergePackages(sharedPackageJson);

//-- scan packages project
glob.sync('./packages/*/package.json').forEach(config => {
    let module = require(config);
    mergePackages(module);
});

fs.writeFileSync('./package.json', JSON.stringify(BasePackage, null, 2))
