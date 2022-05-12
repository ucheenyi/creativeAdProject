const env = process.env.NODE_ENV || 'development';
console.log('Env *****',env);

if(env === 'development') {
    process.env.PORT = 6000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/PeopleAPI';
} else if (env === 'test') {
    process.env.PORT = 7000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/PeopleAPITest';
}