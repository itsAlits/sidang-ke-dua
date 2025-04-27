"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/app/Components/Navbar";

export default function DestinationDetail() {
  const params = useParams();
  const router = useRouter();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!params.id) return;

    const fetchDestinationDetails = async () => {
      setLoading(true);
      try {
        // Use the ID from the URL to fetch the specific destination
        const destinationId = decodeURIComponent(params.id);

        const queryString = `
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          PREFIX d: <http://www.semanticweb.org/dewac/ontologies/2025/2/untitled-ontology-4#>
          SELECT * WHERE {
            <${destinationId}> rdf:type d:Destinasi.
            <${destinationId}> d:Nama ?nama.
            <${destinationId}> d:Lokasi ?lokasi.
            <${destinationId}> d:Url_Gambar ?gambar.
            <${destinationId}> d:Biaya_Masuk ?biaya.
            <${destinationId}> d:Jam_Operasional ?jam.
            <${destinationId}> d:Url_Maps ?maps.
            <${destinationId}> d:Rating ?rate.
            <${destinationId}> d:Deskripsi ?desc.
            <${destinationId}> d:Kategori ?kategori.
            <${destinationId}> d:Fasilitas ?fasilitas.
            <${destinationId}> d:JarakDariKuta ?kuta.
            <${destinationId}> d:JarakDariKutaSelatan ?kutaselatan.
            <${destinationId}> d:JarakDariKutaUtara ?kutautara.
            <${destinationId}> d:JarakDariMengwi ?mengwi.
            <${destinationId}> d:JarakDariPetang ?petang.
            <${destinationId}> d:JarakDariAbiansemal ?abiansemal.
          }
        `;

        const response = await fetch("http://localhost:3030/wisata_final/query", {
          method: "POST",
          headers: {
            "Content-Type": "application/sparql-query",
            Accept: "application/json",
          },
          body: queryString,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch destination details");
        }

        const data = await response.json();
        console.log(data);
        if (data.results.bindings.length === 0) {
          throw new Error("Destination not found");
        }

        const item = data.results.bindings[0];
        const destinationData = {
          id: destinationId,
          nama: item.nama.value,
          lokasi: item.lokasi.value,
          gambar: item.gambar.value,
          biaya: item.biaya.value,
          jam: item.jam.value,
          maps: item.maps.value,
          rating: item.rate.value,
          fasilitas: item.fasilitas.value,
          deskripsi: item.desc.value,
          kategori: item.kategori.value,
          jarak: {
            kuta: item.kuta.value,
            kutaSelatan: item.kutaselatan.value,
            kutaUtara: item.kutautara.value,
            petang: item.petang.value,
            mengwi: item.mengwi.value,
            abiansemal: item.abiansemal.value,
          },
        };

        setDestination(destinationData);
      } catch (err) {
        console.error("Error fetching destination details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinationDetails();
  }, [params.id]);

  // Helper function to determine color based on distance
  const getDistanceColor = (distance) => {
    const dist = parseFloat(distance);
    if (dist <= 5) return "bg-green-100 border-green-300 text-green-800"; // Very close
    if (dist <= 10) return "bg-emerald-100 border-emerald-300 text-emerald-800"; // Close
    if (dist <= 20) return "bg-blue-100 border-blue-300 text-blue-800"; // Medium
    if (dist <= 30) return "bg-yellow-100 border-yellow-300 text-yellow-800"; // Far
    return "bg-red-100 border-red-300 text-red-800"; // Very far
  };

  if (loading) {
    return (
      <div className="container mx-auto pt-32 flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto pt-32 px-4">
        <div className="flex flex-col items-center justify-center py-16">
          <h1 className="text-2xl font-semibold text-center mb-4">Error</h1>
          <p className="text-center text-gray-600 mb-6">{error}</p>
          <button onClick={() => router.back()} className="btn btn-primary">
            Kembali
          </button>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="container mx-auto pt-32 px-4">
        <div className="flex flex-col items-center justify-center py-16">
          <h1 className="text-2xl font-semibold text-center mb-4">
            Destinasi Tidak Ditemukan
          </h1>
          <button onClick={() => router.back()} className="btn btn-primary">
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar bgNav="bg-primary" />
      <div className="container mx-auto pt-32 px-4 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <div className="img-container h-96 overflow-hidden rounded-xl shadow-md">
              <img
                src={destination.gambar}
                alt={destination.nama}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Added map view section below the image */}
            <div className="mt-8">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">
                  Jarak dari Kecamatan
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div
                    className={`stat rounded-lg p-4 border ${getDistanceColor(
                      destination.jarak.kuta
                    )}`}
                  >
                    <div className="stat-title font-medium">Kuta</div>
                    <div className="stat-value text-lg">
                      {destination.jarak.kuta} km
                    </div>
                  </div>
                  <div
                    className={`stat rounded-lg p-4 border ${getDistanceColor(
                      destination.jarak.mengwi
                    )}`}
                  >
                    <div className="stat-title font-medium">Mengwi</div>
                    <div className="stat-value text-lg">
                      {destination.jarak.mengwi} km
                    </div>
                  </div>
                  <div
                    className={`stat rounded-lg p-4 border ${getDistanceColor(
                      destination.jarak.kutaSelatan
                    )}`}
                  >
                    <div className="stat-title font-medium">Kuta Selatan</div>
                    <div className="stat-value text-lg">
                      {destination.jarak.kutaSelatan} km
                    </div>
                  </div>
                  <div
                    className={`stat rounded-lg p-4 border ${getDistanceColor(
                      destination.jarak.kutaUtara
                    )}`}
                  >
                    <div className="stat-title font-medium">Kuta Utara</div>
                    <div className="stat-value text-lg">
                      {destination.jarak.kutaUtara} km
                    </div>
                  </div>
                  <div
                    className={`stat rounded-lg p-4 border ${getDistanceColor(
                      destination.jarak.petang
                    )}`}
                  >
                    <div className="stat-title font-medium">Petang</div>
                    <div className="stat-value text-lg">
                      {destination.jarak.petang} km
                    </div>
                  </div>
                  <div
                    className={`stat rounded-lg p-4 border ${getDistanceColor(
                      destination.jarak.abiansemal
                    )}`}
                  >
                    <div className="stat-title font-medium">Abiansemal</div>
                    <div className="stat-value text-lg">
                      {destination.jarak.abiansemal} km
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 items-center text-xs text-gray-600 mb-4">
                <span className="inline-block w-3 h-3 rounded-full bg-green-100 border border-green-300"></span>
                <span>&lt; 5 km</span>

                <span className="inline-block w-3 h-3 rounded-full bg-emerald-100 border border-emerald-300 ml-3"></span>
                <span>5-10 km</span>

                <span className="inline-block w-3 h-3 rounded-full bg-blue-100 border border-blue-300 ml-3"></span>
                <span>10-20 km</span>

                <span className="inline-block w-3 h-3 rounded-full bg-yellow-100 border border-yellow-300 ml-3"></span>
                <span>20-30 km</span>

                <span className="inline-block w-3 h-3 rounded-full bg-red-100 border border-red-300 ml-3"></span>
                <span>&gt; 30 km</span>
              </div>
            </div>
          </div>

          <div className="md:w-1/2">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-primary mb-4 hover:underline cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              Kembali
            </button>

            <h1 className="text-3xl font-semibold mb-2">{destination.nama}</h1>

            <div className="flex items-center gap-2 mb-4">
              <span className="badge badge-primary">
                {destination.kategori}
              </span>
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="size-4 text-yellow-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>
                <span>{destination.rating}</span>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
                Deskripsi
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {destination.deskripsi}
              </p>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 mb-6">
              <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Informasi Wisata
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <h3 className="text-sm font-medium mb-1 text-gray-700">
                    Lokasi
                  </h3>
                  <p className="text-gray-600">{destination.lokasi}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1 text-gray-700">
                    Biaya Masuk
                  </h3>
                  <p className="text-gray-600">{destination.biaya}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1 text-gray-700">
                    Jam Operasional
                  </h3>
                  <p className="text-gray-600">{destination.jam}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1 text-gray-700">
                    Fasilitas
                  </h3>
                  <p className="text-gray-600">{destination.fasilitas}</p>
                </div>
              </div>
            </div>

            <a
              href={destination.maps}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary w-full flex justify-center items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
              Lihat di Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
