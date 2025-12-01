/**
 * Installation Husky conditionnelle (ignore si pas de dépôt Git).
 */
const { existsSync } = require('fs');
const { resolve } = require('path');
const { spawnSync } = require('child_process');

const backendDir = resolve(__dirname, '..');
const repoRoot = resolve(backendDir, '..');
const gitDir = resolve(repoRoot, '.git');

if (!existsSync(gitDir)) {
	console.log('[husky] Dépôt Git introuvable, installation ignorée.');
	process.exit(0);
}

const result = spawnSync('npx', ['husky', 'install'], {
	cwd: repoRoot,
	stdio: 'inherit',
	shell: true,
});

process.exit(result.status ?? 0);



