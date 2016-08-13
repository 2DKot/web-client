var endpoint = "http://" + config.backend.ip + ":" + config.backend.port + "/";
var token = localStorage.getItem('token');

interface RequestOptions {
    method: String,

}

export default function request(url: string, method: string, data: Object) {
    var options: RequestInit = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    };
    if(method.toLowerCase() != 'get') {
        options.body = JSON.stringify(data);
    }
    return fetch(endpoint + url, options).then(response => {
        if(response.status==400) {
            console.log(response.status, response.statusText)
            response.json().then(data=>{
                console.log(data.message)
            });
            return null;            
        } else if (response.status == 401) {
            localStorage.removeItem('token');
        }
        return response.json();
    })
}
