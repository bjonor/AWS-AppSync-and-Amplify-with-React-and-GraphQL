import { useEffect, useState, useRef } from "react";
import { API, Storage } from "aws-amplify";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
    ssr: false,
});
// import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { updatePost } from "../../src/graphql/mutations";
import { getPost } from "../../src/graphql/queries";
import { v4 as uuid } from "uuid";

export default function EditPost() {
    const [post, setPost] = useState(null);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        fetchPost();
    }, [fetchPost, id]);

    async function fetchPost() {
        if (!id) return;
        const postData = await API.graphql({ query: getPost, variables: { id } });
        setPost(postData.data.getPost);
    }

    if (!post) return null;

    async function onChange(e) {
        setPost(() => ({ ...post, [e.target.name]: e.target.value }));
    }

    const { title, content } = post;

    async function updateCurrentPost() {
        if (!title || !content) {
            return;
        }
        const postUpdated = {
            id,
            content,
            title,
        }
        await API.graphql({
            query: updatePost,
            variables: { input: postUpdated },
            authMode: "AMAZON_COGNITO_USER_POOLS",
        });
        router.push(`/my-posts`);
    }

    return (
        <div>
            <h1 className="text-3xl font-semibold tracking-wide mt-6">Edit Post</h1>
            <input onChange={onChange} name="title" placeholder="Title" value={post.title}
                className="border-b text-lg y-2"/>
            <SimpleMDE onChange={value => setPost({ ...post, content: value })} value={post.content} />
            <button onClick={updateCurrentPost} className="px-4 py-1 text-sm font-semibold tracking-wide text-white bg-blue-500 rounded hover:bg-blue-600">Update Post</button>
        </div>
    );
}