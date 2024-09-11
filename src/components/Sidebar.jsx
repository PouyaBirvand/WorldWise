import { Outlet } from 'react-router-dom'
import AppNav from './AppNav'
import Footer from './Footer'
import Logo from './Logo'
import styles from './Sidebar.module.css'
function Sidebar() {
    return (
        <div className={styles.sidebar}>
            <Logo/>
            <AppNav/>
            {/* <p>list of cities</p> */}
            <Outlet/>
            <Footer styles={styles}/>
        </div>
    )
}

export default Sidebar


// index : route defualt 