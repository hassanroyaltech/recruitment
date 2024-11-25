import React, { memo, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Inputs } from '../Inputs/Inputs.Component';
import './GoogleMap.Style.scss';

export const GoogleMapComponent = memo(
  ({
    defaultCenter,
    // hoverDistance,
    defaultZoom,
    onMapClicked,
    // onChange,
    center,
    locations,
    // searchLocation,
    onSearchLocationsChange,
    onMarkerClicked,
    googleMapWrapper,
    isSubmitted,
    helperText,
    inputIdRef,
    scriptId,
  }) => {
    const googleRef = useRef(null);
    const mapRef = useRef(null);
    const googleScriptRef = useRef(null);
    const currentMarkers = useRef([]);
    const googleMapRef = useRef(null);
    const searchRef = useRef(null);
    const searchInputRef = useRef(null);
    const clickTimeRef = useRef(null);
    const markerHandlerTimeRef = useRef(null);
    const searchLocationTimeRef = useRef(null);

    // to send lng & lat click coordination (location event)
    const onClickHandler = useCallback(
      (locationEvent) => {
        const localLocationObj = {
          lat: locationEvent.latLng.lat(),
          lng: locationEvent.latLng.lng(),
        };
        if (onMapClicked) onMapClicked(localLocationObj);
      },
      [onMapClicked],
    );

    // to add google search by location name
    const searchHandler = useCallback(() => {
      // to prevent set search field before map init
      if (!googleRef.current || !mapRef.current) {
        if (searchLocationTimeRef.current)
          clearTimeout(searchLocationTimeRef.current);
        searchLocationTimeRef.current = setTimeout(() => {
          searchHandler();
        }, 200);
        return;
      }
      if (searchRef.current) return;

      searchRef.current = new googleRef.current.maps.places.SearchBox(
        searchInputRef.current.querySelector('input'),
      );
      mapRef.current.controls[googleRef.current.maps.ControlPosition.TOP_LEFT].push(
        searchInputRef.current,
      );
      mapRef.current.addListener('bounds_changed', () => {
        searchRef.current.setBounds(mapRef.current.getBounds());
      });
      // Listen for the event fired when the user selects a prediction and retrieve
      // more details for that place.
      searchRef.current.addListener('places_changed', () => {
        const places = searchRef.current.getPlaces();
        if (places.length === 0) return;
        const localLocations = [];
        // eslint-disable-next-line array-callback-return
        places.map((place) => {
          if (!place.geometry || !place.geometry.location) {
            // eslint-disable-next-line no-console
            console.log('Returned place contains no geometry');
            return;
          }
          localLocations.push({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
          if (localLocations.length > 0) return;
          if (place.geometry.viewport)
            // Only geocodes have viewport.
            mapRef.current.fitBounds(place.geometry.viewport);
          else mapRef.current.fitBounds(place.geometry.location);
        });
        if (onSearchLocationsChange) onSearchLocationsChange(localLocations);
      });
    }, [onSearchLocationsChange]);

    /**
     * @param removedMarkers
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @description method to handle removing them markers from map
     * @type {(function(*): void)|*}
     */
    const markersRemoverHandler = useCallback((removedMarkers) => {
      removedMarkers.map((item) => {
        const markerIndex = currentMarkers.current.findIndex(
          (element) =>
            element.getPosition().lat() === item.getPosition().lat()
            && item.getPosition().lng() === element.getPosition().lng(),
        );
        if (markerIndex !== -1) currentMarkers.current.splice(markerIndex, 1);
        item.setMap(null);
        return undefined;
      });
    }, []);

    // method to handle the markers for all locations
    const markersHandler = useCallback(() => {
      if (!currentMarkers.current || !mapRef.current || !googleRef.current) {
        if (locations.length > 0) {
          if (markerHandlerTimeRef.current)
            clearTimeout(markerHandlerTimeRef.current);
          markerHandlerTimeRef.current = setTimeout(() => {
            markersHandler();
          }, 200);
        }
        return;
      }
      // if (currentMarkers.current.length === locations.length) return;
      // to update only the new markers to prevent markers flickering
      const newMarkers = locations.filter(
        (item) =>
          currentMarkers.current.findIndex(
            (element) =>
              element.getPosition().lat() === item.lat
              && element.getPosition().lng() === item.lng,
          ) === -1,
      );
      // get removed markers
      const removedMarkers = currentMarkers.current.filter(
        (item) =>
          locations.findIndex(
            (element) =>
              element.lat === item.getPosition().lat()
              && element.lng === item.getPosition().lng(),
          ) === -1,
      );
      if (removedMarkers.length > 0) markersRemoverHandler(removedMarkers);
      newMarkers.map((item) => {
        const marker = new googleRef.current.maps.Marker({
          map: mapRef.current,
          position: { lat: item.lat, lng: item.lng },
          // icon: 'null',
        });
        if (onMarkerClicked)
          marker.addListener('click', () => {
            onMarkerClicked({
              lat: marker.getPosition().lat(),
              lng: marker.getPosition().lng(),
            });
          });
        marker.setMap(mapRef.current);
        currentMarkers.current.push(marker);
        return undefined;
      });
    }, [locations, markersRemoverHandler, onMarkerClicked]);

    // method to set google on map finish loading
    const googleMapInit = useCallback(() => {
      googleRef.current = window.google;
      mapRef.current = new googleRef.current.maps.Map(googleMapRef.current, {
        center: defaultCenter,
        zoom: defaultZoom,
        mapTypeId: googleRef.current.maps.MapTypeId.ROADMAP,
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultZoom]);

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @description method to update center location
     */
    const updateMapCenter = useCallback(() => {
      if (!mapRef.current || !googleRef.current) {
        setTimeout(() => {
          updateMapCenter();
        }, 200);
        return;
      }
      mapRef.current.setCenter(center);
    }, [center]);

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @description this is to init  search field on init for google map
     */
    useEffect(() => {
      searchHandler();
    }, [searchHandler]);

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @description this is to inti map script on load (real map painter)
     */
    useEffect(() => {
      if (document.querySelector(`#${scriptId}`)) {
        googleMapInit();
        return;
      }
      googleScriptRef.current = document.createElement('script');
      googleScriptRef.current.type = 'text/javascript';
      googleScriptRef.current.id = scriptId;
      googleScriptRef.current.src
        = 'https://maps.googleapis.com/maps/api/js'
        + `?key=${process.env.REACT_APP_GOOGLE_LOCATION_KEY_V2}&callback=googleMapInit&libraries=places`;
      googleScriptRef.current.async = true;
      // googleScriptRef.current.setAttribute('crossorigin', 'anonymous');
      // googleScriptRef.current.setAttribute(
      //   'integrity',
      //   'sha384-mpnz6GKiKJInoH0ML1ck7AF9R8gRxVTj9DK//QpX0ebIuP3jTBqVzL43+1RAsGKq',
      // );
      window.googleMapInit = googleMapInit;
      document.head.appendChild(googleScriptRef.current);
    }, [googleMapInit, scriptId]);

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @description this method is to add click event to map (if needed by parent)
     */
    const addClickListenerToMap = useCallback(() => {
      if (
        !onMapClicked
        || (googleRef.current
          && googleRef.current.maps.event.hasListeners(mapRef.current, 'idle'))
      )
        return;
      // this is to prevent adding for click if map still painting
      if (!mapRef.current) {
        if (clickTimeRef.current) clearTimeout(clickTimeRef.current);
        clickTimeRef.current = setTimeout(() => {
          addClickListenerToMap();
        }, 200);
        return;
      }
      // console.log();
      mapRef.current.addListener('click', onClickHandler);
    }, [onClickHandler, onMapClicked]);

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @description this is call click event adder on init
     */
    useEffect(() => {
      addClickListenerToMap();
    }, [addClickListenerToMap]);

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @description this is update markers on update for locations
     */
    useEffect(() => {
      if (locations) markersHandler();
    }, [locations, markersHandler]);

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @description this is to call map center updater on center changed (by parent)
     */
    useEffect(() => {
      if (center) updateMapCenter();
    }, [updateMapCenter, center]);

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @description this is to destroy timers of component destroyed while any
     * of the timers still active (to prevent memory leak)
     */
    useEffect(
      () => () => {
        if (clickTimeRef.current) clearTimeout(clickTimeRef.current);
        if (markerHandlerTimeRef.current) clearTimeout(markerHandlerTimeRef.current);
        if (searchLocationTimeRef.current)
          clearTimeout(searchLocationTimeRef.current);
      },
      [],
    );

    return (
      <div
        className={`google-map-component-wrapper component-wrapper${
          (googleMapWrapper && ` ${googleMapWrapper}`) || ''
        }`}
      >
        <div className="google-map-wrapper" ref={googleMapRef} />
        <Inputs
          idRef={inputIdRef}
          refs={searchInputRef}
          themeClass="theme-solid"
          wrapperClasses="google-search-wrapper"
        />
        {isSubmitted && helperText && (
          <div className="error-wrapper">
            <span>{helperText}</span>
          </div>
        )}
      </div>
    );
  },
);

GoogleMapComponent.displayName = 'GoogleMapComponent';

GoogleMapComponent.propTypes = {
  locations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      lat: PropTypes.number,
      lng: PropTypes.number,
      text: PropTypes.string,
      data: PropTypes.arrayOf(PropTypes.instanceOf(Object)), // for popover content
      component: PropTypes.oneOfType([
        PropTypes.elementType,
        PropTypes.func,
        PropTypes.node,
      ]),
    }),
  ).isRequired,
  // searchLocation: PropTypes.instanceOf(Object),
  center: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  defaultCenter: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  // hoverDistance: PropTypes.number,
  defaultZoom: PropTypes.number,
  isSubmitted: PropTypes.bool,
  helperText: PropTypes.string,
  onSearchLocationsChange: PropTypes.func,
  onMapClicked: PropTypes.func,
  onMarkerClicked: PropTypes.func,
  // onChange: PropTypes.func,
  googleMapWrapper: PropTypes.string,
  inputIdRef: PropTypes.string,
  scriptId: PropTypes.string,
};
GoogleMapComponent.defaultProps = {
  inputIdRef: 'googleMapSearchInputIdRef',
  defaultCenter: { lat: 31.97158757705754, lng: 35.83264577460408 },
  // hoverDistance: 30,
  defaultZoom: 10,
  onSearchLocationsChange: undefined,
  scriptId: 'googleMapIdRef',
  isSubmitted: false,
  helperText: undefined,
  onMapClicked: undefined,
  // onChange: undefined,
  center: undefined,
  onMarkerClicked: undefined,
  // searchLocation: null,
  googleMapWrapper: undefined,
};
