
function SaveItem({save , isActive , onLoad , onDelete}) {
    const formatDate = (dateString) => {
        return date.toLocalDateString() + "" + date.toLocalTimeString();
    };

    return (
        <div className = {`saveItem ${isActive ? "active" : ""}`}>
            <div className = "saveInfo" onClick = {() => onLoad(save.id)}>
                <h3> {save.name} </h3>
                <p> Last Played: {formatDate(save.date)}</p>
            </div>

            <button className = "deleteSave" onClick = {(event) => {event.stopPropagation();
                onDelete(save.id);}}> Delete </button>
        </div>
    );
}

export default SaveItem;