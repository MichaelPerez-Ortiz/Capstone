

const savesListKey = "strategyRpgSaves";


export const getSavesList = () => {
    const savesList = localStorage.getItem(savesListKey);
    return savesList ? JSON.parse(savesList) : [];
};



export const createNewSave = (playerName = "player") => {
    const saveId = `save_${Date.now()}`;
    const newSave = {
        id: saveId ,
        playerName ,
        currentChapter: 1 ,
        completedChapters: [] ,
        unlockedUnits: []
    };

    return saveGame(newSave)
};


export const saveGame = (saveData) => {
    const savesList = getSavesList();
    const saveId = saveData.id || `save_${Date.now()}`;

    const updateSaveData = {
        ...saveData ,
        id: saveId ,
        lastSaved: new Date().toISOString()
    };

    const existingSaveIndex = savesList.findIndex(save => save.id === saveId);
    if(existingSaveIndex >= 0) {
        savesList[existingSaveIndex] = {
            id: saveId ,
            playerName: saveData.playerName || savesList[existingSaveIndex].playerName ,
            date: new Date().toISOString()
        };
    } else {
        savesList.push({
            id: saveId ,
            playerName: saveData.playerName || "New Save" ,
            date: new Date().toISOString()
        });
    }

    localStorage.setItem(savesListKey , JSON.stringify(savesList));
    localStorage.setItem(saveId , JSON.stringify(updateSaveData));

    return updateSaveData;
};

export const loadGame = (saveId) => {
    const saveData = localStorage.getItem(saveId);
    return saveData ? JSON.parse(saveData) : null;
};

export const deleteSave = (saveId) => {
    const savesList = getSavesList();
    const updatedList = savesList.filter(save => save.id !== saveId);
    localStorage.setItem(savesListKey , JSON.stringify(updatedList));

    localStorage.removeItem(saveId);
};