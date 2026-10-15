import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import BrowseHeader from "../components/Header/BrowseHeader";
import Footer from "../components/Footer/Footer";
import PlayerModal from "../components/PlayerModal/PlayerModal";
import DetailsModal from "../components/DetailsModal/DetailsModal";
import Toast from "../components/Toast/Toast";

import * as authApi from "../services/authApi";
import { AUTH_EXPIRED_EVENT } from "../services/http";
import { clearUser, setUser } from "../features/user/userSlice";
import { fetchMyList } from "../features/myList/myListSlice";
import { fetchRatings } from "../features/ratings/ratingsSlice";
import { closeDetails, closePlayer } from "../features/ui/uiSlice";

/**
 * Wraps every /browse page: checks the session once, loads My List and
 * ratings, and renders the shared header, footer and modals.
 */
function BrowseLayout() {
  const [authChecked, setAuthChecked] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();

  useEffect(() => {
    let isMounted = true;

    authApi
      .getMe()
      .then((data) => {
        if (!isMounted) return;
        dispatch(setUser(data.user));
        dispatch(fetchMyList());
        dispatch(fetchRatings());
        setAuthChecked(true);
      })
      .catch(() => {
        if (!isMounted) return;
        dispatch(clearUser());
        navigate("/", { replace: true });
      });

    return () => {
      isMounted = false;
    };
  }, [dispatch, navigate]);

  // Any protected request that returns 401 means the session expired.
  useEffect(() => {
    const onExpired = () => {
      dispatch(clearUser());
      navigate("/", { replace: true, state: { expired: true } });
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
  }, [dispatch, navigate]);

  // New page: start at the top and close any open modal.
  useEffect(() => {
    if (pathname !== "/browse/search") window.scrollTo(0, 0);
    dispatch(closeDetails());
    dispatch(closePlayer());
  }, [pathname, search, dispatch]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      dispatch(clearUser());
      navigate("/", { replace: true });
    }
  };

  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#141414]">
        <div
          className="h-14 w-14 animate-spin rounded-full border-4 border-[#e50914] border-t-transparent"
          role="status"
          aria-label="Loading"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414]">
      <BrowseHeader onLogout={handleLogout} />
      <Outlet />
      <Footer />
      <DetailsModal />
      <PlayerModal />
      <Toast />
    </div>
  );
}

export default BrowseLayout;
