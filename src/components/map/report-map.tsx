"use client";

import { useEffect, useRef } from 'react';
import type { Report } from '@/lib/types';
import type L from 'leaflet';

interface ReportMapProps {
  reports: Report[];
}

const ReportMap = ({ reports }: ReportMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    let leaflet: typeof L | null = null;

    const initMap = async () => {
        if (!mapRef.current || mapInstance.current) return;

        // Dynamically import Leaflet and its dependencies
        const L_module = await import('leaflet');
        leaflet = L_module.default;
        await import('leaflet-defaulticon-compatibility');
        
        // Dynamically import CSS
        await import('leaflet/dist/leaflet.css');
        await import('leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css');

        if (!leaflet) return;

        const defaultPosition: L.LatLngExpression = reports.length > 0
          ? [reports[0].location.lat, reports[0].location.lng]
          : [-6.200000, 106.816666];

        mapInstance.current = leaflet.map(mapRef.current).setView(defaultPosition, 14);

        leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapInstance.current);

        reports.forEach((report) => {
          if (!leaflet) return;
          const popupContent = `
            <div style="font-family: Poppins, sans-serif; font-size: 14px; max-width: 200px;">
              <b style="font-size: 16px; display: block; margin-bottom: 4px;">${report.title}</b>
              <p style="margin: 0; font-size: 12px; color: #555;">${report.description.substring(0, 100)}...</p>
              <p style="margin: 8px 0 0; font-size: 12px; color: #333; border-top: 1px solid #eee; padding-top: 8px;">
                <strong>Lokasi:</strong> ${report.location.address}
              </p>
            </div>
          `;

          leaflet.marker([report.location.lat, report.location.lng])
            .addTo(mapInstance.current!)
            .bindPopup(popupContent);
        });
    };

    initMap();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [reports]);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
};

export default ReportMap;
