import React from "react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";


import "./Footer.css";

export default function Footer() {
  return (
    <main>
      <footer class="footer">
        <div class="waves">
          <div class="wave" id="wave1"></div>
          <div class="wave" id="wave2"></div>
          <div class="wave" id="wave3"></div>
          <div class="wave" id="wave4"></div>
        </div>
        <ul class="social-icon">
          <li class="social-icon__item">
            <a class="social-icon__link" href="#">
              <ion-icon name="logo-facebook"></ion-icon>
            </a>
          </li>
          <li class="social-icon__item">
          <a
            className="social-icon__item"
            href="https://github.com/rileygramlich"
            target="_blank"
          >
            <FaGithub />
          </a>
          </li>
          <li class="social-icon__item">
          <a
            className="social-icon__item"
            href="https://www.linkedin.com/in/rileygramlich/"
            target="_blank"
          >
            <FaLinkedin />
            <i className="fa-regular fa-house"></i>
          </a>
          </li>
          <li class="social-icon__item">
          <a
            className="social-icon__item"
            href="https://twitter.com/rileygramlich"
            target="_blank"
          >
            <FaTwitter />
          </a>
          </li>
        </ul>
        <ul class="menu">
          <li class="menu__item">
            <a class="menu__link" href="#">
                <Link to="/" >Home</Link>
            </a>
          </li>
          <li class="menu__item">
            <a class="menu__link" href="#">
            <Link to="/berserk">Berserk</Link>
            </a>
          </li>
          <li class="menu__item">
            <a class="menu__link" href="#">
                <Link to="/about" >About</Link>
            </a>
          </li>
          <li class="menu__item">
            <a class="menu__link" target="_blank" href="https://rileygramlich.github.io/riley-gramlich-portfolio/">
              My Portfolio
            </a>
          </li>
        </ul>
        <p> &copy; 2023 Scribist | Designed & Developed by Riley Gramlich</p>
      </footer>
    </main>
  );
}
