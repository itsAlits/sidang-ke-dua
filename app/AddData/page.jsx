"use client";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function WisataInputForm() {
  const [formData, setFormData] = useState({
    nama: "",
    kategori: "Wisata_Alam", // Default value
    lokasi: "",
    urlGambar: "",
    biayaMasuk: "",
    jamOperasional: "",
    urlMaps: "",
    rating: "",
    deskripsi: "",
    fasilitas: "",
    jarakDariKuta: "",
    jarakDariKutaSelatan: "",
    jarakDariKutaUtara: "",
    jarakDariMengwi: "",
    jarakDariPetang: "",
    jarakDariAbiansemal: "",
  });

  const [submitStatus, setSubmitStatus] = useState({
    isSubmitting: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ isSubmitting: true });

    try {
      // Generate a unique ID for the new destination
      const destinationId = `Destinasi_${formData.nama.replace(/\s+/g, "_")}`;

      // Create SPARQL Update query
      const sparqlUpdate = `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX d: <http://www.semanticweb.org/dewac/ontologies/2025/2/untitled-ontology-4#>
        
        INSERT DATA {
          d:${destinationId} rdf:type d:Destinasi ;
            d:Nama "${formData.nama}" ;
            d:memilikiKategori d:${formData.kategori} ;
            d:Kategori "${formData.kategori.replace("_", " ")}" ;
            d:Lokasi "${formData.lokasi}" ;
            d:Url_Gambar "${formData.urlGambar}" ;
            d:Biaya_Masuk "${formData.biayaMasuk}" ;
            d:Jam_Operasional "${formData.jamOperasional}" ;
            d:Url_Maps "${formData.urlMaps}" ;
            d:Rating "${formData.rating}" ;
            d:Deskripsi "${formData.deskripsi}" ;
            d:Fasilitas "${formData.fasilitas}" ;
            d:JarakDariKuta "${formData.jarakDariKuta}" ;
            d:JarakDariKutaSelatan "${formData.jarakDariKutaSelatan}" ;
            d:JarakDariKutaUtara "${formData.jarakDariKutaUtara}" ;
            d:JarakDariPetang "${formData.jarakDariPetang}" ;
            d:JarakDariAbiansemal "${formData.jarakDariAbiansemal}" ;
            d:JarakDariMengwi "${formData.jarakDariMengwi}" .
        }
      `;

      // Send the update to Fuseki endpoint
      const response = await fetch("http://localhost:3030/wisata_final/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
        body: `update=${encodeURIComponent(sparqlUpdate)}`,
      });

      if (response.ok) {
        toast.success("Data wisata berhasil disimpan!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Reset form after successful submission
        setFormData({
          nama: "",
          kategori: "Wisata_Alam",
          lokasi: "",
          urlGambar: "",
          biayaMasuk: "",
          jamOperasional: "",
          urlMaps: "",
          rating: "",
          deskripsi: "",
          fasilitas: "",
          jarakDariKuta: "",
          jarakDariKutaSelatan: "",
          jarakDariKutaUtara: "",
          jarakDariPetang: "",
          jarakDariMengwi: "",
          jarakDariAbiansemal: "",
        });
      } else {
        const errorData = await response.text();
        throw new Error(`Error: ${response.status} - ${errorData}`);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error(`Gagal menyimpan data: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setSubmitStatus({ isSubmitting: false });
    }
  };

  return (
    <div className="w-full container mx-auto px-4 bg-white rounded-lg py-10">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-center mb-2">Input Data Wisata</h1>
      <p className="text-gray-600 mb-8 text-center">
        Masukkan data destinasi wisata untuk disimpan ke Apache Jena Fuseki
      </p>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nama Destinasi */}
          <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              Nama Destinasi
            </label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="contoh: Pantai Berawa"
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Kategori
            </label>
            <select
              name="kategori"
              value={formData.kategori}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Wisata_Alam">Wisata Alam</option>
              <option value="Wisata_Spiritual">Wisata Spiritual</option>
              <option value="Wisata_Petualangan">Wisata Petualangan</option>
              <option value="Seni_Dan_Budaya">Seni Dan Budaya</option>
            </select>
          </div>

          {/* Lokasi */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Lokasi
            </label>
            <input
              type="text"
              name="lokasi"
              value={formData.lokasi}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="contoh: jalan di canggu"
            />
          </div>

          {/* URL Gambar */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              URL Gambar
            </label>
            <input
              type="url"
              name="urlGambar"
              value={formData.urlGambar}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Biaya Masuk */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Biaya Masuk
            </label>
            <input
              type="text"
              name="biayaMasuk"
              value={formData.biayaMasuk}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="contoh: Tidak ada biaya | Rp.8000"
            />
          </div>

          {/* Jam Operasional */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Jam Operasional
            </label>
            <input
              type="text"
              name="jamOperasional"
              value={formData.jamOperasional}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="contoh: 00:00 - 23:59"
            />
          </div>

          {/* URL Maps */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              URL Google Maps
            </label>
            <input
              type="url"
              name="urlMaps"
              value={formData.urlMaps}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://goo.gl/maps/example"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Rating
            </label>
            <input
              type="text"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="contoh: 4.5"
            />
          </div>

          {/* Fasilitas */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Fasilitas
            </label>
            <input
              type="text"
              name="fasilitas"
              value={formData.fasilitas}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="contoh: Tidak ada"
            />
          </div>

          {/* Deskripsi */}
          <div className="col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              Deskripsi
            </label>
            <textarea
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Deskripsi lengkap tentang destinasi wisata..."
            ></textarea>
          </div>

          <div className="col-span-2">
            <h3 className="text-lg font-semibold mb-4">Jarak dari Kecamatan</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Jarak dari Kuta */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Jarak dari Kuta (km)
                </label>
                <input
                  type="text"
                  name="jarakDariKuta"
                  value={formData.jarakDariKuta}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="contoh: 11.6"
                />
              </div>

              {/* Jarak dari Kuta Selatan */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Jarak dari Kuta Selatan (km)
                </label>
                <input
                  type="text"
                  name="jarakDariKutaSelatan"
                  value={formData.jarakDariKutaSelatan}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="contoh: 21.3"
                />
              </div>

              {/* Jarak dari Kuta Utara */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Jarak dari Kuta Utara (km)
                </label>
                <input
                  type="text"
                  name="jarakDariKutaUtara"
                  value={formData.jarakDariKutaUtara}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="contoh: 7.2"
                />
              </div>

              {/* Jarak dari Petang */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Jarak dari Petang (km)
                </label>
                <input
                  type="text"
                  name="jarakDariPetang"
                  value={formData.jarakDariPetang}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="contoh: 3.2"
                />
              </div>

              {/* Jarak dari Abiansemal */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Jarak dari Abiansemal (km)
                </label>
                <input
                  type="text"
                  name="jarakDariAbiansemal"
                  value={formData.jarakDariAbiansemal}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="contoh: 17.6"
                />
              </div>

              {/* Jarak dari Mengwi */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Jarak dari Mengwi (km)
                </label>
                <input
                  type="text"
                  name="jarakDariMengwi"
                  value={formData.jarakDariMengwi}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="contoh: 12.6"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            type="submit"
            disabled={submitStatus.isSubmitting}
            className="bg-primary hover:bg-primary/80 cursor-pointer text-white font-medium py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          >
            {submitStatus.isSubmitting ? "Menyimpan..." : "Simpan Data Wisata"}
          </button>
        </div>
      </form>

      {/* Preview area */}
      <div className="mt-12 pt-8 border-t">
        <h2 className="text-xl font-semibold mb-4">Preview SPARQL Query</h2>
        <div className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
          <pre className="text-sm text-gray-800">
            {`PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX d: <http://www.semanticweb.org/dewac/ontologies/2025/2/untitled-ontology-4#>

INSERT DATA {
  d:Destinasi_${formData.nama.replace(/\s+/g, "_")} rdf:type d:Destinasi ;
    d:Nama "${formData.nama}" ;
    d:memilikiKategori d:${formData.kategori} ;
    d:Kategori "${formData.kategori.replace("_", " ")}" ;
    d:Lokasi "${formData.lokasi}" ;
    d:Url_Gambar "${formData.urlGambar}" ;
    d:Biaya_Masuk "${formData.biayaMasuk}" ;
    d:Jam_Operasional "${formData.jamOperasional}" ;
    d:Url_Maps "${formData.urlMaps}" ;
    d:Rating "${formData.rating}" ;
    d:Deskripsi "${formData.deskripsi}" ;
    d:Fasilitas "${formData.fasilitas}" ;
    d:JarakDariKuta "${formData.jarakDariKuta}" ;
    d:JarakDariKutaSelatan "${formData.jarakDariKutaSelatan}" ;
    d:JarakDariKutaUtara "${formData.jarakDariKutaUtara}" ;
    d:JarakDariPetang "${formData.jarakDariPetang}" ;
    d:JarakDariMengwi "${formData.jarakDariMengwi}" ;
    d:JarakDariAbiansemal "${formData.jarakDariAbiansemal}" .
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
