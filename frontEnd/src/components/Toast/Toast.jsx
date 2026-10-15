import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideToast } from "../../features/ui/uiSlice";
import styles from "./Toast.module.css";

function Toast() {
  const dispatch = useDispatch();
  const toast = useSelector((state) => state.ui.toast);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => dispatch(hideToast()), 4000);
    return () => clearTimeout(timer);
  }, [toast, dispatch]);

  return (
    <div className={styles.region} role="status" aria-live="polite">
      {toast && (
        <div key={toast.id} className={styles.toast}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

export default Toast;
