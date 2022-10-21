import Link from 'next/link'
import React from 'react'
import '../../configureAmplify'
import { useState, useEffect} from "react";
import { Auth, Hub } from "aws-amplify";

const Navbar = () => {
    const [signedUser, setSignedUser] = useState(false);

    useEffect(() => {
        authListener();
    }, []);

    async function authListener() {
        Hub.listen("auth", (data) => {
            switch (data.payload.event) {
                case "signIn":
                    return setSignedUser(true);
                case "signOut":
                    return setSignedUser(false);
                default:
                    return;
            }
        });
        try {
            await Auth.currentAuthenticatedUser();
            setSignedUser(true);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <nav className="flex justify-center navbar navbar-expand-lg navbar-light bg-light">
            {
                [
                    ["Home", "/",],
                    ["Create Post", "/create-post"],
                    ["My Profile", "/profile"],
                ].map(([title, url], index) => (
                    <Link href={url} key={index}>
                        <a className="rounded-lg px-3 py-2 text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-900">{title}</a>
                    </Link>
                ))
            }
            {
                signedUser && (
                    <Link href="/my-posts">
                        <a className="rounded-lg px-3 py-2 text-slate-700 font-medium hover:bg-slate-100 hover:text-slate-900">My Posts</a>
                    </Link>
                )
            }
        </nav>
    );
}

export default Navbar