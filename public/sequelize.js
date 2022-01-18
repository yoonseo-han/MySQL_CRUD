//When click user name (one of the row in table), load comment
document.querySelectorAll('#user-list tr').forEach((user) => {
    user.addEventListener('click', () => {
        const id = user.querySelector('td').textContent;
        getComment(id);
    });
});

//When submit new user info
document.getElementById('user-form').addEventListener('submit', async(event) => {
    event.preventDefault();
    const name = event.target.username.value;
    const age = event.target.age.value;
    const married = event.target.married.checked;
    console.log(name, 'HEEEEE');
    if(!name) { 
        return alert('Type name');
    }
    if(!age) {
        return alert('Type age');
    }
    try {
        //Add the input data to DB
        await axios.post('/users', {name, age, married});
        getUser();
    } catch(err) {
        console.log(err);
    }
    event.target.username.value ='';
    event.target.age.value='';
    event.target.married.checked = false;
});

//When writed down comment
document.getElementById('comment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = e.target.userID.value;
    const comment = e.target.comment.value;
    if(!id) {
        return alert('Type User ID');
    }
    if(!comment) {
        return alert('Type comment');
    }
    try {
        await axios.post('/comments', {id, comment});
        getComment(id);
    } catch(err) {
        console.log(err);
    }
    e.target.userID.value = '';
    e.target.comment.value ='';
});

//Load user to table
async function getUser() {
    try {
        console.log('HEllo');
        const res = await axios.get('/users');
        const users = res.data;
        console.log(users);
        const tbody = document.querySelector('#user-list tbody');
        tbody.innerHTML = '';
        users.map(function(user) {
            const row = document.createElement('tr');
            row.addEventListener('click', ()=> {
                getComment(user.id);
            });
            //Row cell added
            let td = document.createElement('td');
            td.textContent = user.id;
            row.appendChild(td);
            td = document.createElement('td');
            td.textContent = user.name;
            row.appendChild(td);
            td = document.createElement('td');
            td.textContent = user.age;
            row.appendChild(td);
            td = document.createElement('td');
            td.textContent = user.married? 'Married' : 'Single';
            row.appendChild(td);
            tbody.appendChild(row);
        });
    } catch(err) {
        console.log(err);
    }
}

//Load comment
async function getComment(id) {
    try {
        //Get list of comments from url
        const res = await axios.get(`users/${id}/comments`);
        const comments = res.data;
        const tbody = document.querySelector('#comment-list tbody');
        tbody.innerHTML = '';
        comments.map(function(comment) {
            //Add row to table
            const row = document.createElement('tr');
            let td = document.createElement('td');
            td.textContent = comment.id;
            row.appendChild(td);
            td = document.createElement('td');
            td.textContent = comment.User.name;
            row.appendChild(td);
            td = document.createElement('td');
            td.textContent = comment.comment;
            row.appendChild(td);
            //Edit button
            const edit = document.createElement('button');
            edit.textContent = 'Edit';
            edit.addEventListener('click', async () => {
                const newComment = new prompt('Type the new comment');
                if(!newComment) {
                    return alert('Have to write down new comment');
                } 
                try {
                    //Update comment to DB using patch request
                    await axios.patch(`/comments/${comment.id}`, {comment: newComment});
                    getComment(id);
                } catch(err) {
                    console.log(err);
                }
            });
            //Remove button
            const remove = document.createElement('button');
            remove.textContent = 'Remove';
            remove.addEventListener('clicl', async () => {
                try {
                    await axios.delete(`/comments/${comment.id}`);
                    getComment(id);
                } catch(err) {
                    console.log(err);
                }
            });
            //Add update and remove button
            td = document.createElement('td');
            td.appendChild(edit);
            row.appendChild(td);
            td = document.createElement('td');
            td.appendChild(remove);
            row.appendChild(td);
            //Add comment row to table body
            tbody.appendChild(row);
        });
    } catch (err) {
        console.log(err);
    }
}