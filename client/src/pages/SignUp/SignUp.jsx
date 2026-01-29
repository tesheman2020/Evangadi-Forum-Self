import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import instance from "../../Api/Axios";
import classes from "./signUp.module.css";

function Signup({ onSwitch }) {
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validateUserData = (fname, lname, username) => {
    // Note: This regex allows only English letters.
    // Consider /^[A-Za-z\u00C0-\u00FF'-]{2,}$/ for international support.
    const isValidFname = /^[A-Za-z]{2,}$/.test(fname.trim());
    const isValidLname = /^[A-Za-z]{2,}$/.test(lname.trim());
    const isValidUsername = /^[A-Za-z0-9]{2,}$/.test(username.trim());
    return isValidFname && isValidLname && isValidUsername;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !validateUserData(
        formData.firstName,
        formData.lastName,
        formData.username,
      )
    ) {
      return Swal.fire({
        title: "Invalid Input",
        text: "Names must contain letters only. Username must be alphanumeric.",
        icon: "error",
        confirmButtonColor: "var(--blue-main)",
      });
    }

    try {
      const response = await instance.post("/auth/register", {
        username: formData.username,
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 201) {
        setError(null);
        await Swal.fire({
          title: "Registration Successful! 🎉",
          text: "Please login to continue.",
          icon: "success",
          confirmButtonText: "Go to Login",
          confirmButtonColor: "var(--blue-main)",
        });
        onSwitch(); // Redirect to Login
      }
    } catch (err) {
      let message = "Something went wrong. Please try again.";
      if (err.response) {
        // Handle specific backend errors
        if (err.response.status === 400)
          message = "You already have an account. Please sign in.";
        else if (err.response.data?.msg) message = err.response.data.msg;
      }
      setError(message);
    }
  };

  return (
    <div className={classes.formContainer}>
      <h2 className={classes.title}>Join the network</h2>

      <p className={classes.switchText}>
        Already have an account?{" "}
        <span onClick={onSwitch} className={classes.switchLink}>
          Sign in
        </span>
      </p>

      {error && <p className={classes.error}>{error}</p>}

      <form onSubmit={handleSubmit} className={classes.form}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          className={classes.inputField}
        />

        <div className={classes.nameInputsRow}>
          <input
            type="text"
            name="firstName"
            placeholder="First name"
            value={formData.firstName}
            onChange={handleChange}
            required
            className={classes.inputField}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last name"
            value={formData.lastName}
            onChange={handleChange}
            required
            className={classes.inputField}
          />
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          required
          className={classes.inputField}
        />

        <div className={classes.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className={`${classes.inputField} ${classes.passwordInput}`}
          />
          <div
            className={classes.iconContainer}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </div>
        </div>

        <p className={classes.termsText}>
          I agree to the <Link to="/privacyPolicy">privacy policy</Link> and{" "}
          <Link to="/terms">terms of service</Link>.
        </p>

        <button type="submit" className={classes.submitBtn}>
          Agree and Join
        </button>
      </form>
    </div>
  );
}

export default Signup;
