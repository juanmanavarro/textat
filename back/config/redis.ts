const options = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  retryAttempts: 20,
  retryDelay: 3000,
  db: Number(process.env.QUEUES_REDIS_DB),
};
if ( process.env.REDIS_PASSWORD ) {
  Object.assign(options, { password: process.env.REDIS_PASSWORD, tls: {}, });
}

export default options;
