import { useRef } from "react";
import classes from "./askQuestion.module.css";
// import instance from "../../../Api/Axios.js"; // You can use this or the service
import { questionService } from "../../../Api/question.service.js"; // Cleaner approach
import { Link, useNavigate } from "react-router-dom";
import Layout from "../../../components/Layout/Layout.jsx";
import Swal from "sweetalert2";

function AskQuestion() {
  const navigate = useNavigate();
  const titleDom = useRef();
  const descriptionDom = useRef();

  async function handleSubmit(e) {
    e.preventDefault();
    const title = titleDom.current.value;
    const description = descriptionDom.current.value; // Renamed for clarity

    try {
      // CRITICAL FIX: Changed 'desc' to 'description' to match Backend
      const response = await questionService.postQuestion({
        title,
        description,
      });

      if (response.status === 201) {
        await Swal.fire({
          title: "Success!",
          text: "Your question has been posted.",
          icon: "success",
          confirmButtonColor: "#516cf0",
        });
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to post question.",
        icon: "error",
      });
    }
  }

  return (
    <Layout>
      <div className={classes.pageWrapper}>
        <div className={classes.container}>
          <div className={classes.instructionsSection}>
            <h2 className={classes.mainTitle}>How to Ask a Good Question</h2>
            <div className={classes.stepsCard}>
              <ul className={classes.stepList}>
                <li>Summarize your problem in a one-line title.</li>
                <li>Describe your problem in more detail.</li>
                <li>Explain what you tried and what you expected to happen.</li>
                <li>Review your question and post it to the site.</li>
              </ul>
            </div>
          </div>

          <div className={classes.formSection}>
            <h3 className={classes.formHeader}>Post Your Question</h3>
            <form onSubmit={handleSubmit} className={classes.questionForm}>
              <div className={classes.inputGroup}>
                <input
                  ref={titleDom}
                  type="text"
                  placeholder="e.g. How do I use React Context with MySQL?"
                  required
                />
              </div>
              <div className={classes.inputGroup}>
                <textarea
                  rows={8}
                  ref={descriptionDom}
                  placeholder="Describe your problem in detail..."
                  required
                />
              </div>
              <div className={classes.actionButtons}>
                <button className={classes.postBtn} type="submit">
                  Post Your Question
                </button>
                <Link to="/" className={classes.backLink}>
                  Back to Dashboard
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AskQuestion;
