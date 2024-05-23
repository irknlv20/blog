function deleteAccount(id){
    axios.post(`/api/signOut`)
    axios.delete(`/api/deleteownblogs/${id}`).then((data) => {
        if (data.status == 200) {
            axios.delete(`/api/deleteaccount/${id}`).then((data) => {
                if (data.status == 200) {
                    location.replace(`/login`);
                } else if (data.status == 404) {
                    location.replace(`/not-found`);
                }
            });
        } else if (data.status == 404) {
            location.replace(`/not-found`);
        }
    });
}