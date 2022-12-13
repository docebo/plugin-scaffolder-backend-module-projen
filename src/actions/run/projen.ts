import { createTemplateAction } from '@backstage/plugin-scaffolder-backend';
import { exec } from 'child_process';

export function createRunProjenAction() {
  return createTemplateAction({
    id: 'run:projen',
    description: 'Runs Projen',
    async handler(ctx) {
      const commands = ctx.input.projectType
        ? ['npm i -g projen@latest', `npx projen new ${ctx.input.projectType} --package-manager NPM --no-synth --outdir "${ctx.workspacePath}"`]
        : [`cd "${ctx.workspacePath}" && npm install ts-node@^10`, `cd "${ctx.workspacePath}" && npx projen`];

      try {
        for (const command of commands) {
          ctx.logger.info(`Command: ${command}`);
          const result = await runShellCommand(command);
          ctx.logger.info(`Result: ${result}`);
        }
      } catch (e) {
        ctx.logger.error(`Error: ${e}`);
      }
    }
  });
}

const runShellCommand = async (command: string) =>
  new Promise((resolve, reject) => {
    exec(command, { maxBuffer: 1024 * 1000 }, (error, stdout, stderr) => {
      error ? reject(error) : resolve(stdout ? stdout : stderr);
    });
  });
