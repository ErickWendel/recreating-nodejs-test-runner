const isTestEnv = process.env.NODE_ENV === 'test'
const reply = (res, { code = 200, data, headers = { 'Content-Type': 'application/json' } }) => {
    res.writeHead(code, headers);
    res.end(JSON.stringify(data));
};

const log = (...args) => {
    if (isTestEnv) return;
    console.log(...args)
}

const error = (...args) => {
    if (isTestEnv) return;
    console.error(...args)
}
const logger = {
    info: log,
    error,
}


export {
    reply,
    logger,
    isTestEnv,
}