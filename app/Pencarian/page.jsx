"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Card1 from "../Components/Card1";

export default function PencarianPage() {
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all destinations on component mount
  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      try {
        const query = `
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
          PREFIX d: <http://www.semanticweb.org/dewac/ontologies/2025/2/untitled-ontology-4#>
          SELECT * WHERE {
            ?destinasi rdf:type d:Destinasi.
            ?destinasi d:Nama ?nama.
            ?destinasi d:Lokasi ?lokasi.
            ?destinasi d:Url_Gambar ?gambar.
            ?destinasi d:Biaya_Masuk ?biaya.
            ?destinasi d:Jam_Operasional ?jam.
            ?destinasi d:Url_Maps ?maps.
            ?destinasi d:Rating ?rate.
            ?destinasi d:Deskripsi ?desc.
            ?destinasi d:Fasilitas ?fasilitas.
            ?destinasi d:Kategori ?kategori.
            ?destinasi d:JarakDariKuta ?kuta.
            ?destinasi d:JarakDariKutaSelatan ?kutaselatan.
            ?destinasi d:JarakDariKutaUtara ?kutautara.
            ?destinasi d:JarakDariPetang ?petang.
            ?destinasi d:JarakDariMengwi ?mengwi.
            ?destinasi d:JarakDariAbiansemal ?abiansemal.
          }
        `;

        const response = await fetch(
          "http://localhost:3030/wisata_final/query",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Accept: "application/sparql-results+json",
            },
            body: `query=${encodeURIComponent(query)}`,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch destinations");
        }

        const data = await response.json();

        // Process SPARQL results into an array of destination objects
        const processedDestinations = data.results.bindings.map((result) => {
          // Safely parse numeric values with fallbacks
          const safeParseFloat = (value) => {
            if (value && value.value) {
              const parsed = parseFloat(value.value);
              return isNaN(parsed) ? 0 : parsed;
            }
            return 0;
          };

          return {
            id: result.destinasi.value,
            judul: result.nama ? result.nama.value : "Unnamed Destination",
            lokasi: result.lokasi ? result.lokasi.value : "",
            img: result.gambar ? result.gambar.value : "/default-image.jpg",
            biaya: result.biaya ? result.biaya.value : "",
            jam: result.jam ? result.jam.value : "",
            links: result.maps ? result.maps.value : "#",
            rating: safeParseFloat(result.rate),
            desc: result.desc ? result.desc.value : "",
            fasilitas: result.fasilitas ? result.fasilitas.value : "",
            kategori: result.kategori ? result.kategori.value : "",
            distanceMetrics: {
              kuta: safeParseFloat(result.kuta),
              kutaSelatan: safeParseFloat(result.kutaselatan),
              kutaUtara: safeParseFloat(result.kutautara),
              petang: safeParseFloat(result.petang),
              mengwi: safeParseFloat(result.mengwi),
              abiansemal: safeParseFloat(result.abiansemal),
            },
            // Note: We're not passing sawScore since it's not in the query results
          };
        });

        setDestinations(processedDestinations);
        setFilteredDestinations(processedDestinations);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching destinations:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  // Handle search input change - simple text-based filtering
  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.trim() === "") {
      // If search term is empty, show all destinations
      setFilteredDestinations(destinations);
    } else {
      // Filter destinations based on search term
      const filtered = destinations.filter(
        (dest) =>
          (dest.judul && dest.judul.toLowerCase().includes(term)) ||
          (dest.desc && dest.desc.toLowerCase().includes(term)) ||
          (dest.kategori && dest.kategori.toLowerCase().includes(term)) ||
          (dest.lokasi && dest.lokasi.toLowerCase().includes(term))
      );
      setFilteredDestinations(filtered);
    }
  };

  return (
    <div>
      <Navbar bgNav="bg-primary" />
      <div className="py-24 container mx-auto px-4">
        <div>
          <h1 className="text-2xl md:text-3xl text-primary font-semibold text-center">
            Telusuri Destinasi Wisata
          </h1>
          <p className="text-center text-gray-500 mt-2 mb-6">
            Temukan Destinasi Wisata yang menarik dan indah yang ingin kamu
            kunjungi
          </p>
          <div className="flex justify-center mt-4 mb-8">
            <label className="input focus-within:outline-primary w-full flex items-center   rounded-xl">
              <svg
                className="h-5 w-5 opacity-50 mx-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
              <input
                type="search"
                className="w-full p-2 outline-none"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Cari nama, lokasi, atau kategori wisata..."
              />
            </label>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="loading loading-spinner loading-lg text-primary"></div>
              <p className="mt-4">Memuat destinasi wisata...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500">
              <p>Terjadi kesalahan: {error}</p>
              <button
                className="btn btn-primary mt-4"
                onClick={() => window.location.reload()}
              >
                Coba lagi
              </button>
            </div>
          ) : (
            <>
              <div className="text-primary mb-4">
                Menemukan {filteredDestinations.length} destinasi wisata
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDestinations.map((destination, index) => (
                  <Card1
                    key={index}
                    id={destination.id}
                    judul={destination.judul}
                    kategori={destination.kategori}
                    img={destination.img}
                    rating={destination.rating}
                    desc={
                      destination.desc && destination.desc.length > 100
                        ? destination.desc.substring(0, 100) + "..."
                        : destination.desc
                    }
                    links={destination.links}
                    // We're explicitly not passing sawScore, so the Card2 component's conditional rendering
                    // will handle it appropriately
                  />
                ))}
              </div>

              {filteredDestinations.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-gray-500">
                    Tidak ada hasil yang ditemukan untuk "{searchTerm}"
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
