import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const LINKS = [
    { href: "https://github.com/rileygramlich", label: "GitHub", Icon: FaGithub },
    { href: "https://www.linkedin.com/in/rileygramlich/", label: "LinkedIn", Icon: FaLinkedin },
    { href: "https://x.com/rileygramlich", label: "X", Icon: FaXTwitter },
];

export default function About() {
    return (
        <section className="page page--narrow prose">
            <p className="kicker">About</p>
            <h1>A note from the developer</h1>
            <p>
                Hi, I'm Riley Gramlich, a software developer from Alberta, Canada. Scribist came out of wanting one place to
                write and edit documents, push out more words in less time with Berserk Mode (which I used to write this),
                and test my typing speed in a fun way.
            </p>
            <p>
                Docs are live and collaborative: share a doc's link with someone and you'll see each other's changes as you type.
            </p>
            <p>
                If you notice bugs or have ideas for what you'd like to see next, I'd love to hear them. Send me a message on{" "}
                <a href="https://www.linkedin.com/in/rileygramlich/" target="_blank" rel="noopener noreferrer">LinkedIn</a> or{" "}
                <a href="https://x.com/rileygramlich" target="_blank" rel="noopener noreferrer">X</a>. Thanks for writing here.
            </p>
            <p className="signoff">— <a href="https://rileygramlich.dev" target="_blank" rel="noopener noreferrer">Riley Gramlich</a></p>
            <ul className="socials">
                {LINKS.map(({ href, label, Icon }) => (
                    <li key={label}>
                        <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}><Icon /></a>
                    </li>
                ))}
            </ul>
        </section>
    );
}
