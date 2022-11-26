import { createTemplateAction } from '@backstage/plugin-scaffolder-backend';
import { exec } from 'child_process';

export function createRunProjenAction() {
  return createTemplateAction<{ projectType?: string }>({
    id: 'run:projen',
    description: 'Runs Projen',
    async handler(ctx) {
      try {
        ctx.input.projectType
          ? await runShellCommand(`npx projen@latest new ${ctx.input.projectType} --package-manager NPM --outdir "${ctx.workspacePath}"`)
          : await runShellCommand(`cd "${ctx.workspacePath}" && npm i ts-node@10 && npx projen@latest`);
      } catch (e) {
        console.error(e);
      }
    }
  });
}

const runShellCommand = async (cmd: string) =>
  new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      error ? reject(error) : resolve(stdout? stdout : stderr);
    });
  });
