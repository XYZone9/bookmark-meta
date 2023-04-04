console.info('generate...');

const pkgInfo = require('../package.json');
const raw_root = pkgInfo.raw_root;

const fs = require('fs-extra');
const cp = require('child_process');
const path = require('path');

const REPOSITORY_NAME = 'repository';
const REPOSITORY_ROOT = path.join(__dirname, '../', REPOSITORY_NAME);
const BUILD_ROOT = path.join(__dirname, '../', 'build');
const MANIFEST_FILE = path.join(BUILD_ROOT, 'manifest.json');

const repository = fs.readdirSync(REPOSITORY_ROOT);

console.info('repository:', repository);

const REPOSITORY_DIST = path.join(BUILD_ROOT, REPOSITORY_NAME);
if (fs.existsSync(REPOSITORY_DIST)) { // 清空
    fs.removeSync(REPOSITORY_DIST);
}
fs.ensureDirSync(REPOSITORY_DIST);

// cp.execSync(`cp -R ${REPOSITORY_ROOT} ${REPOSITORY_DIST}`); // 全量复制

const MENIFEST_KEYS = ['name', 'descrption', 'type', 'version'];

const menifestRepo = repository.reduce((obj, key) => {
    const originalFilepath = path.join(REPOSITORY_ROOT, key);
    let json = null;
    if (fs.statSync(originalFilepath).isDirectory()) { // script
        key = `${key}.json`; // fixed key
        const scriptManifest = path.join(originalFilepath, 'manifest.json');
        json = fs.readJSONSync(scriptManifest);
        const scriptFilepath = path.join(originalFilepath, 'index.js');
        json.script = fs.readFileSync(scriptFilepath, 'utf-8'); // 脚本赋值
    } else {
        json = fs.readJSONSync(originalFilepath);
    }
    const distFilepath = path.join(REPOSITORY_DIST, key); // dist
    const host = json.host || key.replace(/\.json$/ig, '');
    json.host = host;
    console.info('json:', json);
    fs.writeFileSync(distFilepath, JSON.stringify(json), 'utf-8')
    obj[host] = {
        ...MENIFEST_KEYS.reduce((obj, k) => {
            obj[k] = json[k];
            return obj;
        }, {}),
        // name: json.name,
        // descrption: json.descrption,
        url: `${raw_root}/${REPOSITORY_NAME}/${key}`,
    };
    return obj;
}, {});

if (fs.existsSync(MANIFEST_FILE)) {
    fs.removeSync(MANIFEST_FILE);
}
fs.writeFileSync(MANIFEST_FILE, JSON.stringify({
    version: pkgInfo.version,
    repository: menifestRepo,
}));
