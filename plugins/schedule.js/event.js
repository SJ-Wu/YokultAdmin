$(function () {
  //側邊表員工 假別資料
  var getId = {
    staff_id: "tga001",
  };

  $.ajax({
    url: "http://localhost:8080/Yokult/getStaffLevenData",
    type: "POST", // GET | POST | PUT | DELETE
    data: JSON.stringify(getId),
    contentType: "application/json",
    success: function (rsp) {
      // console.log(rsp);
      var rspSatff = rsp.staff;
      $("#namela").text(rspSatff.staff_name);
      $("#nameInputla").text(rspSatff.staff_name);
      $("#b_reduce").text(rspSatff.official_leave); //基本
      $("#s_reduce").text(rspSatff.annual_leave); //特休
      $("#t_reduce").text(rspSatff.personal_leave); //事假
      $("#staffId").val(rspSatff.staff_id); //事假

      var rspShiftSchedule = rsp.shiftSchedule;
      rspShiftSchedule.forEach((schedule) => {
        var dayoffcolor;
        var relax = schedule.shiftScheduleTypeOfLeave;
        if (relax == "b") {
          dayoffcolor = "red";
        } else if (relax == "o") {
          dayoffcolor = "gray";
        } else if (relax == "t") {
          dayoffcolor = "blue";
        } else if (relax == "s") {
          dayoffcolor = "green";
        }

        var scheduleDate = moment(schedule.scheduleDate).format("YYYY-MM-DD");
        var myEvent = {
          id: rspSatff.staff_name + scheduleDate + apm + relax,
          title: rspSatff.staff_name + "_" + apmString,
          allDay: true,
          start: scheduleDate,
          color: dayoffcolor,
        };
        calendar.addEvent(myEvent);
      });
    },
    error: function (xhr) {
      console.log("wrong");
    },
  });

  // initialize the external events----------------------------------------------
  function ini_events(ele) {
    ele.each(function () {
      var eventObject = {
        title: $.trim($(this).text()), // use the element's text as the event title
      };
      $(this).data("eventObject", eventObject);
    });
  }
  ini_events($("#external-events div.external-event"));

  var calendarEl = document.getElementById("calendar");

  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialDate: "2022-09-01",
    validRange: {
      start: "2022-08-01",
      end: "2022-10-01",
    },
    showNonCurrentDates: false,
    //調月曆長度=============================
    height: 530,
    //轉中文================================
    initalView: "dayGridMonth",
    locale: "zh-tw",
    navlinks: true,
    //月曆頁面表頭，工具列===================
    headerToolbar: {
      left: "prev,next",
      center: "title",
      right: "",
    },

    themeSystem: "bootstrap",

    //選擇日期，跳表單框==================================
    dateClick: function (data) {
      document.getElementById("type").value = "new";
      document.getElementById("eventFormButtonreremove").hidden = true;
      $("#dateInput").val(moment(data.date).format("YYYY-MM-DD")); //事件日期，預設填入被點選的日期，不得修改
      if (addevenDayForTwo(data)) {
        //顯示編輯畫面事件
        $("#eventFormModal").modal("show"); //顯示編輯視窗，供使用者編輯
      }
    },

    //月曆上 事件點擊 表單======================================
    eventClick: function (dataxxx) {
      document.getElementById("type").value = "update";
      document.getElementById("eventFormButtonreremove").hidden = false; //刪除鍵修改表單 顯示
      console.log(dataxxx);
      var APm = dataxxx.event._def.title;
      APm = APm.substring(APm.length - 2, APm.length); //取最後兩個值
      var leaveType = dataxxx.event._def.ui.backgroundColor;
      if (APm == "早班") {
        document.querySelector("#eventTimeInputla").value = "am";
      } else {
        document.querySelector("#eventTimeInputla").value = "pm";
      }

      if (leaveType == "red") {
        document.querySelector("#relaxInputla").value = "b";
      } else if (leaveType == "gray") {
        document.querySelector("#relaxInputla").value = "o";
      } else if (leaveType == "blue") {
        document.querySelector("#relaxInputla").value = "t";
      } else if (leaveType == "green") {
        document.querySelector("#relaxInputla").value = "s";
      }

      var eventDate = dataxxx.event._instance.range.start;
      $("#dateInput").val(moment(eventDate).format("YYYY-MM-DD")); //事件日期
      var oldName = $("#nameInputla").text();
      var oldDate = moment(eventDate).format("YYYY-MM-DD");
      var oldTime = document.querySelector("#eventTimeInputla").value;
      var oldLeaveType = document.querySelector("#relaxInputla").value;
      $("#oldId").val(oldName + oldDate + oldTime + oldLeaveType);
      $("#eventFormModal").modal("show");
    },
  });

  // 一天，畫假上限兩人===============================
  function addevenDayForTwo(data) {
    // console.log(data);
    var perDay = data.dayEl.innerText; //捕捉單日裡的內文
    var perDayCount = perDay.split("\n"); //用斷行切割
    // console.log(perDayCount.length);
    if (perDayCount.length == 3) {
      alert("單日僅能畫休兩位");
      return false;
    } else {
      return true; //回到顯示視窗
    }
  }

  //取消按鍵，返回初始值====================================
  document
    .querySelector("#eventFormButtonCancel")
    .addEventListener("click", function () {
      cleanValue();
    });

  //x按鍵，返回初始值======================================
  document.querySelector("#inputxxx").addEventListener("click", function (e) {
    cleanValue();
  });

  // 確定按鍵，資料呈現==================================
  document
    .getElementById("eventFormButtonsure")
    .addEventListener("click", function () {
      var type = document.getElementById("type").value;
      console.log(type);
      var nameInputla = $("#nameInputla");
      var dateInput = $("#dateInput");
      var optiontime = $("#eventTimeInputla option:selected");
      var optionrelax = $("#relaxInputla option:selected");
      var relax = optionrelax.val();

      //選單正確填入，判斷===============
      var reduceFlag = checkSelect(relax);
      if (reduceFlag) {
        //在第一次表單輸入成功後，第二次填選資料，表單也不會收合
        document
          .getElementById("eventFormButtonsure")
          .removeAttribute("data-dismiss");
        // alert(errorMsg);
      } else {
        //顏色分假別=================
        var dayoffcolor;
        var reduce = document.getElementById(relax + "_reduce");
        if (relax == "b") {
          dayoffcolor = "red";
          reduce.innerHTML -= 0.5;
        } else if (relax == "o") {
          dayoffcolor = "gray";
        } else if (relax == "t") {
          dayoffcolor = "blue";
          reduce.innerHTML -= 0.5;
        } else if (relax == "s") {
          dayoffcolor = "green";
          reduce.innerHTML -= 0.5;
        }

        //呈現資料===================
        var myEvent = {
          id: nameInputla.text() + dateInput.val() + optiontime.val() + relax,
          title: nameInputla.text() + "_" + optiontime.text(),
          allDay: true,
          start: dateInput.val(),
          color: dayoffcolor,
        };

        //新增表的確認按鍵判斷
        if (document.getElementById("type").value == "new") {
          //修改表的確認按鍵判斷=============================
        } else if (document.getElementById("type").value == "update") {
          deleteData();
        }

        //加入事件====================
        calendar.addEvent(myEvent);
        document
          .getElementById("eventFormButtonsure")
          //加入收合表單屬性
          .setAttribute("data-dismiss", "modal");
        //事件確定鍵，加入後 選單重置
        cleanValue();
      }
    });

  //休假別，判斷==========================================
  document
    .getElementById("relaxInputla")
    .addEventListener("change", function () {
      var relax = this.value;
      checkSelect(relax);
    });
  //判斷表單欄位值
  function checkSelect(relax) {
    if (document.getElementById("type").value == "update") {
      var oldEventId = document.getElementById("oldId").value;
      var oldRelax = oldEventId.substring(
        oldEventId.length - 1, //取最後一個值
        oldEventId.length
      );
      if (oldRelax == relax) {
        return false;
      }
    }

    var optiontime = $("#eventTimeInputla option:selected");
    var optionrelax = $("#relaxInputla option:selected");
    var reduce = document.getElementById(relax + "_reduce");
    if (relax == "b") {
      if (reduce.innerHTML == 0) {
        alert("基本假已使用完，請選擇其他假別");
        document.querySelector("#relaxInputla").value = 0;
        return true;
      }
    } else if (relax == "s") {
      if (reduce.innerHTML == 0) {
        alert("特休已使用完，請選擇其他假別");
        document.querySelector("#relaxInputla").value = 0;
        return true;
      }
    } else if (relax == "t") {
      if (reduce.innerHTML >= 14) {
        alert("當年度事假已使用完，請選擇其他假別");
        document.querySelector("#relaxInputla").value = 0;
        return true;
      }
    }
    if (optiontime.val() == "0") {
      alert("請選擇正確班別");
      return true;
    } else if (optionrelax.val() == "0") {
      alert("請選擇正確假別");
      return true;
    }
    return false;
  }

  //清空表單方法=============
  function cleanValue() {
    document.querySelector("#eventTimeInputla").value = 0;
    document.querySelector("#relaxInputla").value = 0;
  }

  //刪除鍵 移除事件=========================================
  $("#eventFormButtonreremove").click(function () {
    if (confirm("你確定嗎？")) {
      deleteData();
      cleanValue();
    }
    document
      .getElementById("eventFormButtonreremove")
      //加入收合表單屬性
      .setAttribute("data-dismiss", "modal");
  });

  //刪除事件方法=============
  function deleteData() {
    var oldEventId = document.getElementById("oldId").value;
    var relax = oldEventId.substring(oldEventId.length - 1, oldEventId.length); //取最後一個值
    // console.log(oldid);
    var reduce = document.getElementById(relax + "_reduce");
    if (relax == "b") {
      reduce.innerHTML -= 0.5;
    } else if (relax == "o") {
    } else if (relax == "t") {
      reduce.innerHTML -= 0.5;
    } else if (relax == "s") {
      reduce.innerHTML -= 0.5;
    }

    var deleteEvent = calendar.getEventById(oldEventId);
    deleteEvent.remove();
  }

  //(最後送出)抓所有資料 送出======================================
  $("#allSubmit").click(function () {
    var events = calendar.getEvents();
    let evenArr = new Array();
    events.forEach(function (element) {
      var evId = element["_def"]["publicId"];
      evenArr.push(evId);
    });

    var eventData = {
      staffId: $("#staffId").val(),
      annual: $("#s_reduce").html(),
      personal: $("#t_reduce").html(),
      official: $("#b_reduce").html(),
      eventId: evenArr,
    };
    console.log($("#staffId").val()),
      console.log($("#b_reduce").html()),
      console.log($("#s_reduce").html()),
      console.log($("#t_reduce").html()),
      $.ajax({
        url: "http://localhost:8080/Yokult/insertShiftSchedule",
        type: "POST", // GET | POST | PUT | DELETE
        data: JSON.stringify(eventData),
        contentType: "application/json",
        success: function (rsp) {
          if (rsp == "success") {
            alert("送出成功");
          } else {
            alert("送出失敗");
          }
        },
        error: function (xhr) {
          alert("送出失敗");
        },
      });
  });

  //=======================很重要!!!!!月曆呈現=====================//
  calendar.render();
  //=======================很重要!!!!!月曆的靈魂===================//

  //自動填入
  $("#fastInput").click(function () {
    myEvent = {
      id: "陳花花" + "2022-09-03" + "pm" + "s",
      title: "陳花花_" + "晚班",
      allDay: true,
      start: "2022-09-03",
      color: "green",
    };
    calendar.addEvent(myEvent);
    console.log("get");
    var myEvent = {
      id: "陳花花" + "2022-09-06" + "am" + "b",
      title: "陳花花_" + "早班",
      allDay: true,
      start: "2022-09-06",
      color: "red",
    };
    calendar.addEvent(myEvent);
    myEvent = {
      id: "陳花花" + "2022-09-06" + "pm" + "b",
      title: "陳花花_" + "晚班",
      allDay: true,
      start: "2022-09-06",
      color: "red",
    };
    calendar.addEvent(myEvent);
    myEvent = {
      id: "陳花花" + "2022-09-08" + "am" + "b",
      title: "陳花花_" + "早班",
      allDay: true,
      start: "2022-09-08",
      color: "red",
    };
    calendar.addEvent(myEvent);
    myEvent = {
      id: "陳花花" + "2022-09-08" + "pm" + "b",
      title: "陳花花_" + "晚班",
      allDay: true,
      start: "2022-09-08",
      color: "red",
    };
    calendar.addEvent(myEvent);
    var myEvent = {
      id: "陳花花" + "2022-09-11" + "am" + "b",
      title: "陳花花_" + "早班",
      allDay: true,
      start: "2022-09-11",
      color: "red",
    };
    calendar.addEvent(myEvent);
    myEvent = {
      id: "陳花花" + "2022-09-11" + "pm" + "b",
      title: "陳花花_" + "晚班",
      allDay: true,
      start: "2022-09-11",
      color: "red",
    };
    calendar.addEvent(myEvent);
    myEvent = {
      id: "陳花花" + "2022-09-13" + "am" + "s",
      title: "陳花花_" + "早班",
      allDay: true,
      start: "2022-09-13",
      color: "green",
    };
    calendar.addEvent(myEvent);
    myEvent = {
      id: "陳花花" + "2022-09-13" + "pm" + "s",
      title: "陳花花_" + "晚班",
      allDay: true,
      start: "2022-09-13",
      color: "green",
    };
    calendar.addEvent(myEvent);
    myEvent = {
      id: "陳花花" + "2022-09-16" + "am" + "s",
      title: "陳花花_" + "早班",
      allDay: true,
      start: "2022-09-16",
      color: "green",
    };
    calendar.addEvent(myEvent);
    myEvent = {
      id: "陳花花" + "2022-09-16" + "pm" + "s",
      title: "陳花花_" + "晚班",
      allDay: true,
      start: "2022-09-16",
      color: "green",
    };
    calendar.addEvent(myEvent);
    var myEvent = {
      id: "陳花花" + "2022-09-23" + "am" + "b",
      title: "陳花花_" + "早班",
      allDay: true,
      start: "2022-09-23",
      color: "red",
    };
    calendar.addEvent(myEvent);
    myEvent = {
      id: "陳花花" + "2022-09-23" + "pm" + "b",
      title: "陳花花_" + "晚班",
      allDay: true,
      start: "2022-09-23",
      color: "red",
    };
    calendar.addEvent(myEvent);
    myEvent = {
      id: "陳花花" + "2022-09-28" + "am" + "b",
      title: "陳花花_" + "早班",
      allDay: true,
      start: "2022-09-28",
      color: "red",
    };
    calendar.addEvent(myEvent);
    myEvent = {
      id: "陳花花" + "2022-09-28" + "pm" + "b",
      title: "陳花花_" + "晚班",
      allDay: true,
      start: "2022-09-28",
      color: "red",
    };
    calendar.addEvent(myEvent);
    $("#b_reduce").html(3);
    $("#s_reduce").html(4.5);
  });
});
