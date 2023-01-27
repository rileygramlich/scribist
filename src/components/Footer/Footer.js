import React from "react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

import "./Footer.css";

export default function Footer() {
  return (
    <main>
      <footer className="footer">
        <div className="waves">
          <div className="wave" id="wave1"></div>
          <div className="wave" id="wave2"></div>
          <div className="wave" id="wave3"></div>
          <div className="wave" id="wave4"></div>
        </div>
        <ul className="social-icon">
          <li className="social-icon__item">
            <div className="social-icon__link"></div>
          </li>
          <li className="social-icon__item">
            <div className="social-icon__item">
              <Link
                rel="opener"
                target="_blank"
                to="https://www.linkedin.com/in/rileygramlich/"
              >
                <FaGithub />
              </Link>
            </div>
          </li>
          <li className="social-icon__item">
            <div className="social-icon__item">
              <Link
                rel="opener"
                target="_blank"
                to="https://www.linkedin.com/in/rileygramlich/"
              >
                <FaLinkedin />
              </Link>
              <i className="fa-regular fa-house"></i>
            </div>
          </li>
          <li className="social-icon__item">
            <div className="social-icon__item">
              <Link
                rel="opener"
                target="_blank"
                to="https://twitter.com/rileygramlich"
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
                rel="opener"
                target="_blank"
                to="https://rileygramlich.github.io/riley-gramlich-portfolio/"
              >
                My Portfolio
              </Link>
            </div>
          </li>
        </ul>
        <p> &copy; 2023 Scribist | Designed & Developed by Riley Gramlich</p>
      </footer>
    </main>
  );
}
