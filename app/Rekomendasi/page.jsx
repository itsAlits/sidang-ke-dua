"use client";

import { useState, useEffect } from "react";
import Card2 from "../Components/Card2";
import { calculateSawScores } from "../utils/SAW";
import { calculateSawScore } from "../utils/Jurnal";
import { toast } from "react-toastify";
import Navbar from "../Components/Navbar";

export default function Home() {
  const [destinations, setDestinations] = useState([]);
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSearchView, setIsSearchView] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [isSorted, setIsSorted] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      let queryString = `
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
          ?destinasi d:JarakDariMengwi ?mengwi.
          ?destinasi d:JarakDariKutaUtara ?kutautara.
          ?destinasi d:JarakDariPetang ?petang.
          ?destinasi d:JarakDariAbiansemal ?abiansemal.
      `;

      if (category) {
        const categoryURI = category.replace(/\s+/g, "_");
        queryString += `
          ?destinasi d:memilikiKategori d:${categoryURI}.
        `;
      }
      queryString += `
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

      const data = await response.json();
      const formattedData = data.results.bindings.map((item) => ({
        id: item.destinasi.value,
        nama: item.nama.value,
        lokasi: item.lokasi.value,
        gambar: item.gambar.value,
        biaya: item.biaya.value,
        jam: item.jam.value,
        maps: item.maps.value,
        rating: item.rate.value,
        deskripsi: item.desc.value,
        fasilitas: item.fasilitas.value,
        kategori: item.kategori.value,
        jarak: {
          kuta: parseFloat(item.kuta.value),
          kutaSelatan: parseFloat(item.kutaselatan.value),
          kutaUtara: parseFloat(item.kutautara.value),
          petang: parseFloat(item.petang.value),
          mengwi: parseFloat(item.mengwi.value),
          abiansemal: parseFloat(item.abiansemal.value),
        },
      }));

      // const rankedDestinations = calculateSawScores(formattedData, location);
      const rankedDestinations = calculateSawScore(formattedData, location);
      if (rankedDestinations.length === 0) {
        toast.info("Tidak ada destinasi yang sesuai dengan kriteria", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        toast.success(`Menemukan ${rankedDestinations.length} destinasi`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }

      setDestinations(rankedDestinations);
      setTotalResults(rankedDestinations.length);
      setIsSearchView(false);
      setIsSorted(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Gagal mencari rekomendasi", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData();
  };

  const resetSearch = () => {
    setCategory("");
    setLocation("");
    setDestinations([]);
    setIsSearchView(true);
    setIsSorted(false);
  };

  const toggleSorting = () => {
    if (destinations.length > 0) {
      if (isSorted) {
        // If already sorted by SAW, switch back to original order
        setDestinations(
          [...destinations].sort((a, b) => a.nama.localeCompare(b.nama))
        );
      } else {
        // Sort by SAW score
        setDestinations(
          [...destinations].sort((a, b) => b.sawScore - a.sawScore)
        );
      }
      setIsSorted(!isSorted);
    }
  };

  // Helper function to get the category display name
  const getCategoryDisplayName = (categoryValue) => {
    switch (categoryValue) {
      case "Wisata_Alam":
        return "Wisata Alam";
      case "Wisata_Budaya":
        return "Wisata Budaya";
      case "Wisata_Pantai":
        return "Wisata Pantai";
      case "Wisata_Kuliner":
        return "Wisata Kuliner";
      default:
        return "Semua Kategori";
    }
  };

  // Helper function to get the location display name
  const getLocationDisplayName = (locationValue) => {
    return locationValue || "Semua Lokasi";
  };

  return (
    <div>
      <Navbar bgNav="bg-primary" />
      <div className="container mx-auto pt-32">
        {isSearchView ? (
          <div className="flex justify-center flex-col items-center">
            <div className="w-full md:w-2/3 px-6 md:px-10 rounded-2xl shadow-sm border border-gray-100 py-10 md:py-14">
              <h1 className="text-xl font-normal text-center">
                Kriteria Rekomendasi
              </h1>
              <p className="text-center text-gray-400 font-light mb-8">
                Masukan Kriteria sesuai yang anda inginkan agar mendapatkan
                rekomendasi yang sesuai
              </p>
              <form onSubmit={handleSearch} className="w-full">
                <div className="w-full mt-4 flex flex-col md:flex-row gap-4 px-4">
                  <div className="w-full">
                    <label className="select w-full rounded-lg focus-within:outline-primary">
                      <span className="label">Kategori</span>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full"
                      >
                        <option value="">Semua Kategori</option>
                        <option value="Wisata_Alam">Wisata Alam</option>
                        <option value="Seni_Dan_Budaya">Seni dan Budaya</option>
                        <option value="Wisata_Petualangan">
                          Wisata Petualangan
                        </option>
                        <option value="Wisata_Spiritual">
                          Wisata Spiritual
                        </option>
                      </select>
                    </label>
                  </div>
                  <div className="w-full">
                    <label className="select w-full rounded-lg focus-within:outline-primary">
                      <span className="label">Lokasi Anda</span>
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full"
                      >
                        <option value="">Pilih Lokasi Anda</option>
                        <option value="Kuta Selatan">Kuta Selatan</option>
                        <option value="Kuta Utara">Kuta Utara</option>
                        <option value="Kuta">Kuta</option>
                        <option value="Mengwi">Mengwi</option>
                        <option value="Petang">Petang</option>
                        <option value="Abiansemal">Abiansemal</option>
                      </select>
                    </label>
                  </div>
                </div>
                <div className="w-full mt-4 px-4">
                  <button
                    type="submit"
                    className="btn rounded-lg btn-primary text-white w-full"
                    disabled={loading}
                  >
                    {loading ? "Mencari..." : "Cari Rekomendasi"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 px-4 gap-4">
              <div>
                <h1 className="text-2xl font-semibold">
                  Hasil Pencarian {totalResults > 0 ? `(${totalResults})` : ""}
                </h1>
                <p className="text-gray-500 mt-1">
                  Kategori: {getCategoryDisplayName(category)} | Lokasi Anda:{" "}
                  {getLocationDisplayName(location)}
                </p>
                {totalResults > 0 && (
                  <p className="text-gray-500 mt-1">
                    Urutan: {isSorted ? "Rekomendasi SAW" : "Nama"}
                  </p>
                )}
              </div>
              <div className="md:flex hidden gap-3 ">
                {totalResults > 0 && (
                  <button onClick={toggleSorting} className="btn btn-active/70">
                    {isSorted
                      ? "Urutkan berdasarkan Nama"
                      : "Urutkan berdasarkan Rekomendasi"}
                  </button>
                )}
                <button onClick={resetSearch} className="btn btn-primary">
                  Pencarian Baru
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="loading loading-spinner loading-lg"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-18">
                {destinations.length > 0 ? (
                  destinations.map((dest, index) => (
                    <Card2
                      key={dest.id}
                      id={dest.id}
                      img={dest.gambar}
                      judul={dest.nama}
                      desc={
                        dest.deskripsi.length > 150
                          ? `${dest.deskripsi.substring(0, 150)}...`
                          : dest.deskripsi
                      }
                      links={dest.maps}
                      rating={dest.rating}
                      kategori={dest.kategori}
                      sawScore={isSorted ? dest.sawScore : null}
                      rank={isSorted ? index + 1 : null}
                    />
                  ))
                ) : (
                  <div className="col-span-1 md:col-span-3 text-center py-16">
                    <h2 className="text-xl font-medium">
                      Tidak ada hasil yang ditemukan
                    </h2>
                    <p className="mt-2 text-gray-500">
                      Silakan coba dengan kriteria pencarian lain
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
