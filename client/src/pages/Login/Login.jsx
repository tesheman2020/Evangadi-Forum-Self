import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Standard icons
import instance from "../../Api/Axios";
import classes from "./login.module.css";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function Login({ onSwitch }) {
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await instance.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        await Swal.fire({
          title: "Welcome Back!",
          text: "Login successful!",
          icon: "success",
          timer: 1000, 
          showConfirmButton: false,
          confirmButtonColor: "var(--blue-main)",
        });
        window.location.href = "/";
      }
    } catch (err) {
      let message = "Something went wrong. Please try again.";
      if (err.response?.status === 401)
        message = "Email or password is incorrect.";
      setError(message);
      Swal.fire({ title: "Login Failed", text: message, icon: "error" });
    }
  };

  return (
    <div className={classes.formcontainer}>
      <div className={classes.innerContainer}>
        <div className={classes.heading}>
          <h2 className={classes.title}>Login to your account</h2>
          <p className={classes.signuptext}>
            Don't have an account?{" "}
            <span className={classes.switchLink} onClick={onSwitch}>
              Create a new account
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className={classes.form}>
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
              className={classes.inputField}
            />
            {/* The Icon Toggle */}
            <div
              className={classes.iconContainer}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </div>
          </div>

          <div className={classes.forgotWrapper}>
            <Link to="/forgetPass" className={classes.forgotLink}>
              Forgot password?
            </Link>
          </div>

          <button type="submit" className={classes.submitbtn}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
