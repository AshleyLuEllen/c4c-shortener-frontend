import React from 'react';
import Link from 'next/link'
require('dotenv').config();

function HomePage() {
    return (
        <ul>
            <h1>Home Page (C4C Shortener)</h1>
            <li>
                <Link href="/login">
                    <a>Login</a>
                </Link>
            </li>
            <li>
                <Link href="/logout">
                    <a>Logout</a>
                </Link>
            </li>
        </ul>
    )
}

export default HomePage