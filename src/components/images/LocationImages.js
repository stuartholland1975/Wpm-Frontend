import React, { useState } from "react";
import { Carousel } from "react-bootstrap";
import { selectAllImages } from "./ImageData";
import { useSelector } from "react-redux";
import { GreyButton } from "../ui-components/Buttons";
import { createSelector } from 'reselect'


const LocationImages = (props) => {

	const [index, setIndex] = useState(0);
	const handleSelect = (selectedIndex) => {
		setIndex(selectedIndex);
	};
	const images = useSelector(selectAllImages)

	return <div>
		<Carousel activeIndex={ index } onSelect={ handleSelect } interval={ 1500 }>
			{ images.map(item => <Carousel.Item
				key={ item.id }>
				<h3>{ item.imageTypeDescription }</h3>
				<img
					className={ props.sizeClass }
					src={ item["construction_image"] }
					alt={ item.title }
					//style={ {maxHeight: '100vh'} }
				/>
				<Carousel.Caption>

					<h4 style={ {color: 'white', fontWeight: 'bolder'} }>{ item.title }</h4>
					<p style={ {color: 'white', fontWeight: 'bolder'} }>{ item.locationRef }</p>
				</Carousel.Caption>

			</Carousel.Item>) }
		</Carousel>
		<hr/>
		<GreyButton fullWidth type='button' onClick={ props.handleHide }>Close</GreyButton>
	</div>
}
export default LocationImages
