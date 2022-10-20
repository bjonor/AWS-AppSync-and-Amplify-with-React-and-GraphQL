const express = require('express');
const { graphqlHTTP } = require('express-graphql');

// mongodb+srv://cloud0:<password>@cluster0.vfaapia.mongodb.net/?retryWrites=true&w=majority

const mongoose = require('mongoose');

const schema = require('./schema/schema');

const port = process.env.PORT || 4000;

const app = express();

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema,
}));

mongoose.connect(
    `mongodb+srv://${process.env.mongoUserName}:${process.env.mongoPassword}@cluster0.vfaapia.mongodb.net/${process.env.mongoDatabase}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => {
    app.listen(port, () => console.log(`Listening on port ${port}!`));
}).catch(err => console.log(err));


