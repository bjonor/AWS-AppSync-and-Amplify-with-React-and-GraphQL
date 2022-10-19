const express = require('express');
const { graphqlHTTP } = require('express-graphql');

const schema = require('./schema/schema');

const app = express();

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema,
}));

const port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}!`));
