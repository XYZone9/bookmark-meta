console.info('generate...');

const pkgInfo = require('../package.json');
const raw_root = pkgInfo.raw_root;

const fs = require('fs');
const cp = require('child_process');
const path = require('path');

const REPOSITORY_NAME = 'repository';
const REPOSITORY_ROOT = path.join(__dirname, '../', REPOSITORY_NAME);
const BUILD_ROOT = path.join(__dirname, '../', 'build');
const MANIFEST_FILE = path.join(BUILD_ROOT, 'manifest.json');

const repository = fs.readdirSync(REPOSITORY_ROOT);

console.info('repository:', repository);

const menifestRepo = repository.reduce((obj, key) => {
    const jsonText = fs.readFileSync(path.join(REPOSITORY_ROOT, key), 'utf-8');
    const json = JSON.parse(jsonText);
    console.info('json:', json);
    obj[key.replace(/\.json$/ig, '')] = {
        name: json.name,
        descrption: json.descrption,
        url: `${raw_root}/${REPOSITORY_NAME}/${key}`,
    };
    return obj;
}, {});

const REPOSITORY_DIST = path.join(BUILD_ROOT, REPOSITORY_NAME);
if (fs.existsSync(REPOSITORY_DIST)) {
    cp.execSync(`rm -rf ${REPOSITORY_DIST}`);
}

cp.execSync(`cp -R ${REPOSITORY_ROOT} ${REPOSITORY_DIST}`);

if (fs.existsSync(MANIFEST_FILE)) {
    cp.execSync(`rm -f ${MANIFEST_FILE}`);
}
fs.writeFileSync(MANIFEST_FILE, JSON.stringify({
    version: pkgInfo.version,
    repository: menifestRepo,
}));
