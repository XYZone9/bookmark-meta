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
    obj[key.replace(/\.json$/ig, '')] = `${raw_root}/${REPOSITORY_NAME}/${key}`;
    return obj;
}, {});

cp.execSync(`cp -R ${REPOSITORY_ROOT} ${path.join(BUILD_ROOT, REPOSITORY_NAME)}`);

fs.writeFileSync(MANIFEST_FILE, JSON.stringify({
    version: pkgInfo.version,
    repository: menifestRepo,
}));
