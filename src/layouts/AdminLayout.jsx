import React from "react";

import HeaderAdmin from "../components/Header/HeaderAdmin";

const AdminLayout = ({ children }) => {
	return (
		<div className="site-container">
			<HeaderAdmin />
			{children}
		</div>
	);
};

export default AdminLayout;
