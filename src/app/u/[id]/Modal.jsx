import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
	if (!isOpen) return null;

	return (
		<>
			<div
				style={{
					position: "fixed",
					top: "10%",
					margin: "auto",
					padding: "2%",
					zIndex: "2",
					backgroundColor: "rgba(0, 0, 0,0.9)",
					// backgroundColor:"GrayText",
					border: "2px solid #000",
					borderRadius: "10px",
					boxShadow: "2px solid black",
				}}
				className=" fixed w-4/5 md:w-2/5 sm:w-2/5 lg:w-2/5 xl:w-2/5 left-10 sm:left-72 md:left-96 lg:left-96"
			>
				<div >
					
					{children}
					<div onClick={onClose} className="text-center bg-white rounded py-2 px-4 m-1 float-right ">
						<button>close</button>
					</div>
				</div>
			</div>
		</>
	);
};

export default Modal;
