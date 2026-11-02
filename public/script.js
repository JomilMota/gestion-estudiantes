
const API_URL = "/api/estudiantes";

// Elementos del DOM
const formulario = document.getElementById("form-estudiantes");
const listaEstudiantes = document.getElementById("lista-estudiantes");

const campoId = document.getElementById("id");
const campoNombre = document.getElementById("nombre");
const campoMatricula = document.getElementById("matricula");
const campoCarrera = document.getElementById("carrera");

const tituloFormulario = document.getElementById("titulo-formulario");
const botonEnviar = document.getElementById("btn-enviar");
const botonCancelar = document.getElementById("btn-cancelar");
const mensaje = document.getElementById("mensaje");


// ==========================================
// 1. CONSULTAR ESTUDIANTES
// ==========================================

async function obtenerEstudiantes() {

    try {

        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error("Error al obtener estudiantes");
        }

        const estudiantes = await respuesta.json();

        mostrarEstudiantes(estudiantes);

    } catch (error) {

        mensaje.textContent = error.message;
        mensaje.style.color = "red";

    }
}


// ==========================================
// 2. MOSTRAR ESTUDIANTES EN LA TABLA
// ==========================================

function mostrarEstudiantes(estudiantes) {

    listaEstudiantes.innerHTML = "";

    if (estudiantes.length === 0) {

        const fila = document.createElement("tr");
        const celda = document.createElement("td");

        celda.colSpan = 5;
        celda.textContent = "No hay estudiantes registrados";

        fila.appendChild(celda);
        listaEstudiantes.appendChild(fila);

        return;
    }

    estudiantes.forEach(estudiante => {

        const fila = document.createElement("tr");

        // Crear celdas
        const datos = [
            estudiante.id,
            estudiante.nombre,
            estudiante.matricula,
            estudiante.carrera
        ];

        datos.forEach(dato => {

            const celda = document.createElement("td");

            celda.textContent = dato;

            fila.appendChild(celda);

        });

        // Celda de acciones
        const celdaAcciones = document.createElement("td");

        const botonEditar = document.createElement("button");
        botonEditar.textContent = "Editar";
        botonEditar.className = "btn-editar";

        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.className = "btn-eliminar";

        // Mostrar acciones al seleccionar la fila
        celdaAcciones.hidden = true;

        fila.addEventListener("click", () => {

            // Ocultar las acciones de las demás filas
            document.querySelectorAll(".acciones-estudiante")
                .forEach(celda => celda.hidden = true);

            celdaAcciones.hidden = false;

        });

        botonEditar.addEventListener("click", (evento) => {

            evento.stopPropagation();

            editarEstudiante(estudiante);

        });

        botonEliminar.addEventListener("click", (evento) => {

            evento.stopPropagation();

            eliminarEstudiante(estudiante.id);

        });

        celdaAcciones.append(botonEditar, botonEliminar);
        celdaAcciones.classList.add("acciones-estudiante");

        fila.appendChild(celdaAcciones);

        listaEstudiantes.appendChild(fila);

    });

}


// ==========================================
// 3. CREAR O MODIFICAR ESTUDIANTE
// ==========================================

formulario.addEventListener("submit", async (evento) => {

    evento.preventDefault();

    const id = campoId.value;

    const estudiante = {

        nombre: campoNombre.value.trim(),
        matricula: campoMatricula.value.trim(),
        carrera: campoCarrera.value.trim()

    };

    if (!estudiante.nombre || !estudiante.matricula || !estudiante.carrera) {

        mensaje.textContent = "Complete todos los campos";
        mensaje.style.color = "red";

        return;
    }

    try {

        let respuesta;

        if (id) {

            // Modificar estudiante existente

            respuesta = await fetch(`${API_URL}/${id}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(estudiante)

            });

        } else {

            // Crear nuevo estudiante

            respuesta = await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(estudiante)

            });

        }

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.mensaje || "No se pudo guardar");
        }

        mensaje.textContent = resultado.mensaje;
        mensaje.style.color = "green";

        limpiarFormulario();

        await obtenerEstudiantes();

    } catch (error) {

        mensaje.textContent = error.message;
        mensaje.style.color = "red";

    }

});


// ==========================================
// 4. CARGAR DATOS PARA EDITAR
// ==========================================

function editarEstudiante(estudiante) {

    campoId.value = estudiante.id;

    campoNombre.value = estudiante.nombre;
    campoMatricula.value = estudiante.matricula;
    campoCarrera.value = estudiante.carrera;

    tituloFormulario.textContent = "Editar estudiante";

    botonEnviar.textContent = "Guardar cambios";

    botonCancelar.hidden = false;

    // Subir al formulario
    document.getElementById("formulario")
        .scrollIntoView({ behavior: "smooth" });

}


// ==========================================
// 5. ELIMINAR ESTUDIANTE
// ==========================================

async function eliminarEstudiante(id) {

    const confirmar = confirm(
        "¿Está seguro de que desea eliminar este estudiante?"
    );

    if (!confirmar) return;

    try {

        const respuesta = await fetch(`${API_URL}/${id}`, {

            method: "DELETE"

        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.mensaje || "Error al eliminar");
        }

        mensaje.textContent = resultado.mensaje;
        mensaje.style.color = "green";

        if (campoId.value === String(id)) {
            limpiarFormulario();
        }

        await obtenerEstudiantes();

    } catch (error) {

        mensaje.textContent = error.message;
        mensaje.style.color = "red";

    }

}


// ==========================================
// 6. LIMPIAR FORMULARIO
// ==========================================

function limpiarFormulario() {

    formulario.reset();

    campoId.value = "";

    tituloFormulario.textContent = "Ingrese sus datos";

    botonEnviar.textContent = "Guardar estudiante";

    botonCancelar.hidden = true;

}


// ==========================================
// 7. CANCELAR EDICIÓN
// ==========================================

botonCancelar.addEventListener("click", () => {

    limpiarFormulario();

    mensaje.textContent = "";

});


// ==========================================
// 8. CARGAR DATOS AL INICIAR LA PÁGINA
// ==========================================

obtenerEstudiantes();

