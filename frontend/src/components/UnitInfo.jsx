

function UnitInfo({unit , onAction}) {
    if(!unit)
        return null;

    const handleAction = (action) => {
        onAction(action , unit);
    };

    const isAlly = unit.loyalty === "ally";
    const canAct = isAlly && !unit.hasMoved;

    return(

        <div className = "unitInfo">
             <div style = {{
                width: "80px" ,
                height: "80px" ,
                overflow: "hidden" ,
                border: "2px solid #6b4423" ,
                position: "relative" ,
                margin: "0 auto 15px auto"
            }}>
                <img src = {unit.portrait} alt = {unit.name}
                style = {{
                    width: "120px" ,
                    height: "120px" ,
                    objectFit: "cover" ,
                    position: "absolute" ,
                    top: "-10px" ,
                    left: "-20px" ,
                }}
                />
               </div> 
               
          <div className = "unitHeader">
            <h3> {unit.name} </h3>
            <p> {unit.class} </p>
          </div>


            <div className = "unitStats">
                <div className = "stat">
                    <span className = "statLabel"> HP </span>
                    <span className = "statValue"> {unit.stats.hp} </span>
                </div>
            </div>
            <div className = "unitStats">
                <div className = "stat">
                    <span className = "statLabel"> ATK </span>
                    <span className = "statValue"> {unit.stats.atk} </span>
                </div>
            </div>
            <div className = "unitStats">
                <div className = "stat">
                    <span className = "statLabel"> DEF </span>
                    <span className = "statValue"> {unit.stats.def} </span>
                </div>
            </div>
            <div className = "unitStats">
                <div className = "stat">
                    <span className = "statLabel"> SPD </span>
                    <span className = "statValue"> {unit.stats.spd} </span>
                </div>
            </div>
            <div className = "unitStats">
                <div className = "stat">
                    <span className = "statLabel"> MOV </span>
                    <span className = "statValue"> {unit.stats.mov} </span>
                </div>
            </div>
            

            <div className = "unitActions">
                {canAct ? (
            <>
                <button onClick = {() => handleAction("move")}> Move </button>
                <button onClick = {() => handleAction("attack")}> Attack </button>
                <button onClick = {() => handleAction("wait")}> Wait </button>
            </>
                ) : (
                    <button onClick = {() => handleAction("close")}> Close </button>
                )}
            </div>
        </div>
    );
}

export default UnitInfo;