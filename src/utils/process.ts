enum ApplicationExit {
  Exit,
  Interrupted,
  PidKill,
  Exception,
}

export const onExit = (callback: (reason: ApplicationExit) => void) => {
  process.on('exit', (code) => {
    callback(ApplicationExit.Exit);
    process.exit(code);
  });

  // ctrl+c
  process.on('SIGINT', () => {
    callback(ApplicationExit.Interrupted);
    process.exit(1);
  });

  // kill pid (for example: nodemon restart)
  const pidKillExit = () => {
    callback(ApplicationExit.PidKill);
    process.exit(2);
  };
  process.on('SIGUSR1', pidKillExit);
  process.on('SIGUSR2', pidKillExit);

  process.on('uncaughtException', (err) => {
    callback(ApplicationExit.Exception);
    console.log('Uncaught Exception...');
    console.log(err.stack);
    process.exit(9);
  });
};
