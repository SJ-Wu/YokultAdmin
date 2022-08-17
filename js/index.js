window.onload = (e) => {
  // if (sessionStorage.getItem("token")) {
  //     window.location.replace("index.html");
  // }
};
function login() {
  let userid = document.getElementById("userid").value;
  let inputPassword = document.getElementById("inputPassword").value;
  const loginURL = YOKULT_URL + STAFF + "/login";
  axios
    .post(loginURL, {
      staff_id: userid,
      staff_idnumber: inputPassword,
    })
    .then((response) => {
      if (response.status === 200) {
        sessionStorage.setItem("token", response.data["msg"]);
        console.log(response.data);
        let jwt = parseJwt(sessionStorage.getItem("token"));
        console.log(jwt);
        sessionStorage.setItem("staff_id", jwt["sub"]);
        document.getElementById(
          "login-message"
        ).innerText = `登入成功，${staff_id}您好。
                `;
        alert(`登入成功，${staff_id}您好。`);
        // setTimeout(() => {
        //     window.location.replace("index.html");
        // }, 3000);
      } else {
        alert(`登入失敗，請重新登入。`);
      }
    })
    .catch((error) => console.log(error));
}
// Referenced:
// https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}
