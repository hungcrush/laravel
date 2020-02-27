const fs = require('fs')

const sharedPackageJson = require('./package.json');
const BasePackage = require('./vendor/hanbiro/base/package.json');

Object.assign(BasePackage.dependencies, sharedPackageJson.dependencies);
Object.assign(BasePackage.devDependencies, sharedPackageJson.devDependencies);
Object.assign(BasePackage.scripts, sharedPackageJson.scripts);

fs.writeFileSync('./package.json', JSON.stringify(BasePackage, null, 2))
