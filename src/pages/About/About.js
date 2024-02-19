import React from "react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

import "./About.css";

export default function About() {
    return (
        <div className="About">
            <h1 className="title">About Scribist</h1>
            <div className="main-content">
                <h3 className="note">A note from the developer:</h3>
                <hr />
                <p className="about-content">
                    Hi, my name is Riley Gramlich. I am a full-stack software
                    developer from Alberta, Canada. I am passionate and
                    motivated to make useful applications such as this one.
                    Scribist was really born out of my desire to have an all in
                    one place to create and edit documents, use a feature like
                    Berserk mode to output more in less time (which I'm using
                    right now to write this), and to be able to test your typing
                    speed in a fun way!
                    <hr />
                    Scribist features web socket integration which allows you to
                    work collaboratively on a document with another user! Just
                    shoot them the URL and write away!
                    <hr />
                    As the creator of this web app, I am open to criticism and
                    feedback. If you notice any problems with the site, bugs,
                    etc, or have suggestions of what you'd like to see
                    implemented to improve it, please send me a message on{" "}
                    <Link
                        to="https://www.linkedin.com/in/rileygramlich/"
                        rel="noopener noreferrer"
                        target="_blank"
                        className="link"
                    >
                        LinkedIn
                    </Link>{" "}
                    or{" "}
                    <Link
                        to="https://twitter.com/rileygramlich"
                        rel="noopener noreferrer"
                        target="_blank"
                        className="link"
                    >
                        Twitter
                    </Link>{" "}
                    about it!
                    <hr />
                    If you enjoy Scribist, I'd love to connect with you! Below
                    you can find links to my LinkedIn and Twitter account. Also,
                    if you're interested in checking out other projects I've
                    worked on, be sure to check on my Portfolio and my Github
                    page (also linked below). Thanks for using Scribist and have
                    a wonderful day!
                    <hr />
                </p>
                <h4 className="sign">
                    ~{" "}
                    <Link
                        to="https://rileygramlich.github.io/riley-gramlich-portfolio/"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        Riley Gramlich
                    </Link>{" "}
                </h4>
            </div>
            <footer>
                <ul className="social-icon">
                    <li className="social-icon__item">
                        <div className="social-icon__link"></div>
                    </li>
                    <li className="social-icon__item">
                        <div className="social-icon__item">
                            <Link
                                to="https://www.linkedin.com/in/rileygramlich/"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                <FaGithub />
                            </Link>
                        </div>
                    </li>
                    <li className="social-icon__item">
                        <div className="social-icon__item">
                            <Link
                                to="https://www.linkedin.com/in/rileygramlich/"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                <FaLinkedin />
                            </Link>
                        </div>
                    </li>
                    <li className="social-icon__item">
                        <div className="social-icon__item">
                            <Link
                                to="https://twitter.com/rileygramlich"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                <FaTwitter />
                            </Link>
                        </div>
                    </li>
                </ul>
                <ul className="menu">
                    <li className="menu__item">
                        <div className="menu__link">
                            <Link to="/">Home</Link>
                        </div>
                    </li>
                    <li className="menu__item">
                        <div className="menu__link">
                            <Link to="/berserk">Berserk</Link>
                        </div>
                    </li>
                    <li className="menu__item">
                        <div className="menu__link">
                            <Link to="/about">About</Link>
                        </div>
                    </li>
                    <li className="menu__item">
                        <div className="menu__link" target="_blank">
                            <Link
                                to="https://rileygramlich.github.io/riley-gramlich-portfolio/"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                My Portfolio
                            </Link>
                        </div>
                    </li>
                </ul>
            </footer>
        </div>
    );
}
