const graphql = require('graphql');
const ld = require('lodash');

const User = require('../model/user');
const Hobby = require('../model/hobby');
const Post = require('../model/post');

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
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
                return Post.find({userId: parent.id});
            }
        },
        posts: { type: new GraphQLList(PostType),
            resolve(parent, args) {
                return Hobby.find({userId: parent.id});
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
                return User.findById(parent.userId);
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
                return User.findById(parent.userId);
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
                return User.findById(args.id);
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({});
            }
        },
        hobby: {
            type: HobbyType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Hobby.findById(args.id);
            },
        },
        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args) {
                return Hobby.find({});
            }
        },
        post: {
            type: PostType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Post.findById(args.id);
            },
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return Post.find({});
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
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: GraphQLInt },
            },
            resolve(parent, args) {
                let user = User({
                    name: args.name,
                    age: args.age,
                });
                return user.save();
            }
        },
        updateUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                age: { type: GraphQLInt },
            },
            resolve(parent, args) {
                return User.findByIdAndUpdate(args.id, {
                    $set: {
                        name: args.name,
                        age: args.age,
                    }
                }, { new: true });
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                return User.findByIdAndRemove(args.id);
            }
        },
        createPost: {
            type: PostType,
            args: {
                comment: { type: GraphQLString },
                userId: { type: new GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                let post = Post({
                    comment: args.comment,
                    userId: args.userId,
                });
                return post.save();
            }
        },
        updatePost: {
            type: PostType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                comment: { type: GraphQLString },
            },
            resolve(parent, args) {
                return Post.findByIdAndUpdate(args.id, {
                    $set: {
                        comment: args.comment,
                    }
                }, { new: true });
            }
        },
        deletePost: {
            type: PostType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                return Post.findByIdAndRemove(args.id);
            }
        },
        createHobby: {
            type: HobbyType,
            args: {
                title: { type: GraphQLString },
                description: { type: GraphQLString },
                userId: { type: new GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                let hobby = Hobby({
                    title: args.title,
                    description: args.description,
                    userId: args.userId,
                });
                return hobby.save();
            }
        },
        updateHobby: {
            type: HobbyType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                title: { type: GraphQLString },
                description: { type: GraphQLString },
            },
            resolve(parent, args) {
                return Hobby.findByIdAndUpdate(args.id, {
                    $set: {
                        title: args.title,
                        description: args.description,
                    }
                }, { new: true });
            }
        },
        deleteHobby: {
            type: HobbyType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args) {
                return Hobby.findByIdAndRemove(args.id);
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});