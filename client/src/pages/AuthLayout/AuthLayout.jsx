import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Added useLocation
import styles from "./authLayout.module.css";
import Login from "../Login/Login.jsx";
import SignUp from "../SignUp/SignUp.jsx";
import About from "../About/About.jsx";
import Layout from "../../components/Layout/Layout.jsx";

export default function AuthLayout() {
  const location = useLocation();

  // 1. Initial State Logic:
  // Check if navigate passed a specific state. If not, default to true (Login).
  const [isLogin, setIsLogin] = useState(
    location.state?.showLogin !== undefined ? location.state.showLogin : true,
  );

  const [isTransitioning, setIsTransitioning] = useState(false);

  // 2. Sync Logic:
  // If user is already on the page and clicks a link (e.g., from Footer),
  // this ensures the form switches without a refresh.
  useEffect(() => {
    if (location.state?.showLogin !== undefined) {
      setIsLogin(location.state.showLogin);
    }
  }, [location.state]);

  const toggleForm = () => {
    setIsTransitioning(true);
  };

  useEffect(() => {
    let timeout;
    if (isTransitioning) {
      timeout = setTimeout(() => {
        setIsLogin((prev) => !prev);
        setIsTransitioning(false);
      }, 400);
    }
    return () => clearTimeout(timeout);
  }, [isTransitioning]);

  return (
    <Layout>
      <div className={styles.auth_full_bg}>
        <div className={styles.inner_container}>
          <div className={styles.form_column}>
            <div
              className={`${styles.transition_wrapper} ${
                isTransitioning ? styles.fadeOut : styles.fadeIn
              }`}
            >
              {isLogin ? (
                <Login onSwitch={toggleForm} />
              ) : (
                <SignUp onSwitch={toggleForm} />
              )}
            </div>
          </div>

          <div className={styles.about_column}>
            <About />
          </div>
        </div>
      </div>
    </Layout>
  );
}
