
const express = require("express");
const path = require("path");

const conexion = require("./config/database");

const app = express();

const PORT = process.env.PORT || 3000;


// ==========================================
// MIDDLEWARES
// ==========================================

// Permite recibir JSON
app.use(express.json());


// ==========================================
// RUTAS DE LA API
// ==========================================

const estudiantesRoutes = require("./routes/estudiantes");

app.use("/api/estudiantes", estudiantesRoutes);


// ==========================================
// FRONTEND
// ==========================================

// Servir archivos HTML, CSS y JS
app.use(express.static(path.join(__dirname, "../public")));


// ==========================================
// RUTA PRINCIPAL
// ==========================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "../public/index.html")
    );

});


// ==========================================
// INICIAR SERVIDOR
// ==========================================

async function iniciarServidor() {

    try {

        // Comprobar conexión con MySQL
        await conexion.query("SELECT 1");

        console.log("Conexión con MySQL establecida");

        app.listen(PORT, "0.0.0.0", () => {

            console.log(`Servidor ejecutándose en el puerto ${PORT}`);

        });

    } catch (error) {

        console.error("No se pudo conectar con MySQL:", error);

        process.exit(1);

    }

}

iniciarServidor();
