import { useState } from "react";
import { Carousel } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useUnmount } from "react-use";
import { setClickedLocation } from "../../services/data/gridData";
import { GreyButton } from "../ui-components/Buttons";

const ApplicationImages = (props) => {
	const dispatch = useDispatch();
	const [index, setIndex] = useState(0);
	const handleSelect = (selectedIndex) => {
		setIndex(selectedIndex);
	};
	const images = useSelector(state => state.applicationDetail.images);
	const selectedLocation = useSelector((state) => state.gridData.clickedRow.id);
	const imageType = useSelector((state) => state.gridData.clickedRow.colId);

	const modalImages =
		selectedLocation && imageType
			? images.filter(
			(obj) =>
				obj.location === selectedLocation && obj.image_type === imageType
			)
			: selectedLocation
			? images.filter((obj) => obj.location === selectedLocation)
			: images;
	useUnmount(() => dispatch(setClickedLocation(false)));

	return (
		<div>
			<Carousel activeIndex={ index } onSelect={ handleSelect } interval={ 1500 }>
				{ modalImages.map((item) => (
					<Carousel.Item key={ item.id }>
						<h3>{ item.imageTypeDescription }</h3>
						<img
							className={ props.sizeClass }
							src={ item["construction_image"] }
							alt={ item.title }
							//style={ {maxHeight: '100vh'} }
						/>
						<Carousel.Caption>
							<h4 style={ {color: "white", fontWeight: "bolder"} }>
								{ item.title }
							</h4>
							<p style={ {color: "white", fontWeight: "bolder"} }>
								{ item.locationRef }
							</p>
						</Carousel.Caption>
					</Carousel.Item>
				)) }
			</Carousel>
			<hr/>
			<GreyButton fullWidth type="button" onClick={ props.handleHide }>
				Close
			</GreyButton>
		</div>
	);
};
export default ApplicationImages;
