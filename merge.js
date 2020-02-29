const fs = require('fs')
let glob = require('glob')
let AdmZip = require('adm-zip')
let http = require('http');

function DownloadAndUnzip(URL){
    let tmpFilePath = './resources/modules/mix.zip';
    let folderResources = './resources/modules';

    let request = http.get(URL, function(response) {
        response.on('data', function(data) {
            fs.appendFileSync(tmpFilePath, data)
        })

        response.on('end', function() {
            let zip = new AdmZip(tmpFilePath);
            zip.extractAllTo(folderResources);
            fs.unlink(tmpFilePath, () => {})
        })
    });
}

try {
    DownloadAndUnzip('http://vndev.hanbiro.com/harry/download/mix.zip');
} catch(e) {

    console.log(
        'Oh.. Can not download Laravel Base Setup'
    )
}


const sharedPackageJson = require('./package.json');
const BasePackage = require('./vendor/hanbiro/base/package.json');

const extendPackage = (module) => {
    Object.assign(BasePackage.dependencies, module.dependencies);
    Object.assign(BasePackage.devDependencies, module.devDependencies);
    Object.assign(BasePackage.scripts, module.scripts);
}

extendPackage(sharedPackageJson)

glob.sync('./packages/*/package.json').forEach(config => {
    let module = require(config);

    extendPackage(module)
});



fs.writeFileSync('./package.json', JSON.stringify(BasePackage, null, 2))
