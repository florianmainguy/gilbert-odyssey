
const Classique = require('../models/classique-model')

getClassique = async (req, res) => {
    await Classique.findOne({ _name: req.params.name }, (err, classique) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!classique) {
            return res
                .status(404)
                .json({ success: false, error: `Classique not found` })
        }
        return res.status(200).json({ success: true, data: classique })
    }).catch(err => console.log(err))
}

getClassiques = async (req, res) => {
    await Classique.find({}, (err, classiques) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!classiques.length) {
            return res
                .status(404)
                .json({ success: false, error: `Classique not found` })
        }
        return res.status(200).json({ success: true, data: classiques })
    }).catch(err => console.log(err))
}

module.exports = {
    getClassique,
    getClassiques,
}
