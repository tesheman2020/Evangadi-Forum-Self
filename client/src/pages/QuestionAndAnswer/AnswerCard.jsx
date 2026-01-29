import React, { useState, useContext } from "react";
import { MdAccountCircle, MdEdit, MdDelete } from "react-icons/md";
import { UserState } from "../../App.jsx";
import instance from "../../Api/Axios.js";
import moment from "moment";
import Swal from "sweetalert2";
import styles from "./answer.module.css";

function AnswerCard({ a, onUpdate, onDelete }) {
  const { user } = useContext(UserState);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(a.answer);
  const [isExpanded, setIsExpanded] = useState(false);

  const loggedInId = user?.id || user?.userid;
  const isOwner = loggedInId && a.userid && String(loggedInId) === String(a.userid);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await instance.patch(`/answers/updateAnswer/${a.answerid}`, {
        answer: editValue,
      });
      onUpdate(a.answerid, editValue);
      setIsEditing(false);
      Swal.fire({
        icon: "success",
        title: "Updated",
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (err) {
      Swal.fire("Error", "Update failed", "error");
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Delete Answer?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await instance.delete(`/answers/deleteAnswer/${a.answerid}`);
        onDelete(a.answerid);
        Swal.fire("Deleted!", "Answer removed.", "success");
      } catch (err) {
        Swal.fire("Error", "Delete failed", "error");
      }
    }
  };

  return (
    <div className={styles.answerCard}>
      {isEditing ? (
        <form onSubmit={handleUpdate} className={styles.editForm}>
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className={styles.editTextarea}
            required
          />
          <div className={styles.editBtns}>
            <button type="submit" className={styles.saveBtn}>Save</button>
            <button type="button" onClick={() => setIsEditing(false)} className={styles.cancelBtn}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.answerBody}>
          <div className={styles.answerHeaderFlex}>
            <div className={styles.answerText}>
              {isExpanded || a.answer.length < 500
                ? a.answer
                : `${a.answer.substring(0, 500)}...`}
              {a.answer.length > 500 && (
                <button className={styles.seeMore} onClick={() => setIsExpanded(!isExpanded)}>
                  {isExpanded ? "show less" : "read more"}
                </button>
              )}
            </div>
            {isOwner && (
              <div className={styles.actionIcons}>
                <MdEdit size={19} onClick={() => setIsEditing(true)} />
                <MdDelete size={19} onClick={handleDelete} />
              </div>
            )}
          </div>
          <div className={styles.signatureWrapper}>
            <div className={styles.userSignature}>
              <span className={styles.userActionDate}>
               
                answered {a.createdAt ? moment(a.createdAt).fromNow() : "just now"}
              </span>
              <div className={styles.userProfile}>
                <MdAccountCircle size={32} className={styles.avatarIcon} />
                <span className={styles.signatureName}>@{a.username || "anonymous"}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AnswerCard;