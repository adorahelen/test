import React, { useState, useRef, useEffect } from 'react';

const Section1 = () => {
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const startMarkerRef = useRef(null);
  const endMarkerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      // 지도 띄우기
      const map = new window.Tmapv2.Map(mapContainerRef.current, {
        center: new window.Tmapv2.LatLng(35.91217743, 128.80776502),
        width: '80%',
        height: "600px", // 조정 가능한 높이
        zoom: 17,
        zoomControl: true,
        scrollwheel: true
      });

      // mapRef에 지도 객체 저장
      mapRef.current = map;
    }
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'start') {
      setStartAddress(value);
    } else if (name === 'end') {
      setEndAddress(value);
    }
  };

  const findPath = () => {
    const startAddressValue = startAddress.trim();
    const endAddressValue = endAddress.trim();

    if (!startAddressValue || !endAddressValue) {
      alert('출발지와 목적지를 입력하세요.');
      return;
    }

    // 출발지, 목적지 좌표 가져오기
    fetchCoords(startAddressValue, endAddressValue);
  };

  const fetchCoords = (startAddress, endAddress) => {
    const appKey = "j64dOXd9VTagbwLEktJQ46W2uxtc2FAbHLln3n1b";

    fetch(`https://apis.openapi.sk.com/tmap/geo/fullAddrGeo?version=1&format=json&appKey=${appKey}&address=${startAddress}`)
      .then(response => response.json())
      .then(startResponse => {
        const startCoord = startResponse.coordinateInfo.coordinate[0];
        const startX = startCoord.lon;
        const startY = startCoord.lat;

        fetch(`https://apis.openapi.sk.com/tmap/geo/fullAddrGeo?version=1&format=json&appKey=${appKey}&address=${endAddress}`)
          .then(response => response.json())
          .then(endResponse => {
            const endCoord = endResponse.coordinateInfo.coordinate[0];
            const endX = endCoord.lon;
            const endY = endCoord.lat;

            // 출발지와 목적지 마커 추가
            addMarker(startX, startY, '출발지');
            addMarker(endX, endY, '도착지');

            findPathWithCoords(startX, startY, endX, endY);
          })
          .catch(error => console.error('Error fetching end address:', error));
      })
      .catch(error => console.error('Error fetching start address:', error));
  };

  const addMarker = (lon, lat, label) => {
    const marker = new window.Tmapv2.Marker({
      position: new window.Tmapv2.LatLng(lat, lon),
      map: mapRef.current,
      title: label,
      icon: new window.Tmapv2.Icon('/images/marker.png') // 마커 이미지 경로 설정
    });

    // 마커를 ref로 저장
    if (label === '출발지') {
      startMarkerRef.current = marker;
    } else if (label === '도착지') {
      endMarkerRef.current = marker;
    }
  };

  const findPathWithCoords = (startX, startY, endX, endY) => {
    // 경로 찾기 로직은 이전과 동일하게 구현합니다.
  };

  return (
    <section id="section1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <div>
          출발지: <input type="text" name="start" value={startAddress} onChange={handleInputChange} />
        </div>
        <div style={{ marginLeft: '10px' }}>
          목적지: <input type="text" name="end" value={endAddress} onChange={handleInputChange} />
        </div>
        <button style={{ marginLeft: '10px' }} onClick={findPath}>길 찾기</button>
      </div>
      <div ref={mapContainerRef} style={{ width: '80%', height: '600px', marginTop: '0px' }}></div>
    </section>
  );
};
  
export default Section1;