import chalk from "chalk";

export const logger = {
  info(message) {
    console.log(message);
  },
  success(message) {
    console.log(chalk.green(message));
  },
  warn(message) {
    console.log(chalk.yellow(message));
  },
  error(message) {
    console.error(chalk.red(message));
  },
  headline(message) {
    console.log(chalk.cyan(`\n${message}\n`));
  },
};
