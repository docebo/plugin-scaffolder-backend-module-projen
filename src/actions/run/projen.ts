import { createTemplateAction } from '@backstage/plugin-scaffolder-backend';
import { exec } from 'child_process';

export function createRunProjenAction() {
  return createTemplateAction({
    id: 'run:projen',
    description: 'Runs Projen',
    async handler(ctx) {
      ctx.logger.info(ctx.input.projectType);
      ctx.logger.info(JSON.stringify(ctx.input));
      ctx.logger.info(JSON.stringify(ctx.workspacePath));
      try {
        ctx.logger.info('----start');
        ctx.input.projectType
          ? await runShellCommand(`npx projen@latest new ${ctx.input.projectType} --package-manager NPM --outdir "${ctx.workspacePath}"`)
          : await runShellCommand(`cd "${ctx.workspacePath}" && npm i ts-node@latest && npx projen@latest`);
        ctx.logger.info('----end');
      } catch (e) {
        ctx.logger.error(e);
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
