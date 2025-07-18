import { Link } from "react-router-dom";


function Navbar({hasActiveSave}) {
    return (
        <nav className = "navbar">
            <div className = "logo">
                <Link to = "/"> Strategy RPG</Link>
            </div>

            <div className = "navbarLinks">
                <Link to = "/saves" className = "navbarLink"> Saves </Link>
                {hasActiveSave && (
                    <>
                        <Link to = "/worldMap" className = "navbarLink"> World Map </Link>
                        <Link to = "/unitSelect" className = "navbarLink"> Units </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;