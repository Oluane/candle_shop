import "./DropdownMobile.scss";

import React, { useState } from "react";

import IconSvg from "../IconSvg/IconSvg";

const DropdownMobile = ({ candleId, content }) => {
	const [showDropdown, setShowDropdown] = useState(false);
	return (
		<div
			className="dropdownMobile"
			onClick={() => setShowDropdown(!showDropdown)}
			onFocus={() => console.log("toto")}
		>
			<div className="dropdownIcon">
				<IconSvg iconName="threeDots" />
			</div>
			<div className={"dropdownContent" + (showDropdown ? " visible" : "")}>
				{content.map((option, i) => {
					return (
						<p
							className="dropdownOption usualText"
							onClick={() => option.func(candleId)}
						>
							{option.title}
						</p>
					);
				})}
			</div>
		</div>
	);
};

export default DropdownMobile;
