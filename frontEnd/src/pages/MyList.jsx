import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import TitleGrid from "../components/TitleGrid/TitleGrid";
import page from "../styles/page.module.css";

function MyList() {
  const { items, status } = useSelector((state) => state.myList);

  return (
    <main className={page.page}>
      <h1 className={page.heading}>My List</h1>

      {status === "loading" && !items.length ? null : items.length ? (
        <TitleGrid items={items} />
      ) : (
        <div className={page.empty}>
          <strong>You haven&apos;t added any titles to your list yet.</strong>
          Hover over a title and select + to save it here.
          <div style={{ marginTop: 24 }}>
            <Link className={page.button} to="/browse">
              Browse titles
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}

export default MyList;
