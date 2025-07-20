
function SaveItem({save , isActive , onLoad , onDelete , onSave}) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + "" + date.toLocaleTimeString();
    };

    return (
        <div className = {`saveItem ${isActive ? "active" : ""}`}>
            <div className = "saveInfo" onClick = {() => onLoad(save.id)}>
                <h3> {save.name || save.playerName} </h3>
                <p> Last Played: {formatDate(save.date)}</p>
            </div>

            <div className = "saveActions">
                {isActive && (
                    <button className = "overwrite" onClick = {(event) => {event.stopPropagation();
                        onSave(save.id);}} style = {{marginRight: "10px"}}> Save </button>)}

            <button className = "deleteSave" onClick = {(event) => {event.stopPropagation();
                onDelete(save.id);}}> Delete </button>
            </div>
        </div>
    );
}

export default SaveItem;