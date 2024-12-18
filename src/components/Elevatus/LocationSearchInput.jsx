// import React from 'react';
// import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
//
// import classnames from 'classnames';
//
// export default class LocationSearchInput extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       address: props.value ? props.value : '',
//       errorMessage: '',
//       latitude: props.location ? props.location.split(',')[0] : '',
//       longitude: props.location ? props.location.split(',')[1] : '',
//       isGeocoding: false,
//     };
//   }
//
//   handleChange = (address) => {
//     this.setState({
//       address,
//       latitude: null,
//       longitude: null,
//       errorMessage: '',
//     });
//   };
//
//   handleSelect = (selected) => {
//     this.setState({ isGeocoding: true, address: selected });
//     const data = geocodeByAddress(selected);
//     data.then((res) => {
//       this.setState({
//         place_id: res[0].place_id,
//       });
//     });
//     data
//       .then((res) => getLatLng(res[0]))
//       .then(({ lat, lng }) => {
//         this.setState({
//           latitude: lat,
//           longitude: lng,
//           isGeocoding: false,
//         });
//         this.props.onChange(`${lat},${lng}`, this.state.place_id);
//       });
//     data.catch((error) => {
//       this.setState({ isGeocoding: false });
//       console.log('error', error); // eslint-disable-line no-console
//     });
//   };
//
//   handleCloseClick = () => {
//     this.setState({
//       address: '',
//       latitude: null,
//       longitude: null,
//     });
//   };
//
//   handleError = (status, clearSuggestions) => {
//     this.setState({ errorMessage: status }, () => {
//       clearSuggestions();
//     });
//   };
//
//   render() {
//     const {
//       address, errorMessage, latitude, longitude, isGeocoding,
//     } = this.state;
//
//     return (
//       <div>
//         <PlacesAutocomplete
//           onChange={this.handleChange}
//           value={address}
//           onSelect={this.handleSelect}
//           onError={this.handleError}
//           shouldFetchSuggestions={address.length > 2}
//         >
//           {({ getInputProps, suggestions, getSuggestionItemProps }) => {
//             return (
//               <div className="Demo__search-bar-container">
//                 <input
//                   {...getInputProps({
//                     placeholder: 'Search Places...',
//                     className: 'form-control Demo__search-input form-control-sm',
//                   })}
//                 />
//                 {/* {this.state.address.length > 0 && ( */}
//                 {/*    <button */}
//                 {/*        className="Demo__clear-button" */}
//                 {/*        onClick={this.handleCloseClick} */}
//                 {/*    > */}
//                 {/*        x */}
//                 {/*    </button> */}
//                 {/* )} */}
//                 {suggestions.length > 0 && (
//                   <div className="Demo__autocomplete-container">
//                     {suggestions.map((suggestion) => {
//                       const className = classnames('Demo__suggestion-item', {
//                         'Demo__suggestion-item--active': suggestion.active,
//                       });
//
//                       return (
//                         /* eslint-disable react/jsx-key */
//                         <div {...getSuggestionItemProps(suggestion, { className })}>
//                           <strong>{suggestion.formattedSuggestion.mainText}</strong>
//                           {' '}
//                           <small>
//                             {suggestion.formattedSuggestion.secondaryText}
//                           </small>
//                         </div>
//                       );
//                       /* eslint-enable react/jsx-key */
//                     })}
//                     {/* <div className="Demo__dropdown-footer"> */}
//                     {/*    <div> */}
//                     {/*       test */}
//                     {/*    </div> */}
//                     {/* </div> */}
//                   </div>
//                 )}
//               </div>
//             );
//           }}
//         </PlacesAutocomplete>
//         {errorMessage.length > 0 && (
//           <div className="Demo__error-message">{this.state.errorMessage}</div>
//         )}
//
//         {/* {((latitude && longitude) || isGeocoding) && ( */}
//         {/*    <div> */}
//         {/*        <h3 className="Demo__geocode-result-header">Geocode result</h3> */}
//         {/*        {isGeocoding ? ( */}
//         {/*            <div> */}
//         {/*                <i className="fa fa-spinner fa-pulse fa-3x fa-fw Demo__spinner"/> */}
//         {/*            </div> */}
//         {/*        ) : ( */}
//         {/*            <div> */}
//         {/*                <div className="Demo__geocode-result-item--lat"> */}
//         {/*                    <label>Latitude:</label> */}
//         {/*                    <span>{latitude}</span> */}
//         {/*                </div> */}
//         {/*                <div className="Demo__geocode-result-item--lng"> */}
//         {/*                    <label>Longitude:</label> */}
//         {/*                    <span>{longitude}</span> */}
//         {/*                </div> */}
//         {/*            </div> */}
//         {/*        )} */}
//         {/*    </div> */}
//         {/* )} */}
//       </div>
//     );
//   }
// }
