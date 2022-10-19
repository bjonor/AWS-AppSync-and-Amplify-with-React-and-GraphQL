const graphql = require('graphql');

const usersData = [
    { id: '1', name: 'John Doe', age: 35 },
    { id: '2', name: 'Jane Doe', age: 32 },
    { id: '3', name: 'Jack Doe', age: 10 },
];

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
} = graphql;

const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'Documentation for user...',
    fields: () => ({
        id: { type: GraphQLID},
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Description',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                let user = {
                    id: '1',
                    name: 'John',
                    age: 25,
                }
                return user;
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});