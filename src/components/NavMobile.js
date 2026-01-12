import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { navigation } from "../data";
import AuthContext from "../context/AuthContext";

const NavMobile = () => {
    const { user } = useContext(AuthContext);
	const navItems = navigation.map((item, index) => (
		<li key={index}>
			<Link
				to={item.href}
				className={`text-black capitalize hover:border-b transition-all`}
			>
				{item.name}
			</Link>
		</li>
	));

	return (
		<nav className='bg-white w-full h-full shadow-2xl'>
			<ul className='capitalize text-center h-full flex flex-col items-center justify-center gap-y-5 text-xl font-medium'>
				{navItems}
                {user?.isAdmin && (
                    <li>
                        <Link to="/admin" className="text-black capitalize hover:border-b transition-all">
                            admin
                        </Link>
                    </li>
                )}
                {user ? (
                    <li>
                        <Link to="/profile" className="text-black capitalize hover:border-b transition-all">
                            profile
                        </Link>
                    </li>
                ) : (
                    <li>
                        <Link to="/login" className="text-black capitalize hover:border-b transition-all">
                            login
                        </Link>
                    </li>
                )}
			</ul>
		</nav>
	);
};

export default NavMobile;
