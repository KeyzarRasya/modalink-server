const envConfig = (env) => {
    let PORT, DATABASE, URI;
    PORT=env.PORT;
    if(env.ENV == "LOCAL"){
        DATABASE=env.MONGODB_LOCAL;
    }
    return {PORT, DATABASE, URI};
}

module.exports = {envConfig};