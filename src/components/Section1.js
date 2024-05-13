import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TextField, IconButton, List, ListItem, ListItemText, Paper, Typography, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const Section1 = () => {
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [startResults, setStartResults] = useState([]);
  const [endResults, setEndResults] = useState([]);
  const [selectedStartLocation, setSelectedStartLocation] = useState(null);
  const [selectedEndLocation, setSelectedEndLocation] = useState(null);
  const [routeDetails, setRouteDetails] = useState('');
  const mapRef = useRef(null);
  const startMarkerRef = useRef(null);
  const endMarkerRef = useRef(null);
  const polylineRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = new window.Tmapv2.Map('mapContainer', {
        center: new window.Tmapv2.LatLng(37.56520450, 126.98702028),
        width: '100%',
        height: '800px',
        zoom: 17,
        zoomControl: true,
        scrollwheel: true
      });
    }
  }, []);

  const handleSearch = async (address, setResult, type) => {
    const appKey = 'j64dOXd9VTagbwLEktJQ46W2uxtc2FAbHLln3n1b';
    const url = `https://apis.openapi.sk.com/tmap/pois?version=1&format=json&appKey=${appKey}&searchKeyword=${encodeURIComponent(address)}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setResult(data.searchPoiInfo.pois.poi);
      if (type === 'start') {
        setEndResults([]); // Clear end results when searching start locations
      } else {
        setStartResults([]); // Clear start results when searching end locations
      }
    } catch (error) {
      console.error('Error searching locations:', error);
      alert('위치 검색에 실패했습니다.');
    }
  };

  const handleLocationSelect = (location, type, index) => {
    const newLatLng = new window.Tmapv2.LatLng(location.frontLat, location.frontLon);
    mapRef.current.setCenter(newLatLng);

    if (type === 'start') {
      if (startMarkerRef.current) startMarkerRef.current.setMap(null);
      startMarkerRef.current = new window.Tmapv2.Marker({
        position: newLatLng,
        icon: "http://topopen.tmap.co.kr/imgs/start.png",
        iconSize: new window.Tmapv2.Size(24, 38),
        map: mapRef.current
      });
      setSelectedStartLocation(location);
      setStartAddress(location.name);
      setStartResults([]); // Clear start results after selection
    } else {
      if (endMarkerRef.current) endMarkerRef.current.setMap(null);
      endMarkerRef.current = new window.Tmapv2.Marker({
        position: newLatLng,
        icon: "http://topopen.tmap.co.kr/imgs/arrival.png",
        iconSize: new window.Tmapv2.Size(24, 38),
        map: mapRef.current
      });
      setSelectedEndLocation(location);
      setEndAddress(location.name);
      setEndResults([]); // Clear end results after selection
    }
  };

  const drawPathAndMarkers = (features) => {
    if (polylineRef.current) polylineRef.current.setMap(null);

    const pathCoordinates = [];
    const bounds = new window.Tmapv2.LatLngBounds();

    features.forEach(feature => {
      if (feature.geometry.type === "LineString") {
        feature.geometry.coordinates.forEach(coord => {
          const latLng = new window.Tmapv2.LatLng(coord[1], coord[0]);
          bounds.extend(latLng);
          pathCoordinates.push(latLng);
        });
      }
    });

    polylineRef.current = new window.Tmapv2.Polyline({
      path: pathCoordinates,
      strokeColor: "#DD0000",
      strokeWeight: 6,
      map: mapRef.current
    });

    startMarkerRef.current.setMap(mapRef.current);
    endMarkerRef.current.setMap(mapRef.current);
    mapRef.current.fitBounds(bounds);
  };

  const findPedestrianPath = useCallback(async () => {
    if (!selectedStartLocation || !selectedEndLocation) return;

    const appKey = 'j64dOXd9VTagbwLEktJQ46W2uxtc2FAbHLln3n1b';
    const url = `https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&appKey=${appKey}`;
    const body = JSON.stringify({
      startX: selectedStartLocation.frontLon,
      startY: selectedStartLocation.frontLat,
      endX: selectedEndLocation.frontLon,
      endY: selectedEndLocation.frontLat,
      reqCoordType: "WGS84GEO",
      resCoordType: "WGS84GEO",
      startName: "출발지",
      endName: "도착지"
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'appKey': appKey
        },
        body: body
      });
      const data = await response.json();
      drawPathAndMarkers(data.features);
      displayRouteDetails(data.features);
    } catch (error) {
      console.error('Error fetching pedestrian route:', error);
      alert('경로 탐색에 실패했습니다.');
    }
  }, [selectedStartLocation, selectedEndLocation]);

  useEffect(() => {
    if (selectedStartLocation && selectedEndLocation) {
      findPedestrianPath();
    }
  }, [selectedStartLocation, selectedEndLocation, findPedestrianPath]);

  const displayRouteDetails = (features) => {
    const totalDistance = features.reduce((acc, feature) => acc + (feature.properties.totalDistance || 0), 0);
    const totalTime = features.reduce((acc, feature) => acc + (feature.properties.totalTime || 0), 0);
    const details = `총 거리: ${(totalDistance / 1000).toFixed(1)}km, 총 시간: ${(totalTime / 60).toFixed(0)}분`;
    setRouteDetails(details);
  };

  return (
    <section id="section1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
      <div id="mapContainer" style={{ width: '100%', position: 'relative', maxHeight: 'calc(100vh - 50px)', overflow: 'hidden' }}>
        {/* 거리 및 시간 출력 */}
        <Typography variant="h6" style={{ backgroundColor: 'white' , position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>{routeDetails}</Typography>

        {/* 나머지 지도 관련 요소들 */}
        <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', width: '50%', zIndex: 1000 }}>
          {/* 출발지 입력란 */}
          <TextField
            style={{ flex: 1, backgroundColor: 'white', marginRight: 20 }}
            label="출발지를 입력하세요"
            value={startAddress}
            onChange={(e) => setStartAddress(e.target.value)}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => handleSearch(startAddress, setStartResults, 'start')}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          {/* 목적지 입력란 */}
          <TextField
            style={{ flex: 1, backgroundColor: 'white' }}
            label="목적지를 입력하세요"
            value={endAddress}
            onChange={(e) => setEndAddress(e.target.value)}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => handleSearch(endAddress, setEndResults, 'end')}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </div>
        {/* 결과 목록 */}
        {(startResults.length > 0 || endResults.length > 0) && (
          <Paper style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', width: '40%', maxHeight: '150px', overflow: 'auto', zIndex: 1000, backgroundColor: 'white' }}>
            <List dense>
              {startResults.map((result, index) => (
                <ListItem
                  key={`start-${index}`}
                  button
                  onClick={() => handleLocationSelect(result, 'start', index)}
                >
                  <ListItemText primary={result.name} secondary={`Lat: ${result.frontLat}, Lon: ${result.frontLon}`} />
                </ListItem>
              ))}
              {endResults.map((result, index) => (
                <ListItem
                  key={`end-${index}`}
                  button
                  onClick={() => handleLocationSelect(result, 'end', index)}
                >
                  <ListItemText primary={result.name} secondary={`Lat: ${result.frontLat}, Lon: ${result.frontLon}`} />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </div>
    </section>
  );
};

export default Section1;
