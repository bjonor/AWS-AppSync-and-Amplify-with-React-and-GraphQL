import { withAuthenticator } from "@aws-amplify/ui-react";
import { useState, useRef, React} from "react";
import { API, Storage } from "aws-amplify";
import {useRouter} from "next/router";
import { v4 as uuid } from "uuid";
import { createPost as createPostQuery } from "../src/graphql/mutations";


// import SimpleMDE from "react-simplemde-editor";
import dynamic from "next/dynamic";
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });

import "easymde/dist/easymde.min.css";

const initialFormState = { title: '', content: '' }

const CreatePost = () => {
    const [post, setPost] = useState(initialFormState);
    const { title, content } = post;
    const router = useRouter();

    const [image, setImage] = useState(null);

    function onChange(e) {
        setPost(() => ({ ...post, [e.target.name]: e.target.value }))
    }

    async function createPost() {
        if (!title || !content) return;
        post.id = uuid();

        if (image) {
            const filename = `${image.name}_${uuid()}`;
            post.coverImage = filename;
            await Storage.put(filename, image);
        }

        await API.graphql({
            query: createPostQuery,
            variables: { input: post },
            authMode: "AMAZON_COGNITO_USER_POOLS",
        });
        router.push(`/post/${post.id}`);
    }
    return (
        <div>
            <h1 className="text-3xl font-semibold tracking-wide">Create Post</h1>
            <input onChange={onChange}
                   name="title"
                   placeholder="Title"
                   value={post.title}
                   className="border border-gray-300 p-2 rounded-lg my-2 w-full" />
            <SimpleMDE onChange={value => setPost({ ...post, content: value })}
                       value={post.content} />
            <button type="button"
                    className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg"
                    onClick={createPost}>
                Create Post
            </button>
            <button type="button"
                    className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg"
                    onClick={uploadImage}>
                Upload Image
            </button>
        </div>
    );
};

export default withAuthenticator(CreatePost);