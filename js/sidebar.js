$(document).ready(function () {
  let jwt = parseJwt(sessionStorage.getItem("token"));
  let staffId = jwt["sub"];
  if ("tga000" != staffId) {
    checkPermission();
  }
});

function checkPermission() {
  $("#fa-house-chimney-medical").hide();
  $("#fa-store").hide();
  $("#fa-hand-holding-heart").hide();
  $("#fa-facebook-messenger").hide();
  $("#fa-book-open").hide();
  $("#fa-member").hide();
}
