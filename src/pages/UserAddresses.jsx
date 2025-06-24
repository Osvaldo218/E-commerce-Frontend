import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "../styles/Addresses.css";

const UserAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("https://ecommerce-backend-eohg.onrender.com/api/users/addresses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setAddresses(data.addresses || []))
      .catch((err) => {
        console.error("❌ Error al obtener direcciones:", err);
        Swal.fire("Error", "No se pudieron cargar las direcciones", "error");
      });
  }, [token]);

  const handleAddAddress = async () => {
    if (!newAddress.trim()) return;

    try {
      const res = await fetch("https://ecommerce-backend-eohg.onrender.com/api/users/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ address: newAddress }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error al guardar");

      setAddresses(data.addresses);
      setNewAddress("");
      Swal.fire("✅ Guardado", "Dirección agregada correctamente", "success");
    } catch (error) {
      console.error("❌", error);
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleDelete = async (addressToDelete) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar dirección?",
      text: addressToDelete,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch("https://ecommerce-backend-eohg.onrender.com/api/users/addresses", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ address: addressToDelete }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Error al eliminar");

      setAddresses(data.addresses);
      Swal.fire("✅ Eliminada", "Dirección eliminada correctamente", "success");
    } catch (error) {
      console.error("❌", error);
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div className="user-addresses">
      <h2>📍 Mis Direcciones Guardadas</h2>

      <input
        type="text"
        placeholder="Agregar nueva dirección..."
        value={newAddress}
        onChange={(e) => setNewAddress(e.target.value)}
      />

      <button onClick={handleAddAddress}>Agregar Dirección</button>

      <div className="address-list">
        {addresses.length === 0 ? (
          <p>No tienes direcciones guardadas.</p>
        ) : (
          addresses.map((address, idx) => (
            <div key={idx} className="address-card">
              <p>{address}</p>
              <button onClick={() => handleDelete(address)}>Eliminar</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserAddresses;
