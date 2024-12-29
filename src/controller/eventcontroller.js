const eventModel = require("../model/eventModel");
const alumniModel = require("../model/alumniModel");
const moment = require("moment");
const formatDate = moment().format("MM/DD/YYYY");

console.log(formatDate);

const createEvent = async (req, res) => {
  const eventimage = req.file ? req.file.path : null;
  const { eventTitle, eventContent, eventImage, adminID, dueDate, eventBatch } =
    req.body;

  if (!eventTitle || !eventContent || !adminID) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  try {
    const createdEvent = await eventModel.create({
      eventTitle,
      eventContent,
      eventImage: eventimage,
      adminID,
      dueDate,
      eventBatch,
    });

    return res.status(201).json({
      success: true,
      message: "Event is created successfully.",
      data: {
        createdEvent,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating event.",
      error: error.message,
    });
  }
};

const getAllEvents = async (req, res) => {
  try {
    let objectFilter = {};
    if (req.query.batch) {
      objectFilter.eventBatch = req.query.batch;
    }
    const allEvents = await eventModel.find(objectFilter).select("-listOfAlumniForEvents");

    return res.status(200).json({
      success: true,
      totalEvents: allEvents.length,
      data: allEvents,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching events.",
      error: error.message,
    });
  }
};

const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEvent = await eventModel.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting event.",
      error: error.message,
    });
  }
};

const updateEvent = async (req, res) => {
  console.log(req.body);
  const eventimage = req.file ? req.file.path : null;
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.eventImage = req.file.path;
    }
    const event = await eventModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true, // show the update record
      }
    );
    res.status(200).json({
      status: true,
      data: {
        event,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error,
    });
  }
};

/*  once alumni add no need to add them once more. */
const alumniForEvents = async (req, res) => {
  const { id, alumniEnrollmentNo } = req.body;

  try {
    const addAlumni = await eventModel.findByIdAndUpdate(
      { _id: id },
      { $push: { listOfAlumniForEvents: { alumniEnrollmentNo } } },
      { new: true }
    );
    if (!addAlumni) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Alumni added to event successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error adding alumni to event.",
      error: error.message,
    });
  }
};

const eventAndThereAlumni = async (req, res) => {
  const id = req.params.id;

  try {
    const event = await eventModel.findOne({ _id: id });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    // Extract the alumniEnrollmentNo values from listOfAlumniForEvents
    const alumniEnrollmentNumbers = event.listOfAlumniForEvents.map(
      (alumni) => alumni.alumniEnrollmentNo
    );
    // console.log(alumniEnrollmentNumbers);   /* ok */

    const finalAlumniForEvents = await alumniDetails(alumniEnrollmentNumbers);

    const { listOfAlumniForEvents, ...eventdetail } = event.toObject();

    return res.status(200).json({
      success: true,
      message: "List of alumni enrollment numbers for the event.",
      AllEventandAlumniDetails: {
        eventdetail,
        finalAlumniForEvents,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error in retrieving alumni list for the event.",
      error: error.message,
    });
  }
};

const alumniDetails = async (alumnilist) => {
  const alumniData = await alumniModel.find({
    enrollementNumber: { $in: alumnilist },
  });

  return alumniData.map((alum) => ({
    alumniEnrollment: alum.enrollementNumber,
    alumniEmail: alum.email,
    alumniFirstName: alum.firstName,
    alumniImage: alum.image,
  }));
};

module.exports = {
  createEvent,
  getAllEvents,
  deleteEvent,
  updateEvent,
  alumniForEvents,
  eventAndThereAlumni,
};
