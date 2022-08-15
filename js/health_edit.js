const topics = JSON.parse(sessionStorage.getItem("topics"));

window.onload = (e) => {
    //topicList initialization
    if (topics !== null) {
        let id = window.location.search.slice(1).split("=")[1];
        topics.forEach((t) => {
            if (t.topid == id) {
                $("#topic_title").val(t.title);
                $("#topic_foreword").val(t.foreword);
                $("#topic_content").val(t.content);
                // need add topic sort
            }
        });
    }
};

function getTopic(id) {
    console.log("id: ", id);
    topics.forEach((t) => {
        if (t.topid == id) {
            return t;
        }
    });
}
