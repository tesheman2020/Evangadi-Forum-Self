import { useContext, useEffect, useState } from "react";
import { BsArrowRightSquareFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { UserState } from "../../App.jsx";
import Layout from "../../components/Layout/Layout.jsx";
import Questions from "../Question/Questions.jsx";
import styles from "./home.module.css";
import { questionService } from "../../Api/question.service.js";

function Home() {
  const { user } = useContext(UserState);
  const [greeting, setGreeting] = useState("");
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const { data } = await questionService.getAllQuestions();
        setAllQuestions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();

    const hour = new Date().getHours();
    setGreeting(
      hour < 12
        ? "Good Morning"
        : hour < 17
          ? "Good Afternoon"
          : "Good Evening",
    );
  }, []);

  // DELETE: Instantly remove from list
  const handleUIDelete = (deletedId) => {
    setAllQuestions((prev) => prev.filter((q) => q.questionid !== deletedId));
  };

  // UPDATE: Instantly update the title/desc in the list without refresh
  const handleUIUpdate = (updatedData) => {
    setAllQuestions((prev) =>
      prev.map((q) =>
        q.questionid === updatedData.id
          ? {
              ...q,
              title: updatedData.title,
              description: updatedData.description,
            }
          : q,
      ),
    );
  };

  const formattedName = user?.username
    ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
    : null;

  return (
    <Layout>
      <div className={styles.home_container}>
        <div className={styles.ask_welcome_holder}>
          <div className={styles.ask_question}>
            <Link to="/ask">
              <button className={styles.ask_btn}>
                <span>I've got a question</span>
                <BsArrowRightSquareFill size={20} />
              </button>
            </Link>
          </div>

          {formattedName && (
            <div className={styles.welcome_msg}>
              <p>
                {greeting},{" "}
                <span className={styles.userName}>{formattedName}</span>
              </p>
            </div>
          )}
        </div>

        <div className={styles.list_header}>
          <h3>Questions</h3>
          <hr />
        </div>

        <div className={styles.questions_list}>
          {loading ? (
            <p>Loading questions...</p>
          ) : (
            <Questions
              questions={allQuestions}
              onDeleteSuccess={handleUIDelete}
              onUpdateSuccess={handleUIUpdate} // Pass the update handler
            />
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Home;
