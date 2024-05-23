function deleteBlog(id, adminId){
    axios.delete(`/api/deleteBlog/${id}`).then((data) => {
        if (data.status == 200) {
            location.replace(`/myblogs/${adminId}`);
        } else if (data.status == 404) {
            location.replace(`/not-found`);
        }
    });
}
function blockUser(id, adminId){
    axios.post(`/api/blockuser/${id}`).then((data) => {
        if (data.status == 200) {
            location.replace(`/myblogs/${adminId}`);
        } else if (data.status == 404) {
            location.replace(`/not-found`);
        }
    });
}
function unlockUser(id, adminId){
    axios.post(`/api/unlockuser/${id}`).then((data) => {
        if (data.status == 200) {
            location.replace(`/myblogs/${adminId}`);
        } else if (data.status == 404) {
            location.replace(`/not-found`);
        }
    });
}
function deleteUser(id, adminId){
    axios.delete(`/api/deleteauthorblogs/${id}`).then((data) => {
        if (data.status == 200) {
            axios.delete(`/api/deleteuser/${id}`).then((data) => {
                if (data.status == 200) {
                    location.replace(`/myblogs/${adminId}`);
                } else if (data.status == 404) {
                    location.replace(`/not-found`);
                }
            });
        } else if (data.status == 404) {
            location.replace(`/not-found`);
        }
    });


}