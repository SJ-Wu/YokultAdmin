$(function () {
  //getall當月班表
  $.ajax({
    url: "http://localhost:8080/yokult/getScheduleAllData",
    type: "POST", // GET | POST | PUT | DELETE

    success: function (rsp) {
      console.log(rsp);
      rsp.forEach((schedule) => {
        if (schedule.apm == "a") {
          var color = "blue";
        } else if (schedule.apm == "p") {
          var color = "red";
        }
        console.log(schedule);
        var nameInputla = $("#nameInputla");
        var dateInput = $("#dateInput");
        var optiontime = $("#eventTimeInputla option:selected");
        var optionrelax = $("#relaxInputla option:selected");
        var relax = optionrelax.val();
        var myEvent = {
          id: nameInputla.text() + dateInput.val() + optiontime.val() + relax,
          title: schedule.workStaff,
          allDay: true,
          start: schedule.schedule_date,
          color: color,
        };

        calendar.addEvent(myEvent);
      });
    },
    error: function (xhr) {},
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
  // var Draggable = FullCalendar.Draggable;
  // var containerEl = document.getElementById("external-events");
  var calendarEl = document.getElementById("calendar");

  // // initialize the external events---------------------------------------------------
  // new Draggable(containerEl, {
  //   itemSelector: ".external-event",
  //   eventData: function (eventEl) {
  //     return {
  //       title: eventEl.innerText,
  //       backgroundColor: window
  //         .getComputedStyle(eventEl, null)
  //         .getPropertyValue("background-color"),
  //       borderColor: window
  //         .getComputedStyle(eventEl, null)
  //         .getPropertyValue("background-color"),
  //       textColor: window
  //         .getComputedStyle(eventEl, null)
  //         .getPropertyValue("color"),
  //     };
  //   },
  // });

  var calendar = new FullCalendar.Calendar(calendarEl, {
    //調月曆長度=============================
    // height: 530,
    //轉中文================================
    // initalView: "dayGridMonth",
    locale: "zh-tw",
    // navlinks: true,
    //月曆頁面表頭，工具列===================
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "",
    },
    buttonText: {
      today: "今天",
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
          reduce.innerHTML--;
        } else if (relax == "o") {
          dayoffcolor = "gray";
        } else if (relax == "t") {
          dayoffcolor = "blue";
          reduce.innerHTML--;
        } else if (relax == "s") {
          dayoffcolor = "green";
          reduce.innerHTML--;
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
    } else if (relax == "o") {
      reduce.innerHTML++;
    } else if (relax == "t") {
      reduce.innerHTML++;
    } else if (relax == "s") {
      reduce.innerHTML++;
    }

    var deleteEvent = calendar.getEventById(oldEventId);
    deleteEvent.remove();
  }

  //(最後送出)抓所有資料 送出======================================
  $("#allSubmit").click(function () {
    var eventa = calendar.getEvents();
    console.log(eventa);
    eventa.forEach(function (element) {
      var evId = element["_def"]["publicId"];
      var even = calendar.getEventById(evId);
      console.log(evId);
      console.log(even);
      console.log(even.start.toISOString());
    });
  });
  //=======================很重要!!!!!月曆呈現=====================//
  calendar.render();
  //=======================很重要!!!!!月曆的靈魂===================//
});
