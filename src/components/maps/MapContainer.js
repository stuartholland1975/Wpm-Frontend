import React from "react";
import { useGoogleMaps } from "react-hook-google-maps";
import { useSelector } from "react-redux";

const urmston = { lat: 53.44852, lng: -2.35419 };
const iconBase =
  "https://developers.google.com/maps/documentation/javascript/examples/full/images/";
const icons = {
  parking: {
    icon: iconBase + "parking_lot_maps.png",
  },
  library: {
    icon: iconBase + "library_maps.png",
  },
  info: {
    icon: iconBase + "info-i_maps.png",
  },
};

export const MapContainer = React.memo(function Map() {
  const locationImages = useSelector(
    (state) => state.orderSummaryData.orderImages
  );
  // const exifField = locationImages.map(item => JSON.parse(item.exif))

  const { ref, map, google } = useGoogleMaps(
    "AIzaSyCkC93PA-uUg_XBCeBFbWz8_b7SAw3z_ac",
    {
      zoom: 10,
      center:
        locationImages.length > 0 && locationImages[0].exif_data.GPSLatitude
          ? {
              lat: locationImages[0].exif_data.GPSLatitude.num,
              lng: locationImages[0].exif_data.GPSLongitude.num,
            }
          : urmston,
    }
  );

  if (map) {
    const imageLocations = locationImages.map((item) => ({
      position: new google.maps.LatLng(
        item.exif_data.GPSLatitude ? item.exif_data.GPSLatitude.num : "",
        item.exif_data.GPSLongitude ? item.exif_data.GPSLongitude.num : ""
      ),
      type: icons.parking,
      title: item.title,
      image: item.construction_image,
    }));

    for (let i = 0; i < imageLocations.length; i++) {
      new google.maps.Marker({
        position: imageLocations[i].position,
        //  icon: imageLocations[i].image,
        map: map,
        title: imageLocations[i].title,
      });
    }
  }

  return (
    <div>
      <div ref={ref} style={{ width: 760, height: 760 }} />
    </div>
  );
});
