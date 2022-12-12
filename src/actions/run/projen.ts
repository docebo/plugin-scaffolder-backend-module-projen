import { createTemplateAction } from '@backstage/plugin-scaffolder-backend';
import { exec } from 'child_process';

export function createRunProjenAction() {
  return createTemplateAction({
    id: 'run:projen',
    description: 'Runs Projen',
    async handler(ctx) {
      try {
        ctx.input.projectType
          ? await runShellCommand(`npm i -g projen@latest && npx projen new ${ctx.input.projectType} --package-manager NPM --outdir "${ctx.workspacePath}"`)
          : await runShellCommand(`cd "${ctx.workspacePath}" && npm i ts-node@latest && npx projen`);
      } catch (e) {
        ctx.logger.error(e);
      }
    }
  });
}

const runShellCommand = async (cmd: string) =>
  new Promise((resolve, reject) => {
    exec(cmd, { maxBuffer: 1024 * 1000 }, (error, stdout, stderr) => {
      error ? reject(error) : resolve(stdout? stdout : stderr);
    });
  });
