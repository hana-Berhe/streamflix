import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaBell, FaCaretDown, FaSearch, FaTimes } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

import logo from "../../assets/images/logo.svg";
import styles from "./BrowseHeader.module.css";

const NAV_LINKS = [
  { label: "Home", to: "/browse", end: true },
  { label: "TV Shows", to: "/browse/tv" },
  { label: "Movies", to: "/browse/movies" },
  { label: "New & Popular", to: "/browse/new" },
  { label: "My List", to: "/browse/my-list" },
  { label: "Browse by Languages", to: "/browse/language" },
  { label: "For You", to: "/browse/for-you", ai: true },
];

const SEARCH_PATH = "/browse/search";

function useHoverMenu() {
  const [open, setOpen] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  return {
    open,
    setOpen,
    bind: {
      onMouseEnter: () => {
        clearTimeout(timer.current);
        setOpen(true);
      },
      onMouseLeave: () => {
        timer.current = setTimeout(() => setOpen(false), 200);
      },
    },
  };
}

function BrowseHeader({ onLogout }) {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const onSearchPage = location.pathname === SEARCH_PATH;
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(onSearchPage);
  const [query, setQuery] = useState(onSearchPage ? searchParams.get("q") || "" : "");
  const typed = useRef(false);
  const lastPage = useRef("/browse");
  const inputRef = useRef(null);

  const profile = useHoverMenu();
  const browseMenu = useHoverMenu();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Remember where to return when the search box is cleared.
  useEffect(() => {
    if (!onSearchPage) {
      lastPage.current = location.pathname + location.search;
      if (!typed.current) setQuery("");
    }
    browseMenu.setOpen(false);
    profile.setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Search as you type, like Netflix (debounced).
  useEffect(() => {
    if (!typed.current) return undefined;
    const timer = setTimeout(() => {
      const q = query.trim();
      if (q) {
        navigate(`${SEARCH_PATH}?q=${encodeURIComponent(q)}`, { replace: onSearchPage });
      } else if (onSearchPage) {
        navigate(lastPage.current);
      }
      typed.current = false;
    }, 350);
    return () => clearTimeout(timer);
  }, [query, navigate, onSearchPage]);

  const openSearch = () => {
    setSearchOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const clearSearch = () => {
    typed.current = true;
    setQuery("");
    inputRef.current?.focus();
  };

  const firstName = user?.full_name?.split(" ")[0] || "Profile";

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <Link to="/browse" className={styles.logoLink} aria-label="StreamFlex home">
        <img className={styles.logo} src={logo} alt="StreamFlex" />
      </Link>

      <nav className={styles.nav} aria-label="Primary">
        <ul className={styles.navList}>
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.end}
                className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`}
              >
                {link.ai && <HiSparkles aria-hidden="true" className={styles.aiIcon} />}
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Compact "Browse" menu for small screens */}
        <div className={styles.browseMenu} {...browseMenu.bind}>
          <button
            type="button"
            className={styles.browseButton}
            onClick={() => browseMenu.setOpen((o) => !o)}
            aria-expanded={browseMenu.open}
          >
            Browse <FaCaretDown aria-hidden="true" />
          </button>
          {browseMenu.open && (
            <ul className={styles.browseDropdown}>
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) => (isActive ? styles.active : "")}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>

      <div className={styles.right}>
        <div className={`${styles.search} ${searchOpen ? styles.searchOpen : ""}`}>
          <button
            type="button"
            className={styles.iconButton}
            onClick={openSearch}
            aria-label="Search"
            tabIndex={searchOpen ? -1 : 0}
          >
            <FaSearch />
          </button>
          {searchOpen && (
            <>
              <input
                ref={inputRef}
                type="search"
                className={styles.searchInput}
                placeholder="Titles, people, genres"
                aria-label="Search titles"
                value={query}
                onChange={(e) => {
                  typed.current = true;
                  setQuery(e.target.value);
                }}
                onBlur={() => !query && setSearchOpen(false)}
                onKeyDown={(e) => e.key === "Escape" && (query ? clearSearch() : setSearchOpen(false))}
              />
              {query && (
                <button
                  type="button"
                  className={styles.clear}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={clearSearch}
                  aria-label="Clear search"
                >
                  <FaTimes />
                </button>
              )}
            </>
          )}
        </div>

        <button type="button" className={`${styles.iconButton} ${styles.bell}`} aria-label="Notifications">
          <FaBell />
        </button>

        <div className={styles.profile} {...profile.bind}>
          <button
            type="button"
            className={styles.profileButton}
            onClick={() => profile.setOpen((o) => !o)}
            aria-label="Account menu"
            aria-expanded={profile.open}
          >
            <span className={styles.avatar} aria-hidden="true">
              {firstName.charAt(0).toUpperCase()}
            </span>
            <FaCaretDown className={`${styles.caret} ${profile.open ? styles.caretUp : ""}`} aria-hidden="true" />
          </button>

          {profile.open && (
            <div className={styles.profileMenu}>
              <div className={styles.userInfo}>
                <span className={styles.avatarSmall} aria-hidden="true">
                  {firstName.charAt(0).toUpperCase()}
                </span>
                <div>
                  <div className={styles.userName}>{user?.full_name || "Profile"}</div>
                  <div className={styles.userEmail}>{user?.email}</div>
                </div>
              </div>
              <Link className={styles.menuItem} to="/browse/my-list">My List</Link>
              <Link className={styles.menuItem} to="/browse/for-you">Suggestions for you</Link>
              <hr className={styles.divider} />
              <button type="button" className={styles.signOut} onClick={onLogout}>
                Sign out of StreamFlex
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default BrowseHeader;
