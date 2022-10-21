import { useState, useEffect} from "react";
import { API } from "aws-amplify";
import { listPosts } from "../src/graphql/queries";
import Link from "next/link";

export default function Home() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchPosts();
    }, []);

    async function fetchPosts() {
        const postData = await API.graphql({ query: listPosts });
        setPosts(postData.data.listPosts.items);
    }

    return (
        <div>
            <h1 className="text-sky-400 tracking-wide mt-6 mb-2 text-3xl">My Blog</h1>
            {
                posts.map((post, index) => (
                    <Link href={`/post/${post.id}`} key={index}>
                    <div className="cursor-pointer border-b border-gray-300 mt-8">
                        <h2>{post.title}</h2>
                    </div>
                    </Link>
                ))
            }
        </div>
    )
}
