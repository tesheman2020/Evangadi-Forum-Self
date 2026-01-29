import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import styles from "./HowItWorks.module.css";
import Layout from "../../components/Layout/Layout.jsx";
import { UserState } from "../../App.jsx";

const HowItWorks = () => {
  const { user } = useContext(UserState);
  const userId = user?.userid;
  const navigate = useNavigate();

  // Redirects to /auth and tells it to show SIGNUP
  const handleJoinNow = () => {
    navigate("/auth", { state: { showLogin: false } });
  };

  // Redirects to /auth and tells it to show LOGIN
  const handleLoginRedirect = () => {
    navigate("/auth", { state: { showLogin: true } });
  };

  return (
    <Layout>
      <div className={styles.page_wrapper}>
        <div className={styles.container}>
          <header className={styles.header}>
            <h1 className={styles.title}>Purpose of the Platform</h1>
            <p className={styles.description}>
              Fostering collaborative learning among students by sharing
              knowledge, supporting peers, and enhancing understanding through
              discussion.
            </p>
          </header>

          <div className={styles.steps_grid}>
            <div className={styles.step_card}>
              <div className={styles.step_number}>01</div>
              <h3>User Authentication</h3>
              <p>
                Create an account to unlock the full potential of the platform.
                Registering allows you to post questions and collaborate by
                providing expert answers to others.
              </p>
            </div>

            <div className={styles.step_card}>
              <div className={styles.step_number}>02</div>
              <h3>Ask Questions</h3>
              <p>
                Stuck on a problem? Post your academic queries to our community.
                Detailed descriptions help others provide the most accurate and
                helpful solutions.
              </p>
            </div>

            <div className={styles.step_card}>
              <div className={styles.step_number}>03</div>
              <h3>Share Knowledge</h3>
              <p>
                Browse existing questions and contribute your insights. Help
                your fellow students by offering guidance, solutions, or
                resource recommendations.
              </p>
            </div>
          </div>

          {!userId && (
            <div className={styles.cta_section}>
              {/* Trigger handleJoinNow */}
              <button onClick={handleJoinNow} className={styles.primary_btn}>
                Join the Community Now
              </button>

              <p className={styles.login_text}>
                Already have an account?
                <span
                  onClick={handleLoginRedirect}
                  className={styles.fake_link}
                >
                  Login
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HowItWorks;
