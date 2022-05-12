import classes from "./ProfileForm.module.css";
import { useRef, useContext } from "react";
import AuthContext from "../../store/auth-context";
import { useHistory } from "react-router-dom";
const ProfileForm = () => {
  const history = useHistory();
  const newPasswordRef = useRef();
  const authCtx = useContext(AuthContext);

  const changePasswordHandler = (event) => {
    event.preventDefault();

    const newPassworEnteredValue = newPasswordRef.current.value;

    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCY4lcC-s1176awHq_KJ9c5dv2IPe8Hs1U",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: authCtx.token,
          password: newPassworEnteredValue,
          returnSecureToken: false
        }),
        headers: {
          "Content-Type": "application/json"
        }
      }
    ).then((res) => {
      history.replace("/");
    });
  };
  return (
    <form className={classes.form} onSubmit={changePasswordHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          minLength="7"
          ref={newPasswordRef}
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
