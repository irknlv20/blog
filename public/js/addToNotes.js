function addToNotes(blogId, userId){
    axios.post(`/api/addtonotes/${blogId}&${userId}`).then((data) => {
        if (data.status == 200) {
            location.replace(`/blog/${blogId}`);
        } else if (data.status == 404) {
            location.replace(`/not-found`);
        }
    });
}
function deleteFromNotes(blogId, userId){
    axios.delete(`/api/deletefromnotes/${blogId}&${userId}`).then((data) => {
        if (data.status == 200) {
            location.replace(`/blog/${blogId}`);
        } else if (data.status == 404) {
            location.replace(`/not-found`);
        }
    });
}