const express = require('express')
const eventController = require('../controller/eventcontroller')
const { eventsimageUpload }=require('../middleware/multer')

const eventRoters = express.Router()

eventRoters.post('/createevents', eventsimageUpload.single('eventimage'), eventController.createEvent)

eventRoters.get('/getallevents', eventController.getAllEvents)

eventRoters.delete('/deleteEvents/:id', eventController.deleteEvent)

eventRoters.put('/updateevent/:id', eventsimageUpload.single('eventimage'), eventController.updateEvent)

eventRoters.put('/alumniforevents', eventController.alumniForEvents)

eventRoters.get('/eventandalumni/:id', eventController.eventAndThereAlumni)

/*  Filter API  */


module.exports = eventRoters
