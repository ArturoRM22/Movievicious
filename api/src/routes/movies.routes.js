import {Router} from 'express';
import {methods as moviesController} from '../controllers/movies.controllers.js';

const router  = Router();

router.get('/health', moviesController.testConnection);

export default router;











/* router.get('/salones_disponibles',salonController.get_salones_disponibles);

router.get('/salones_disponibles/:id',salonController.get_salon);

router.get('/mesas-disponibles/:id_salon',salonController.get_mesas);

router.get('/equipos-disponibles',salonController.get_equipos_disponibles);

router.get('/horas-disponibles',salonController.get_horas_disponibles);

router.post('/agregar-salon', salonController.add_salon);

router.post('/agregar-horario', salonController.agregar_horario);

router.post('/agregar-reserva', salonController.agregar_reserva);

router.put('/salon_update/:id', salonController.update_salon);

router.put('/actualizar-reservas',salonController.actualizar_reservas);

router.patch('/salon_update/:id',salonController.update_salon);

router.delete('/salon_delete/:id', salonController.delete_salon); */