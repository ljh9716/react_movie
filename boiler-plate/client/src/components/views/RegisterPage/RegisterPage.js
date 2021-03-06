import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../_action/user_action";
import { withRouter } from "react-router-dom";

function RegisterPage(props) {
  const dispatch = useDispatch();

  const [Email, setEmail] = useState("");
  const [Name, setName] = useState("");
  const [Password, setPassword] = useState("");
  const [ComfirmPassword, setComfirmPassword] = useState("");
  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };
  const onNameHandler = (event) => {
    setName(event.currentTarget.value);
  };

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };
  const onComfirmPasswordHandler = (event) => {
    setComfirmPassword(event.currentTarget.value);
  };
  const onSummitHandler = (event) => {
    event.preventDefault(); // 이거 안하면 페이지 reflash 된다 다음 코드를 실행 못함

    if (Password !== ComfirmPassword)
      return alert(`비밀번호와 비밀번호 확인이 다릅니다`);
    let body = {
      email: Email,
      name: Name,
      password: Password,
    };
    dispatch(registerUser(body)).then((response) => {
      if (response.payload.success) {
        props.history.push("/login");
      } else {
        alert("Failed to sign up");
      }
    });
  };
  return (
    <>
      <div
        style={{
          display: `flex`,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: `100vh`,
        }}
      >
        <form
          style={{ display: "flex", flexDirection: "column" }}
          onSubmit={onSummitHandler}
        >
          <label>Email</label>
          <input type="email" value={Email} onChange={onEmailHandler} />

          <label>Name</label>
          <input type="text" value={Name} onChange={onNameHandler} />

          <label>Password</label>
          <input
            type="password"
            value={Password}
            onChange={onPasswordHandler}
          />

          <label>confirm Password</label>
          <input
            type="password"
            value={ComfirmPassword}
            onChange={onComfirmPasswordHandler}
          />
          <br />
          <button type="submit">회원가입</button>
        </form>
      </div>
    </>
  );
}

export default withRouter(RegisterPage);
