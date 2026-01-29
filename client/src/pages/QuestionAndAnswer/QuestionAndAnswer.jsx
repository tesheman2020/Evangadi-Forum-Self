import { useEffect, useRef, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Added useNavigate
import instance from "../../Api/Axios.js";
import Layout from "../../components/Layout/Layout.jsx";
import styles from "./answer.module.css";
import { MdOutlineQuestionAnswer, MdDelete } from "react-icons/md"; // Added MdDelete
import { UserState } from "../../App.jsx";
import moment from "moment";
import Swal from "sweetalert2";
import AnswerCard from "./AnswerCard";

function QuestionAndAnswer() {
  const { questionId } = useParams();
  const navigate = useNavigate(); // Initialize navigate
  const { user } = useContext(UserState);
  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const answerInput = useRef();

  // Check ownership for the delete button
  const loggedInId = user?.id || user?.userid;
  const isQuestionOwner =
    loggedInId &&
    question.userid &&
    String(loggedInId) === String(question.userid);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const qRes = await instance.get(
          `/questions/getsinglequestion/${questionId}`,
        );
        const aRes = await instance.get(`/answers/getAnswer/${questionId}`);

        const questionData = Array.isArray(qRes.data)
          ? qRes.data[0]
          : qRes.data;
        setQuestion(questionData || {});
        setAnswers(Array.isArray(aRes.data) ? aRes.data : []);
      } catch (err) {
        console.error("Fetch Error:", err);
        if (err.response?.status !== 404) {
          Swal.fire("Error", "Could not fetch data from server", "error");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [questionId]);

  // NEW: Delete Question Logic
  const handleDeleteQuestion = async () => {
    const result = await Swal.fire({
      title: "Delete this question?",
      text: "All associated answers will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete everything!",
    });

    if (result.isConfirmed) {
      try {
        // This hits your updated backend controller
        await instance.delete(`/questions/deletequestion/${questionId}`);
        await Swal.fire("Deleted!", "Question has been removed.", "success");
        navigate("/"); // Redirect to dashboard/home
      } catch (err) {
        Swal.fire(
          "Error",
          err.response?.data?.message || "Failed to delete question",
          "error",
        );
      }
    }
  };

  const handlePostAnswer = async (e) => {
    e.preventDefault();
    const answerText = answerInput.current.value;
    if (!answerText.trim()) return;

    try {
      const { data } = await instance.post("/answers/answerQuestion", {
        questionid: questionId,
        answer: answerText,
      });

      const newAnswer = {
        answerid: data.answerid,
        answer: answerText,
        username: user.username,
        userid: user.id || user.userid,
        createdAt: new Date().toISOString(),
      };

      setAnswers((prev) => [newAnswer, ...prev]);
      answerInput.current.value = "";
      Swal.fire({
        title: "Posted!",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire("Error", "Failed to post answer", "error");
    }
  };

  const handleUIUpdate = (id, newText) => {
    setAnswers((prev) =>
      prev.map((a) => (a.answerid === id ? { ...a, answer: newText } : a)),
    );
  };

  const handleUIDelete = (id) => {
    setAnswers((prev) => prev.filter((a) => a.answerid !== id));
  };

  if (loading)
    return (
      <Layout>
        <div className={styles.loading}>Loading...</div>
      </Layout>
    );

  return (
    <Layout>
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <section className={styles.questionSection}>
            <div className={styles.questionHeader}>
              <h1 className={styles.mainTitle}>
                {question.title || "Question"}
              </h1>

              {/* Show delete icon only to the owner */}
              {isQuestionOwner && (
                <button
                  className={styles.deleteQuestionBtn}
                  onClick={handleDeleteQuestion}
                  title="Delete Question"
                >
                  <MdDelete size={24} color="#d33" />
                </button>
              )}
            </div>

            <div className={styles.questionMetaTop}>
              <span>
                Asked <time>{moment(question.createdAt).fromNow()}</time>
              </span>
              <span>
                Author{" "}
                <b className={styles.blueText}>
                  @{question.username || "user"}
                </b>
              </span>
            </div>
            <hr className={styles.divider} />
            <p className={styles.questionDesc}>{question.description}</p>
          </section>

          <div className={styles.answerHeader}>
            <MdOutlineQuestionAnswer size={22} />
            <span>{answers.length} Answers</span>
          </div>

          <div className={styles.answerList}>
            {answers.length > 0 ? (
              answers.map((a) => (
                <AnswerCard
                  key={a.answerid}
                  a={a}
                  onUpdate={handleUIUpdate}
                  onDelete={handleUIDelete}
                />
              ))
            ) : (
              <p className={styles.noAnswer}>
                No answers yet. Be the first to respond!
              </p>
            )}
          </div>

          <div className={styles.postAnswerSection}>
            <h3 className={styles.formTitle}>Your Answer</h3>
            <form onSubmit={handlePostAnswer}>
              <textarea
                ref={answerInput}
                placeholder="Explain your answer in detail..."
                required
              />
              <button type="submit" className={styles.submitBtn}>
                Post Your Answer
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default QuestionAndAnswer;
