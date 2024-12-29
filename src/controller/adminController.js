const alumniModel = require('../model/alumniModel')

const deleteAlumni = async (req, res) => {
    const id = req.params.id
    let alumniEnrollmentNo = '';
    try {
        const isAvailable = await alumniModel.findById(id);
        if (!isAvailable) {
            return res.status(400).json({
                success: false,
                message: 'Alumni not found with the provided ID.'
            })
        }
        alumniEnrollmentNo = isAvailable.enrollementNumber;
        await alumniModel.deleteOne({ _id: id })
        return res.status(200).json({
            success: true,
            message: `Alumni with enrollment number ${alumniEnrollmentNo} has been deleted successfully.`
        })
    } catch (error) {
        return res.status(500).json({
            success: true,
            message: 'An error occurred on the server. Please try again later.'
        })
    }
}

module.exports = {
    deleteAlumni
}