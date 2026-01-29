import { useState } from "react";
import styles from "./questions.module.css";
import QuestionCard from "../../components/QuestionCard/QuestionCard.jsx";

function Questions({ questions, onDeleteSuccess, onUpdateSuccess }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;

  const filteredQuestions = Array.isArray(questions)
    ? questions.filter((q) => {
        const query = searchQuery.toLowerCase();
        return (
          q.title?.toLowerCase().includes(query) ||
          q.description?.toLowerCase().includes(query)
        );
      })
    : [];

  const indexOfLast = currentPage * questionsPerPage;
  const indexOfFirst = indexOfLast - questionsPerPage;
  const currentQuestions = filteredQuestions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);

  return (
    <div className={styles.container}>
      <div className={styles.search_question}>
        <input
          type="text"
          placeholder="Search for a question"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>
      <hr />

      {filteredQuestions.length === 0 ? (
        <div className={styles.no_found}>
          <p>No Questions Found</p>
        </div>
      ) : (
        <>
          {currentQuestions.map((q) => (
            <QuestionCard
              key={q.questionid}
              id={q.questionid}
              userName={q.username}
              questionTitle={q.title}
              description={q.description}
              question_date={q.question_date}
              // CRITICAL: Ensure this matches the column name 'userid' from your SQL
              ownerId={q.userid}
              onActionSuccess={onDeleteSuccess}
              onUpdateSuccess={onUpdateSuccess}
            />
          ))}

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Questions;
