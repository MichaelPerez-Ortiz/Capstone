import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_URL


//Unit calls

//GET

export const getUnits = async() => {
try {

    const response = await axios.get(`${BASE_URL}/units`);
    return response.data;

    } catch(error) {
        console.error("Error Getting Units:" , error);
        throw error;
    }
};

export const getUnitById = async(id) => {
try {

    const response = await axios.get(`${BASE_URL}/units/${id}`);
    return response.data;

    } catch(error) {
        console.error(`Error Getting Unit ${id}:` , error);
        throw error;
    }
};


//POST

export const createUnit = async(unitData) => {
try {

    const response = await axios.post(`${BASE_URL}/units` , unitData);
    return response.data;

    } catch(error) {
        console.error("Error Creating Unit:" , error);
        throw error;
    }
};


//PUT

export const updateUnit = async(id , unitData) => {
try {

    const response = await axios.put(`${BASE_URL}/units/${id}` , unitData);
    return response.data;

    } catch(error) {
        console.error(`Error Updating Unit ${id}:` , error);
        throw error;
    }
};



//Map calls


//GET
export  const getMaps = async() => {
try {

    const response = await axios.get(`${BASE_URL}/maps`);
    return response.data;

    } catch(error) {
        console.error("Error Getting Maps:" , error);
        throw error;
    }
};    


export const getMapByChapter = async(chapter) => {
try {

    const response = await axios.get(`${BASE_URL}/maps/${chapter}`);
    return response.data;

    } catch(error) {
        console.error(`Error Getting Chapter ${chapter} Map:` , error);
        throw error;
    }
};  


//POST

export const createMap = async(mapData) => {
try {

    const response = await axios.post(`${BASE_URL}/maps` , mapData)
    return response.data;

    } catch(error) {
        console.error("Error Creating Map:" , error);
        throw error;
    }
};


