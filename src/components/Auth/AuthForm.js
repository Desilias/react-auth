import { useState, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import classes from "./AuthForm.module.css";


const AuthForm = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoding, setIslLoding] = useState(false);
  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredEmail = emailRef.current.value;
    const enterdPassword = passwordRef.current.value;
    setIslLoding(true);
    if (isLogin) {
      fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCY4lcC-s1176awHq_KJ9c5dv2IPe8Hs1U",
        {
          method: "POST",
          body: JSON.stringify({
            email: enteredEmail,
            password: enterdPassword,
            returnSecureToken: true
          }),
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
        .then((res) => {
          setIslLoding(false);
          if (res.ok) {
            return res.json();
          } else {
            return res.json().then((data) => {
              let errorMessage = "Authentification failed";
              if (data && data.error && data.error.message) {
                errorMessage = data.error.message;
                throw new Error(errorMessage);
              }
            });
          }
        })
        .then((data) => {
          const expirationTime = new Date(
            new Date().getTime + data.expiresIn * 1000
          );
          authCtx.login(data.idToken, expirationTime.toISOString);
          history.replace("/");
        })
        .catch((err) => {
          alert(err.message);
        });
    } else {
      fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCY4lcC-s1176awHq_KJ9c5dv2IPe8Hs1U",
        {
          method: "POST",
          body: JSON.stringify({
            email: enteredEmail,
            password: enterdPassword,
            returnSecureToken: true
          }),
          headers: {
            "Content-Type": "application/json"
          }
        }
      ).then((res) => {
        setIslLoding(false);
        if (res.ok) {
        } else {
          return res.json().then((data) => {
            let errorMessage = "Authentification failed";
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
              console.log(errorMessage);
            }
          });
        }
      });
    }
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input type="password" id="password" required ref={passwordRef} />
        </div>
        <div className={classes.actions}>
          {!isLoding && <button>{isLogin ? "Login" : "Create Account"}</button>}
          {isLoding && <p>Loding...</p>}
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
