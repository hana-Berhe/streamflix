import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import BrowseLayout from "./layouts/BrowseLayout";
import Home from "./pages/Home";
import TvShows from "./pages/TvShows";
import Movies from "./pages/Movies";
import NewPopular from "./pages/NewPopular";
import MyList from "./pages/MyList";
import BrowseLanguage from "./pages/BrowseLanguage";
import Search from "./pages/Search";
import ForYou from "./pages/ForYou";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* Everything under /browse requires a signed-in user (checked in BrowseLayout). */}
      <Route path="/browse" element={<BrowseLayout />}>
        <Route index element={<Home />} />
        <Route path="tv" element={<TvShows />} />
        <Route path="movies" element={<Movies />} />
        <Route path="new" element={<NewPopular />} />
        <Route path="my-list" element={<MyList />} />
        <Route path="language" element={<BrowseLanguage />} />
        <Route path="search" element={<Search />} />
        <Route path="for-you" element={<ForYou />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
