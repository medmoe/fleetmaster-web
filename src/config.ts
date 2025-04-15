const ENV = {
    dev: {
        API: "http://localhost:8000/",
    },
    prod: {
        API: "http://fleet-master-back-env.eba-gvt2xidk.us-east-2.elasticbeanstalk.com/"
    }
};

const getEnvVars = (env = import.meta.env.VITE_NODE_ENV || import.meta.env.MODE || "development") => {
    if (env === "development") {
        return ENV.dev;
    } else if (env === "production") {
        return ENV.prod;
    }
    return ENV.dev;
}

export default getEnvVars;