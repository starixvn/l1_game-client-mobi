import React, { useState } from "react";
import Styles from "./sign-in.module.scss";
import { UserService } from "../../../services";
import { AuthContext } from "../../contexts/auth/index";
import { Session } from "../../../services/user/user";

export default function SignIn(props) {
  const [name, updateNameState] = useState<string>(null);
  const session = React.useContext<Session>(AuthContext);
  const handleSubmit = () => {
    if (session.isAuthenticated) {
      const respon = UserService.signName(session, name);
      console.log(respon);
    }
  };
  return (
    <div>
      <form>
        <div>
          <label>User displayName</label>
          <input
            type="text"
            placeholder="user name"
            value={name}
            onChange={(e) => updateNameState(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary"
            onClick={() => handleSubmit()}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
