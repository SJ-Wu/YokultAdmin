$(function () {
  // $("textarea.textareaChart").val("");
  // 文字框隨內容自動增減
  let drID = "";
  let doctorId1 = 1;
  let doctorId2 = 2;

  $("textarea.textareaChart").css("resize", "none");
  $("textarea.textareaChart").on("keyup", function () {
    let textarea_content = $(this).val();
    let content_arr = textarea_content.split("\n");
    let count = content_arr.length;
    let padding_add_border = $(this).outerHeight() - $(this).height();
    $(this).css("height", 16 * (count + 3) + padding_add_border + "px");
  });

  $("textarea.textareaChart").css(
    "height",
    $("textarea.textareaChart").prop("scrollHeight")
  );

  $("select.dr").on("change", function () {
    $("textarea.chart").val("");
    let option1 = $("select.dr :selected").text();
    // console.log($("select.dr"));
    drID = option1.substring(option1.indexOf("0") + 2, option1.indexOf(" "));
    // console.log(drID);
    $.ajax({
      url: "http://localhost:8080/Proj_Yokult/api/0.01/doctor/getDrPatientIdcard", // 資料請求的網址
      type: "GET", // GET | POST | PUT | DELETE | PATCH
      data: {
        doctorId: drID,
      },
      dataType: "json", // 預期會接收到回傳資料的格式： json | xml | html
      success: function (data) {
        if (data.msg == "get patient id success") {
          $("select.patientID").html("");
          $("select.patientID").append(`<option>請選擇病患</option>`);
          $.each(data.IDSet, function (i, item) {
            $("select.patientID").append(`<option>${item}</option>`);
          });
        } else if (data.msg == "get no Patients booked") {
          $("select.patientID").html("");
          $("select.patientID").append(`<option>暫無已報到病患</option>`);
          $("select.patientDate").html("");
        }
      },
    });
  });

  $("select.patientID").on("change", function () {
    $("textarea.chart").val("");
    console.log("here patientID");
    console.log(drID);
    let selectedID = $("select.patientID :selected").text();
    console.log(selectedID);
    $.ajax({
      url: "http://localhost:8080/Proj_Yokult/api/0.01/doctor/getDrPatientDates", // 資料請求的網址
      type: "POST", // GET | POST | PUT | DELETE | PATCH
      data: JSON.stringify({
        doctorId: drID,
        patientIdcard: selectedID,
      }),
      dataType: "json", // 預期會接收到回傳資料的格式： json | xml | html
      success: function (data) {
        console.log("at select.patientID");
        console.log(data);
        // console.log(data.list);
        if (data.msg == "get patient dates success") {
          $("select.patientDate").html("");
          $("select.patientDate").append(`<option>請選擇日期</option>`);
          $.each(data.list, function (i, item) {
            $("select.patientDate").append(`<option>${item}</option>`);
          });
        } else if (data.msg == "get no Patients booked") {
          $("select.patientDate").html("");
          $("select.patientDate").append(`<option>暫無已報到病患</option>`);
        }
      },
    });
  });

  $("select.patientDate").on("change", function () {
    console.log("here patientDate");
    let selectedID = $("select.patientID :selected").text();
    let selectedDate = $("select.patientDate :selected").text();
    if (selectedDate == "請選擇日期") {
      $("textarea.chart").val("");
      return;
    }
    $.ajax({
      url: "http://localhost:8080/Proj_Yokult/api/0.01/doctor/returnChart", // 資料請求的網址
      type: "POST", // GET | POST | PUT | DELETE | PATCH
      data: JSON.stringify({
        doctorId: drID,
        patientIdcard: selectedID,
        bookingDate: selectedDate,
      }),
      dataType: "json", // 預期會接收到回傳資料的格式： json | xml | html
      success: function (data) {
        if (data.msg == "returnChart success") {
          $("textarea.chart").val("");
          // console.log(data.list.replace(/\\n/g, "<br>").replace(/\"/g, ""));
          // console.log(document.querySelector("#chart"));
          // console.log(data.list);
          if (data.list == "null") {
            $("textarea.chart").val("尚未填寫病歷");
            return;
          }
          $("textarea.chart").val(
            data.list.replace(/\"/g, "").replace(/\\n/g, "\r\n")
          );
        } else {
          $("textarea.chart").val("");
        }

        $("textarea.textareaChart").css(
          "height",
          $("textarea.textareaChart").prop("scrollHeight")
        );
      },
    });
  });

  $("button.chart").on("click", function () {
    console.log("here in button.chart");
    let selectedID = $("select.patientID :selected").text();
    let selectedDate = $("select.patientDate :selected").text();
    // if ($("*:invalid") == 0) {
    if (selectedDate == "請選擇日期") {
      $("textarea.chart").val("");
      alert("請選擇日期");
      return;
    }
    if ($("textarea.chart").val() == "") {
      $("textarea.chart").val("");
      alert("請填寫病歷");
      return;
    }
    $.ajax({
      url: "http://localhost:8080/Proj_Yokult/api/0.01/doctor/saveChart", // 資料請求的網址
      type: "POST", // GET | POST | PUT | DELETE | PATCH
      data: JSON.stringify({
        doctorId: drID,
        patientIdcard: selectedID,
        bookingDate: selectedDate,
        chart: $("textarea.chart").val(),
      }),
      dataType: "json", // 預期會接收到回傳資料的格式： json | xml | html
      success: function (data) {
        if (data.msg == "updateChart success") {
          alert("儲存成功");
        }
      },
    });
    // }
  });
  $("button.dr1").on("click", function () {
    console.log($("button.dr1"));
    $.ajax({
      url: "http://localhost:8080/Proj_Yokult/api/0.01/doctor/nextOne", // 資料請求的網址
      type: "POST", // GET | POST | PUT | DELETE | PATCH
      data: JSON.stringify({
        doctorId: doctorId1,
      }), // 將物件資料(不用雙引號) 傳送到指定的 url
      dataType: "json", // 預期會接收到回傳資料的格式： json | xml | html
      success: function (data) {
        console.log(data.msg);
        if (data.msg == "nextOne success") {
          $("span.dr1").text(`${data.bookingNumber}號 ${data.patientIdcard}`);
        } else if (data.msg == "finish") {
          $("span.dr1").text("看診結束");
        }
      },
    });
  });

  $("button.dr2").on("click", function () {
    console.log("here in dr2 next one");
    $.ajax({
      url: "http://localhost:8080/Proj_Yokult/api/0.01/doctor/nextOne", // 資料請求的網址
      type: "POST", // GET | POST | PUT | DELETE | PATCH
      data: JSON.stringify({
        doctorId: doctorId2,
      }), // 將物件資料(不用雙引號) 傳送到指定的 url
      dataType: "json", // 預期會接收到回傳資料的格式： json | xml | html
      success: function (data) {
        console.log(data);
        console.log(data.msg);
        if (data.msg == "nextOne success") {
          $("span.dr2").text(
            `${data.checkinVO.bookingNumber}號 ${data.checkinVO.patientIdcard}`
          );
        } else if (data.msg == "finish") {
          $("span.dr2").text("看診結束");
        }
      },
    });
  });

  function init() {
    $.ajax({
      url: "http://localhost:8080/Proj_Yokult/api/0.01/booking/nowNum", // 資料請求的網址
      type: "POST", // GET | POST | PUT | DELETE | PATCH
      data: JSON.stringify({
        doctorId: doctorId1,
      }), // 將物件資料(不用雙引號) 傳送到指定的 url
      dataType: "json", // 預期會接收到回傳資料的格式： json | xml | html
      success: function (data) {
        console.log(data.msg);
        if (data.msg == "nowNum success") {
          $("span.dr1").text(`${data.bookingNumber}號 ${data.patientIdcard}`);
        } else if (data.msg == "no nowNum") {
          $("span.dr1").text("--");
        }
      },
    });
    $.ajax({
      url: "http://localhost:8080/Proj_Yokult/api/0.01/booking/nowNum", // 資料請求的網址
      type: "POST", // GET | POST | PUT | DELETE | PATCH
      data: JSON.stringify({
        doctorId: doctorId2,
      }),
      dataType: "json",
      success: function (data) {
        console.log(data.msg);
        if (data.msg == "nowNum success") {
          $("span.dr2").text(`${data.bookingNumber}號 ${data.patientIdcard}`);
        } else if (data.msg == "no nowNum") {
          $("span.dr2").text("--");
        }
      },
    });
  }

  init();

  setInterval(function () {
    // 現在日期時間
    var now = new Date();
    var dateString = `叫號更新時間 : ${now.getFullYear()}/${
      now.getMonth() + 1
    }/${now.getDate()}  ${now.getHours()}: ${now.getMinutes()}: ${now.getSeconds()}`;
    $(".time").html(dateString);
  }, 1000);
});
