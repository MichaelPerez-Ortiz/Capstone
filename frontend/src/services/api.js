import axios from "axios"

const BASE_URL = import.meta.env.VITE_BASE_URL


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


//PATCH

export const updateUnit = async(id , unitData) => {
try {

    const response = await axios.patch(`${BASE_URL}/units/${id}` , unitData);
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


//PATCH

export const updateMap = async(id , mapData) => {
try {

    const response = await axios.patch(`${BASE_URL}/maps/${id}` , mapData)
    return response.data;

    } catch(error) {
        console.error(`Error Updating Map ${id}:` , error);
        throw error;
    }
};




//Dialogue calls

//GET

export const getDialogue = async(stageId , category) => {
try {

    const response = await axios.get(`${BASE_URL}/dialogue/${stageId}/${category}`);
    return response.data;

    } catch(error) {
        console.error("Error Getting Dialogue Scene:" , error);
        throw error;
    }
};

//POST

export const createDialogue = async(dialogueData) => {
try {

    const response = await axios.post(`${BASE_URL}/dialogue` , dialogueData);
    return response.data;

    } catch(error) {
        console.error("Error Creating Dialogue Scene:" , error);
        throw error;
    }
};


//PATCH

export const updateDialogue = async(id , dialogueData) => {
try {

    const response = await axios.patch(`${BASE_URL}/dialogue/${id}` , dialogueData);
    return response.data;

    } catch(error) {
        console.error(`Error Updating Dialogue Scene ${id}:` , error);
        throw error;
    }
};



//World Map Calls


//GET

export const getWorldMap = async() => {
try {

    const response = await axios.get(`${BASE_URL}/worldMap`);
    return response.data;
  } catch(error) {
    console.error("Erro Getting World Map:" , error);
    throw error;
  }
};

//POST

export const saveWorldMap = async(worldMapData) => {
try {

    const response = await axios.post(`${BASE_URL}/worldMap` , worldMapData);
    return response.data;
  } catch(error) {
    console.error("Erro Saving World Map:" , error);
    throw error;
  }
};

//PATCH

export const updateWorldMap = async(id , worldMapData) => {
try {

    const response = await axios.patch(`${BASE_URL}/worldMap/${id}` , worldMapData);
    return response.data;
   } catch(error) {
    console.error("Error Updating World Map:" , error)
    throw error;
   }
};
