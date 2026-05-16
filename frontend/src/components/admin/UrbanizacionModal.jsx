import { useEffect, useState } from "react";
import api from "../../api/axiosConfig";

function UrbanizacionModal({ cerrar, recargarUrbanizaciones, mostrarMensaje, urbanizacion }) {
    const esEdicion = Boolean(urbanizacion);

    const [comunidades, setComunidades] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        nombre: urbanizacion?.nombre ?? "",
        direccion: urbanizacion?.direccion ?? "",
        googleMapsUrl: urbanizacion?.googleMapsUrl ?? "",
        tipoUrbanizacion: urbanizacion?.tipoUrbanizacion ?? "CALLES",
        comunidadId: urbanizacion?.comunidadAutonomaId ? String(urbanizacion.comunidadAutonomaId) : "",
        provinciaId: urbanizacion?.provinciaId ? String(urbanizacion.provinciaId) : "",
        municipioId: urbanizacion?.municipioId ? String(urbanizacion.municipioId) : "",
        activa: urbanizacion?.activa ?? true
    });

    useEffect(() => {
        cargarComunidades();
    }, []);

    const cargarComunidades = async () => {
        try {
            const response = await api.get("/comunidades-autonomas");
            setComunidades(response.data);

            if (urbanizacion?.comunidadAutonomaId) {
                await cargarProvincias(String(urbanizacion.comunidadAutonomaId));
            }
        } catch {
            mostrarMensaje("error", "Error al cargar comunidades autónomas");
        }
    };

    const cargarProvincias = async (comunidadId) => {
        try {
            const response = await api.get(`/provincias/comunidad/${comunidadId}`);
            setProvincias(response.data);

            if (urbanizacion?.provinciaId) {
                await cargarMunicipios(String(urbanizacion.provinciaId));
            }
        } catch {
            mostrarMensaje("error", "Error al cargar provincias");
        }
    };

    const cargarMunicipios = async (provinciaId) => {
        try {
            const response = await api.get(`/municipios/provincia/${provinciaId}`);
            setMunicipios(response.data);
        } catch {
            mostrarMensaje("error", "Error al cargar municipios");
        }
    };

    const cambiarComunidad = async (comunidadId) => {
        setForm({ ...form, comunidadId, provinciaId: "", municipioId: "" });
        setProvincias([]);
        setMunicipios([]);
        setError("");

        if (!comunidadId) return;

        try {
            const response = await api.get(`/provincias/comunidad/${comunidadId}`);
            setProvincias(response.data);
        } catch {
            mostrarMensaje("error", "Error al cargar provincias");
        }
    };

    const cambiarProvincia = async (provinciaId) => {
        setForm({ ...form, provinciaId, municipioId: "" });
        setMunicipios([]);
        setError("");

        if (!provinciaId) return;

        try {
            const response = await api.get(`/municipios/provincia/${provinciaId}`);
            setMunicipios(response.data);
        } catch {
            mostrarMensaje("error", "Error al cargar municipios");
        }
    };

    const formularioValido =
        form.nombre.trim() &&
        form.direccion.trim() &&
        form.tipoUrbanizacion &&
        form.comunidadId &&
        form.provinciaId &&
        form.municipioId;

    const guardar = async () => {
        if (!formularioValido) {
            setError("Debes rellenar todos los campos antes de guardar.");
            return;
        }

        try {
            const payload = {
                nombre: form.nombre.trim(),
                direccion: form.direccion.trim(),
                googleMapsUrl: form.googleMapsUrl.trim() || null,
                tipoUrbanizacion: form.tipoUrbanizacion,
                municipioId: Number(form.municipioId),
                activa: form.activa
            };

            if (esEdicion) {
                await api.put(`/urbanizaciones/${urbanizacion.id}`, payload);
            } else {
                await api.post("/urbanizaciones", payload);
            }

            await recargarUrbanizaciones();
            cerrar();
            mostrarMensaje("success", esEdicion ? "Urbanización actualizada correctamente" : "Urbanización creada correctamente");
        } catch (err) {
            const texto =
                err.response?.data?.message ||
                err.response?.data?.mensaje ||
                (esEdicion ? "Error al actualizar la urbanización" : "Error al crear la urbanización");

            setError(texto);
            mostrarMensaje("error", texto);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal modal-large">
                <h2>{esEdicion ? "Editar urbanización" : "Nueva urbanización"}</h2>
                <p>
                    {esEdicion
                        ? "Modifica los datos de la urbanización."
                        : "Selecciona ubicación y completa todos los datos."}
                </p>

                <input
                    placeholder="Nombre de la urbanización"
                    value={form.nombre}
                    onChange={(e) => {
                        setForm({ ...form, nombre: e.target.value });
                        setError("");
                    }}
                />

                <input
                    placeholder="Dirección"
                    value={form.direccion}
                    onChange={(e) => {
                        setForm({ ...form, direccion: e.target.value });
                        setError("");
                    }}
                />

                <input
                    placeholder="URL de Google Maps (opcional)"
                    value={form.googleMapsUrl}
                    onChange={(e) => {
                        setForm({ ...form, googleMapsUrl: e.target.value });
                        setError("");
                    }}
                />

                <select
                    value={form.tipoUrbanizacion}
                    onChange={(e) => {
                        setForm({ ...form, tipoUrbanizacion: e.target.value });
                        setError("");
                    }}
                >
                    <option value="CALLES">Calles</option>
                    <option value="BLOQUES">Bloques</option>
                </select>

                <select
                    value={form.comunidadId}
                    onChange={(e) => cambiarComunidad(e.target.value)}
                >
                    <option value="">Selecciona comunidad autónoma</option>
                    {comunidades.map((c) => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                </select>

                <select
                    value={form.provinciaId}
                    onChange={(e) => cambiarProvincia(e.target.value)}
                    disabled={!form.comunidadId}
                >
                    <option value="">Selecciona provincia</option>
                    {provincias.map((p) => (
                        <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                </select>

                <select
                    value={form.municipioId}
                    onChange={(e) => {
                        setForm({ ...form, municipioId: e.target.value });
                        setError("");
                    }}
                    disabled={!form.provinciaId}
                >
                    <option value="">Selecciona municipio</option>
                    {municipios.map((m) => (
                        <option key={m.id} value={m.id}>{m.nombre}</option>
                    ))}
                </select>

                {esEdicion && (
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#374151" }}>
                        <input
                            type="checkbox"
                            checked={form.activa}
                            onChange={(e) => setForm({ ...form, activa: e.target.checked })}
                        />
                        Urbanización activa
                    </label>
                )}

                {error && <div className="form-error">{error}</div>}

                <div className="modal-actions">
                    <button className="modal-cancel" onClick={cerrar}>
                        Cancelar
                    </button>

                    <button
                        className="modal-save"
                        onClick={guardar}
                        disabled={!formularioValido}
                    >
                        {esEdicion ? "Guardar cambios" : "Guardar"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UrbanizacionModal;
