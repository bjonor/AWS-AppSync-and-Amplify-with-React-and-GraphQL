const graphql = require('graphql');
const ld = require('lodash');

const usersData = [
    { id: '1', name: 'John Doe', age: 35 },
    { id: '2', name: 'Jane Doe', age: 32 },
    { id: '3', name: 'Jack Doe', age: 10 },
];

const hobbyData = [
    { id: '1', title: 'Programming', description: 'Programming is fun!', userId: '1' },
    { id: '2', title: 'Reading', description: 'Reading is fun!', userId: '3' },
    { id: '3', title: 'Swimming', description: 'Swimming is fun!', userId: '3' },
];

const postData = [
    { id: '1', comment: 'This is comment 1', userId: '1' },
    { id: '2', comment: 'This is comment 2', userId: '1' },
    { id: '3', comment: 'This is comment 3', userId: '5' },
];

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
} = graphql;

const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'Documentation for user...',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        hobbies: { type: new GraphQLList(HobbyType),
            resolve(parent, args) {
                return ld.filter(hobbyData, { userId: parent.id });
            }
        },
        posts: { type: new GraphQLList(PostType),
            resolve(parent, args) {
                return ld.filter(postData, { userId: parent.id });
            }
        },
    }),
});

const HobbyType = new GraphQLObjectType({
    name: 'Hobby',
    description: 'Documentation for hobby...',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        user: { type: UserType,
            resolve(parent, args) {
                return ld.find(usersData, { id: parent.userId });
            }
        },
    }),
});

const PostType = new GraphQLObjectType({
    name: 'Post',
    description: 'Documentation for post...',
    fields: () => ({
        id: { type: GraphQLID },
        comment: { type: GraphQLString },
        user: { type: UserType,
            resolve(parent, args) {
                return ld.find(usersData, { id: parent.userId });
            }
        },
    }),
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Description',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return ld.find(usersData, { id: args.id });
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return usersData;
            }
        },
        hobby: {
            type: HobbyType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return ld.find(hobbyData, { id: args.id });
            },
        },
        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args) {
                return hobbyData;
            }
        },
        post: {
            type: PostType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return ld.find(postData, { id: args.id });
            },
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return postData;
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: {
            type: UserType,
            args: {
                id: { type: GraphQLID },
                name: { type: GraphQLString },
                age: { type: GraphQLInt },
            },
            resolve(parent, args) {
                let user = {
                    id: args.id,
                    name: args.name,
                    age: args.age,
                }
                usersData.push(user);
                return user;
            }
        },
        createPost: {
            type: PostType,
            args: {
                id: { type: GraphQLID },
                comment: { type: GraphQLString },
                userId: { type: GraphQLID },
            },
            resolve(parent, args) {
                let post = {
                    id: args.id,
                    comment: args.comment,
                    userId: args.userId,
                }
                postData.push(post);
                return post;
            }
        },
        createHobby: {
            type: HobbyType,
            args: {
                id: { type: GraphQLID },
                title: { type: GraphQLString },
                description: { type: GraphQLString },
                userId: { type: GraphQLID },
            },
            resolve(parent, args) {
                let hobby = {
                    id: args.id,
                    title: args.title,
                    description: args.description,
                    userId: args.userId,
                }
                hobbyData.push(hobby);
                return hobby;
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});