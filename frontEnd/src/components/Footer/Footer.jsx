import styles from "./Footer.module.css";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const FOOTER_LINKS = [
  ["FAQ", "Help Center", "Account"],
  ["Ways to Watch", "Terms of Use", "Privacy"],
  ["Cookie Preferences", "Corporate Information", "Contact Us"],
  ["Speed Test", "Legal Notices", "Only on StreamFlex"],
];

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.socialIcons}>
          <a href="#" aria-label="Facebook">
            <FaFacebookF />
          </a>
          <a href="#" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="#" aria-label="Twitter">
            <FaTwitter />
          </a>
          <a href="#" aria-label="YouTube">
            <FaYoutube />
          </a>
        </div>

        <div className={styles.linksGrid}>
          {FOOTER_LINKS.map((column, columnIndex) => (
            <div className={styles.linkColumn} key={columnIndex}>
              {column.map((link) => (
                <a href="#" key={link}>
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className={styles.languageWrapper}>
          <select className={styles.languageSelect} defaultValue="English" aria-label="Select language">
            <option value="English">🌐 English</option>
            <option value="French">🌐 Français</option>
          </select>
        </div>

        <p className={styles.country}>© {new Date().getFullYear()} StreamFlex</p>
      </div>
    </footer>
  );
}

export default Footer;
