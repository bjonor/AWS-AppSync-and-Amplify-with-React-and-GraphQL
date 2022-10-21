import {API, Auth} from "aws-amplify";
import {useState, useEffect} from "react";
import {listPosts, postsByUsername} from "../src/graphql/queries";
import {deletePost as deletePostMutation} from "../src/graphql/mutations";
import Link from "next/link";
import {withAuthenticator} from "@aws-amplify/ui-react";
import Moment from "moment";

const MyPosts = () => {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        fetchiePosts();
    }, []);

    async function fetchiePosts() {
        const { username, attributes: { sub } } = await Auth.currentAuthenticatedUser();
        const fullUsername = sub + "::" + username;
        const postData = await API.graphql({
            query: postsByUsername,
            variables: { username: fullUsername },
        });
        setPosts(postData.data.postsByUsername.items);
    }

    async function deletePost(id) {
        await API.graphql({
            query: deletePostMutation,
            variables: { input: {id} },
            authMode: "AMAZON_COGNITO_USER_POOLS",
        });
        fetchiePosts();
    }

    return (
        <div>
            {
                posts.map((post, index) => (
                    <div key={index} className='py-8 px-8 max-w-xxl mx-auto bg-white rounded-xl shadow-lg space-y-2 sm:py-1 sm:flex sm:items-center sm:space-y-0 sm:space-x-6 mb-2'>
                        <div className='text-center space-y-2 sm:text-left'>
                            <div className='space-y-0.5'>
                                <p className='text-lg text-black font-semibold'>{post.title}</p>
                                <p className='text-slate-500 font-medium'>
                                    Created on: {Moment(post.createdAt).format("ddd, MMM hh:mm a")}
                                </p>
                            </div>
                            <div className='sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-1'>

                                <p className='px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2'>
                                    <Link href={`/edit-post/${post.id}`}>Edit Post</Link>
                                </p>

                                <p className='px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-purple-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2'>
                                    <Link href={`/post/${post.id}`}>View Post</Link>
                                </p>

                                <button className='text-sm mr-4 text-red-500' onClick={() => deletePost(post.id)}>Delete Post</button>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
};

export default withAuthenticator(MyPosts);
