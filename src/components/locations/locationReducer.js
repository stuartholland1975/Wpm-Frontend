const initialState = {
    siteLocations: [],
    imageData: [],
    orderHeader: [],

}

const LocationsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_SUMMARY_DATA': {
            return {
                ...state,
                siteLocations: action.sites,
                imageData: action.images,
                orderHeader: action.order
            }
        }

        case 'SET_IMAGE_DATA': {
            return {
                ...state,
                imageData: [...state.imageData, action.images]
            }
        }

        case 'RESET_SUMMARY_DATA': {
            return initialState
        }

        default:
            return state
    }
}

export default LocationsReducer;