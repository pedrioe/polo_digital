const express = require("express");
const app = express();
const mysql = require("mysql2");

app.use(express.static("public"));
app.use(express.json());

// crear conexion a base de datos
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "pedro",
  database: "polo_digital",
});

// conectarse al servidor de mysql local
connection.connect(function (error) {
  if (error) {
    return console.error(`error: ${error.message}`);
  }

  console.log("Conectado a MySQL!!!");
});

/**
 * Funciones utiles ------------------------------------------------------------------------------------
 */

function handleSQLError(response, error, result, callback) {
  if (error) {
    response.status(400).send(`error: ${error.message}`);

    return;
  }

  callback(result);
}
/**
 * Termina Funciones Utiles ----------------------------------------------------------------------------
 */

/**
 * Endpoints para el Index. ----------------------------------------------------------------------------
 */ //local:8000/carrusel?total=3
http: app.get("/carrusel", function (request, response) {
  connection.query("select * from usuarios", function (error, result, fields) {
    handleSQLError(response, error, result, function (result) {
      let total = request.query.total;
      let eventos = [];

      for (let i = 0; i < total; i++) {
        eventos[i] = result[i];
      }

      response.send(eventos);
    });
  });
});

app.get("/evento/:idEvento", function (request, response) {
  const idEvento = request.params.idEvento;

  connection.query(
    `select * from usuarios where id = ${idEvento}`,
    function (error, result, fields) {
      handleSQLError(response, error, result, function (result) {
        if (result.length == 0) {
          response.send({});
        } else {
          response.send(result[0]);
        }
      });
    }
  );
});

/**
 * Termina Index---------------------------------------------------------------------------------------
 */

/**
 * Endpoints para login y registro ---------------------------------------------------------------------
 * Ejemplo URL: http://localhost:8000/login?email=isare@email.com&password=1234
 */
app.get("/login", function (request, response) {
  const email = request.query.email;
  const password = request.query.password;
  const modoNuevo = `select * from usuarios where email = '${email}' and password = '${password}'`;

  console.log(modoNuevo);

  connection.query(
    "select * from usuarios where email = '" +
      email +
      "' and password = '" +
      password +
      "'",
    function (error, result, fields) {
      handleSQLError(response, error, result, function (result) {
        console.log(result);

        if (result.length == 0) {
          response.send({ message: "Email o password no validos" });
        } else {
          response.send({ message: "Usuario logueado" });
        }
      });
    }
  );
});

app.post("/registro", function (request, response) {
  let nombre = request.body.nombre;
  let apellidos = request.body.apellidos;
  let dni = request.body.dni;
  let telefono = request.body.telefono;
  let email = request.body.email;
  let password = request.body.password;
  let cliente = request.body.cliente;

  console.log(request.body);
  // 1. insert into usuario
  connection.query(
    `insert into usuarios (email, password) values ( "${email}", "${password}")`,
    function (error, result, fields) {
      handleSQLError(response, error, result, function (result) {
        console.log("usuario insertado");
      });

      // 2. select from usuarios
      connection.query(
        `select id from usuarios where email = "${email}"`,
        function (error, result, fields) {
          console.log(error);
          const usuarioId = result[0].id;

          // 3. inserte into empleados_clientes con usuariodId
          connection.query(
            `insert into empleados_clientes ( nombre, apellidos, usuarioId) values ("${nombre}", "${apellidos}", "${usuarioId}")`,
            function (error, result, fields) {
              handleSQLError(response, error, result, function (result) {
                console.log(result);
                response.send("usuario regsitrado");
              });
            }
          );
        }
      );
    }
  );
});

/**
 * Termina Login y Registro ---------------------------------------------------------------------------
 */
app.get("/clientes", function (request, response) {
  connection.query(`select * from clientes`, function (error, result) {
    if (error) {
      response.status(400).send(`error:${error.message}`);
      return;
    }
    response.send(result);
  });
  console.log("Listado de clientes en base de datos");
});

app.post("/clientes/:id", function (request, response) {
  let nombre = request.body.nombre;
  let razonSocial = request.body.razonSocial;
  let cif = request.body.cif;
  let telefono = request.body.telefono;
  let sector = request.body.sector;
  let numeroEmpleados = request.body.numeroEmpleados;

  const idclientes = request.params.id;
  console.log(idclientes);

  console.log(request.body);
  connection.query(
    `update clientes set nombre = "${nombre}", razonSocial = "${razonSocial}", cif = "${cif}", telefono = "${telefono}", sector = "${sector}", numeroEmpleados = "${numeroEmpleados}" where id = ${idclientes}`,
    function (error, result, fields) {
        console.log(error);
      response.send({ message: "Update cliente en base de datos" });
      console.log("Update cliente en base de datos");
    });
});

app.post("/clientes ", function (request, response) {
  let nombre = request.body.nombre;
  let razonSocial = request.body.razonSocial;
  let cif = request.body.cif;
  let telefono = request.body.telefono;
  let sector = request.body.sector;
  let numeroEmpleados = request.body.numeroEmpleados;

  connection.query(
    `insert into cliente (nombre, razonSocial, cif, telefono, sector, numeroEmplados) valures ("${nombre}", "${razonSocial}", "${cif}", "${telefono}", "${sector}", "${numeroEmpleados}")`,
    function (error, result, fields) {
      handleSQLError(response, error, result, function (result) {
        console.log(result);

        console.log("Insertar clientes en base de datos");
      });
    }
  );
});

app.get("/clientes/id", function (request, response) {
  let datosClientes = request.params.id;
  connection.query(
    `select * from clientes where id = ${id}`,
    function (error, result, fields) {
      console.log(error);
      handleSQLError(response, error, result, function (result) {
        if (result == 0) {
          response.send([]);
        } else {
          response.send(result);
          console.log("Obtienen los datos del cliente con el id en :id");
          
        }
      });
    }
  );
});
  // Termina clientes--------------------------------------------------------------------------------------

  app.listen(8000, function () {
    console.log("Server up and running!!!");
  });
