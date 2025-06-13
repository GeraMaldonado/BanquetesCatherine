const BASE_URL = "http://127.0.0.1:5000";


export const postData = async (url, data) => {
    try {
        const response = await fetch(BASE_URL + url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            return { error: true, ...result };
        }

        return result ;

    } catch (err) {
        return { error: true, message: err.message };
    }
};

export const putData = async (url, data) => {
    try {
        const response = await fetch(BASE_URL + url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            return { error: true, ...result };
        }

        return result ;

    } catch (err) {
        return { error: true, message: err.message };
    }
};

export const deleteData = async (url) => {
    try {
        const response = await fetch(BASE_URL + url, {
            method: 'DELETE',
        });

        const result = await response.json();

        if (!response.ok) {
            return { error: true, ...result };
        }

        return result ;

    } catch (err) {
        return { error: true, message: err.message };
    }
};

export const getData = async (url) => {
    try {
        const response = await fetch(BASE_URL + url);

        const result = await response.json();

        if (!response.ok) {
            return { error: true, ...result };
        }

        return result;

    } catch (err) {
        return { error: true, message: err.message };
    }
};





export function paramsFromObjetct(params) {
    
    const args = Object.keys(params).map(key => `${key}=${params[key]}`)

    return args.join("&")

}