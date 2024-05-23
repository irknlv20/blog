function blog(id, authorID){
    axios.delete(`/api/deleteBlog/${id}`).then((data) => {
        if (data.status == 200) {
            location.replace(`/myblogs/${authorID}`);
        } else if (data.status == 404) {
            location.replace(`/not-found`);
        }
    });
}
function deleteComments(id, authorID, blogID){
    axios.delete(`/api/deletecomment/${id}&${blogID}`).then((data) => {
        if (data.status == 200) {
            location.replace(`/blog/${blogID}`);
        } else if (data.status == 404) {
            location.replace(`/not-found`);
        }
    });
}

function editComment(comIdx, blogId, commentId, content){
    const comm = document.getElementById(`comment${comIdx}`)
    const editcomm = document.getElementById(`editcomm${comIdx}`)
    editcomm.innerHTML = ""
    comm.innerHTML = `
                    <form action="/api/editcomment" method="POST" class="comm-form">
                        <input name="commId" hidden value="${commentId}">
                        <input name="blogId" hidden value="${blogId}">
                        <input name="content" value="${content}">
                        <button class="edit-comment-btn" type="submit">Сохранить</button>
                    </form>
                    `
}
