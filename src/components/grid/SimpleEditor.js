import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { useDispatch } from "react-redux";


export default forwardRef((props, ref) => {
	const inputRef = useRef();
	const dispatch = useDispatch();

	useImperativeHandle(ref, () => {
		return {
			getValue: () => {
				return inputRef.current.value.toFixed(2);
			}
		};
	});
	return <input style={ {textAlign: "right", height: "20px", width: "100px"} } type="text" ref={ inputRef }
	              defaultValue={ 0.00 } />;
});
