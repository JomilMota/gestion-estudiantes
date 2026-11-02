
const express = require("express");
const router = express.Router();

const conexion = require("../config/database");


// ==========================================
// GET: CONSULTAR TODOS LOS ESTUDIANTES
// ==========================================

router.get("/", async (req, res) => {

    try {

        const [estudiantes] = await conexion.query(
            "SELECT * FROM estudiantes ORDER BY id DESC"
        );

        res.json(estudiantes);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al consultar estudiantes"
        });

    }

});


// ==========================================
// GET: CONSULTAR UN ESTUDIANTE POR ID
// ==========================================

router.get("/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const [estudiantes] = await conexion.execute(
            "SELECT * FROM estudiantes WHERE id = ?",
            [id]
        );

        if (estudiantes.length === 0) {

            return res.status(404).json({
                mensaje: "Estudiante no encontrado"
            });

        }

        res.json(estudiantes[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al consultar estudiante"
        });

    }

});


// ==========================================
// POST: CREAR ESTUDIANTE
// ==========================================

router.post("/", async (req, res) => {

    try {

        const { nombre, matricula, carrera } = req.body;

        if (!nombre?.trim() || !matricula?.trim() || !carrera?.trim()) {

            return res.status(400).json({
                mensaje: "Todos los campos son obligatorios"
            });

        }

        const [resultado] = await conexion.execute(

            `INSERT INTO estudiantes
            (nombre, matricula, carrera)
            VALUES (?, ?, ?)`,

            [
                nombre.trim(),
                matricula.trim(),
                carrera.trim()
            ]

        );

        res.status(201).json({

            mensaje: "Estudiante registrado correctamente",

            id: resultado.insertId

        });

    } catch (error) {

        console.error(error);

        if (error.code === "ER_DUP_ENTRY") {

            return res.status(409).json({
                mensaje: "La matrícula ya está registrada"
            });

        }

        res.status(500).json({
            mensaje: "Error al registrar estudiante"
        });

    }

});


// ==========================================
// PUT: MODIFICAR ESTUDIANTE
// ==========================================

router.put("/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const { nombre, matricula, carrera } = req.body;

        if (!nombre?.trim() || !matricula?.trim() || !carrera?.trim()) {

            return res.status(400).json({
                mensaje: "Todos los campos son obligatorios"
            });

        }

        const [resultado] = await conexion.execute(

            `UPDATE estudiantes
             SET nombre = ?, matricula = ?, carrera = ?
             WHERE id = ?`,

            [
                nombre.trim(),
                matricula.trim(),
                carrera.trim(),
                id
            ]

        );

        if (resultado.affectedRows === 0) {

            return res.status(404).json({
                mensaje: "Estudiante no encontrado"
            });

        }

        res.json({
            mensaje: "Estudiante actualizado correctamente"
        });

    } catch (error) {

        console.error(error);

        if (error.code === "ER_DUP_ENTRY") {

            return res.status(409).json({
                mensaje: "La matrícula ya pertenece a otro estudiante"
            });

        }

        res.status(500).json({
            mensaje: "Error al actualizar estudiante"
        });

    }

});


// ==========================================
// DELETE: ELIMINAR ESTUDIANTE
// ==========================================

router.delete("/:id", async (req, res) => {

    try {

        const { id } = req.params;

        const [resultado] = await conexion.execute(

            "DELETE FROM estudiantes WHERE id = ?",

            [id]

        );

        if (resultado.affectedRows === 0) {

            return res.status(404).json({
                mensaje: "Estudiante no encontrado"
            });

        }

        res.json({
            mensaje: "Estudiante eliminado correctamente"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            mensaje: "Error al eliminar estudiante"
        });

    }

});


module.exports = router;
