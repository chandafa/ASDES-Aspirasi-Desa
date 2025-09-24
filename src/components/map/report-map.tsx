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

        if (!leaflet) return;

        const defaultPosition: L.LatLngExpression = reports.length > 0
          ? [reports[0].location.lat, reports[0].location.lng]
          : [-6.9175, 107.6191]; // Default to Bandung if no reports

        mapInstance.current = leaflet.map(mapRef.current).setView(defaultPosition, 14);
        
        // Invalidate size to fix rendering issues
        setTimeout(() => {
          mapInstance.current?.invalidateSize();
        }, 100);

        leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapInstance.current);

        reports.forEach((report) => {
          if (!leaflet) return;
          const popupContent = `
            <div style="font-family: Poppins, sans-serif; font-size: 14px; max-width: 200px;">
              <b style="font-size: 16px; display: block; margin-bottom: 4px;">${report.title}</b>
              <p style="margin: 0; font-size: 12px; color: #555;">${report.description.substring(0, 100)}...</p>
              <a href="/report/${report.id}" target="_blank" style="display: inline-block; margin-top: 8px; font-size: 12px; color: #007bff; text-decoration: none;">Lihat Detail</a>
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
