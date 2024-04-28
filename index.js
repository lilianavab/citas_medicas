import express from 'express'; // Dependencia para levantar el servidor
import chalk from 'chalk'; // Dependencia para agregar color a los textos en la terminal
import moment from 'moment'; // Dependencia para el manejo del tiempo
import { v4 as uuidv4 } from 'uuid'; // Dependencia para generar un ID dinámico de forma aleatoria
import _ from 'lodash'; // Dependencia para el manejo de datos, especialmente de Array
import axios from 'axios'; // Dependencia para realizar peticiones a servidores web y obtener datos

const app = express(); // Constante app que se le asigna el método express()

moment.locale("es"); // Se establece el idioma de Moment.js en español

let usuarios = []; // Variable para almacenar los datos de los usuarios

// Función para obtener información de un usuario aleatorio y añadirlo a la lista de usuarios
const obtenerUsuarioAleatorio = async () => {
    try {
        const info = await axios.get('https://randomuser.me/api/'); // Se aplica el paquete de Axios
        const { gender, name: { first, last } } = info.data.results[0];
        const id = uuidv4().slice(0, 6); // Se aplica el paquete de uuid
        const timestamp = moment().format('MMMM Do YYYY, h:mm:ss a');  // Se aplica el paquete de moment

        // Se añade el usuario a la lista de usuarios
        usuarios.push({
            gender,
            first,
            last,
            id,
            timestamp
        });

        return usuarios; 
    } catch (error) {
        // Manejo de errores en caso de falla en la solicitud
        if (error.response) {
            console.error('Error de respuesta:', error.response.status);
            console.error('Cuerpo de la respuesta:', error.response.data);
        } else if (error.request) {
            console.error('La solicitud fue hecha pero no hubo respuesta');
        } else {
            console.error('Error al configurar la solicitud:', error.message);
        }
        
    }
};

// Ruta para obtener y mostrar la lista de usuarios
app.get('/usuarios', (req, res) => {
    obtenerUsuarioAleatorio()
        .then(usuarios => {
            // Se dividen los usuarios en dos grupos: mujeres y hombres
            const [mujeres, hombres] = _.partition(usuarios, persona => persona.gender === 'female'); // Se aplica el paquete de lodash

          
            const listado = `
                <h3>Mujeres</h3>
                <ol>
                    ${mujeres.map(persona => `<li>Nombre: ${persona.first} - Apellido: ${persona.last} - ID: ${persona.id} - Timestamp: ${persona.timestamp}</li>`).join('')}
                </ol>
                <h3>Hombres</h3>
                <ol>
                    ${hombres.map(persona => `<li>Nombre: ${persona.first} - Apellido: ${persona.last} - ID: ${persona.id} - Timestamp: ${persona.timestamp}</li>`).join('')}
                </ol>
            `;

            console.log('Salida del listado:', chalk.blue.bgWhite(listado)); // Se aplica el paquete de chalk
            res.send(listado); 
        })
        .catch(err => {
            console.error('Error al obtener usuarios:', err);
           
        });
});

// Se levanta un servidor en el puerto 3000
app.listen(3000, () => console.log('El servidor está escuchando en el puerto 3000')); // Se levanta el servidor con el comando Nodemon











