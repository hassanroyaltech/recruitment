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
//   handleSelect = (selected, placeId, suggestions) => {
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
//         this.props.onChange(
//           `${lat},${lng}`,
//           this.state.place_id,
//           suggestions.formattedSuggestion.mainText,
//         );
//       });
//     data.catch((error) => {
//       this.setState({ isGeocoding: false });
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
//     console.log('Error from Google Maps API', status); // eslint-disable-line no-console
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
//       <div className="h-100">
//         <PlacesAutocomplete
//           onChange={this.handleChange}
//           value={address}
//           onSelect={this.handleSelect}
//           onError={this.handleError}
//           shouldFetchSuggestions={address.length > 2}
//           searchOptions={this.props.searchOptions}
//         >
//           {({ getInputProps, suggestions, getSuggestionItemProps }) => {
//             return (
//               <div className="Demo__search-bar-container h-100">
//                 <input
//                   style={{ maxHeight: '46px' }}
//                   {...getInputProps({
//                     placeholder: this.props.placeholder,
//                     className:
//                       'form-control Demo__search-input form-control-sm h-100',
//                   })}
//                 />
//
//                 {suggestions.length > 0 && (
//                   <div className="Demo__autocomplete-container">
//                     {suggestions.map((suggestion, i) => {
//                       const className = classnames('Demo__suggestion-item', {
//                         'Demo__suggestion-item--active': suggestion.active,
//                       });
//
//                       return (
//                         /* eslint-disable react/jsx-key */
//                         <div
//                           key={i}
//                           {...getSuggestionItemProps(suggestion, { className })}
//                         >
//                           <strong>{suggestion.formattedSuggestion.mainText}</strong>
//                           {' '}
//                           <small>
//                             {suggestion.formattedSuggestion.secondaryText}
//                           </small>
//                         </div>
//                       );
//                       /* eslint-enable react/jsx-key */
//                     })}
//                   </div>
//                 )}
//               </div>
//             );
//           }}
//         </PlacesAutocomplete>
//         {errorMessage.length > 0 && (
//           <div className="Demo__error-message">{this.state.errorMessage}</div>
//         )}
//       </div>
//     );
//   }
// }
