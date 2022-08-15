window.onload = (e) => {
    //topicList initialization
    axios
        .get("http://localhost:8080/Proj_Yokult/api/0.01/topic")
        .then((response) => {
            let msg = response.data["msg"];
        if (msg === "success") {
            let topics = response.data["topics"];
            // console.log(topics);
            topics.forEach((topic) => {
                // console.log(topic);
                addList(topic);
            });
        } else {
            console.log(response.data["msg"]);
        }
    })
    .catch((error) => console.log(error));    

    //Remove topic
    $("#topicList").on("click", "#btn_delete_topic", (e) => {
        if (confirm("確定清除嗎?")) {
            let topic_id = $(e.target).closest("tr").data("id");
            console.log(topic_id);
            let removeTopic = {};
            removeTopic["TOPID"] = topic_id;
            console.log(removeTopic);
            axios
                .delete(
                    "http://localhost:8080/Proj_Yokult/api/0.01/topic/remove",
                    { data: removeTopic }
                )
                .then((response) => {
                    let msg = response.data["msg"];
                    if (msg === "success"){
                        $(e.target)
                            .closest("tr")
                            .fadeOut(1000, () => {
                                $(e.target).closest("tr").remove();
                            });
                    } else {
                        console.log(response.data["msg"]);
                    }
                })
                .catch((error) => console.log(error));
        }
    });



    //Revise
    $("#topicList").on("click", "btn_reset_topic", (e) => {
       
        
        
            let topics = data.topics;
            sessionStorage.setItem("topics", JSON.stringify(topics));
            let id = window.location.search.slice(1).split('=')[1];
            if (e.id == id) app.innerHTML = addList(e.content) ;
                document.querySelector('#edit').innerHTML +=  `
                <div class="form-group">
                <label for="exampleInputEmail1"
                    >文章標題</label
                >
                <input
                    type="text"
                    name="title"
                    class="form-control"
                    id="exampleInputEmail1"
                    placeholder="請輸入文章標題"
                />${e.title}
            </div>
            <div class="form-group">
                <label for="exampleInputEmail1"
                    >文章引言</label
                >
                <input
                    type="text"
                    name="title"
                    class="form-control"
                    id="exampleInputEmail1"
                    placeholder="請輸入文章引言"
                />${e.foreword}
            </div>
            <label for="genrelist">選擇文章的種類：</label>
            <select id="genrelist">
                <option value="topic1">牙周衛教
                    <option value="topic2">牙齒保健
                        <option value="topic3">美白衛教
                            <option value="topic4">拔牙衛教
                                <option value="topic5">根管治療
                                    <option value="topic6">矯正衛教
                                        <option value="topic7">兒童衛教

                                
                    
            </select>
            

            <!--文章輸入欄位-->
            <p>
            <textarea name="content" class="form-control" id="article" cols="115" rows="10">${e.content}</textarea>
            </p>
        </div>
        <!-- /.card-body -->
        <div class="card-footer">
            <button
                type="submit"
                class="btn btn-primary"
            >
                送出
            </button>`
                
                let msg = response.data["msg"];
            if (msg === "success") {
                let topics = response.data["topics"];
                console.log(topics);
                topics.forEach((topic) => {
                    addList(topic);
                });
            } else {
                console.log(response.data["msg"]);
            }
        
        
       
    

});


function addList(topic){
    let list = `<tr data-id="${topic["topid"]}">
    <td>${topic["topid"]}</td>
    <td>${topic["title"]?? ""}</td>
    <td>${topic["foreword"]?? ""}</td>
    <td>${topic["content"]?? ""}</td>
    <td>${topic["sortid"]?? ""}</td>
    <td>${topic["views"]?? ""}</td>
    <td>${topic["posttime"]?? ""}</td>
    <td>
    <button class="btn-xs btn-light" id="btn_reset_topic" local.href='./index_health.html?id=${id}'>編輯</button>
    <button class="btn-xs btn-light" id="btn_delete_topic">刪除</button>
    </td>
</tr>`;
$("#topicList").append(list);

}





