const Cyclist = require('../models/cyclist-model')

getCyclistByName = async (req, res) => {
    await Cyclist.findOne({ cyclist: req.params.name }, (err, cyclist) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!cyclist) {
            return res
                .status(404)
                .json({ success: false, error: `Cyclist not found` })
        }
        return res.status(200).json({ success: true, data: cyclist })
    }).catch(err => console.log(err))
}

getCyclists = async (req, res) => {
    await Cyclist.find({}, (err, cyclists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!cyclists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Cyclists not found` })
        }
        return res.status(200).json({ success: true, data: cyclists })
    }).catch(err => console.log(err))
}

module.exports = {
    getCyclistByName,
    getCyclists
}
