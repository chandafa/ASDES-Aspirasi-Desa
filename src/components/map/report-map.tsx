"use client";

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { useEffect, useRef } from 'react';
import type { Report } from '@/lib/types';
import L from 'leaflet';
import 'leaflet-defaulticon-compatibility';

interface ReportMapProps {
  reports: Report[];
}

const ReportMap = ({ reports }: ReportMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    // Hanya inisialisasi peta jika div sudah ada dan belum ada instance peta
    if (mapRef.current && !mapInstance.current) {
      const defaultPosition: L.LatLngExpression = [-6.200000, 106.816666]; // Default to Jakarta

      mapInstance.current = L.map(mapRef.current).setView(defaultPosition, 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance.current);

      reports.forEach((report) => {
        L.marker([report.location.lat, report.location.lng])
          .addTo(mapInstance.current!)
          .bindPopup(
            `<b>${report.title}</b><br>${report.description.substring(0, 50)}...`
          );
      });
    }

    // Fungsi cleanup untuk menghapus instance peta saat komponen di-unmount
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [reports]); // dependensi 'reports' untuk memperbarui marker jika data berubah

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
};

export default ReportMap;
