"use client";

import { useEffect, useRef } from 'react';
import type { Report } from '@/lib/types';

interface ReportMapProps {
  reports: Report[];
}

const ReportMap = ({ reports }: ReportMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    // Dynamically import Leaflet and its CSS only on the client-side
    Promise.all([
      import('leaflet'),
      import('leaflet-defaulticon-compatibility'),
      import('leaflet/dist/leaflet.css'),
      import('leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css')
    ]).then(([{ default: L }]) => {
      // Only initialize map if div exists and map instance is not created yet
      if (mapRef.current && !mapInstance.current) {
        const defaultPosition: L.LatLngExpression = reports.length > 0
          ? [reports[0].location.lat, reports[0].location.lng]
          : [-6.200000, 106.816666]; // Default to Jakarta if no reports

        mapInstance.current = L.map(mapRef.current).setView(defaultPosition, 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapInstance.current);

        reports.forEach((report) => {
          const popupContent = `
            <div style="font-family: Poppins, sans-serif; font-size: 14px; max-width: 200px;">
              <b style="font-size: 16px; display: block; margin-bottom: 4px;">${report.title}</b>
              <p style="margin: 0; font-size: 12px; color: #333; border-top: 1px solid #eee; padding-top: 8px;">
                <strong>Lokasi:</strong> ${report.location.address}
              </p>
            </div>
          `;

          L.marker([report.location.lat, report.location.lng])
            .addTo(mapInstance.current!)
            .bindPopup(popupContent);
        });
      }
    });

    // Cleanup function to remove map instance on component unmount
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [reports]); // dependency 'reports' to update markers if data changes

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
};

export default ReportMap;
