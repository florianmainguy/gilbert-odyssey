const Classique = require('../models/classique-model')

/*
createClassique = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a classique',
        })
    }

    const classique = new Classique(body)

    if (!classique) {
        return res.status(400).json({ success: false, error: err })
    }

    classique
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: classique._id,
                message: 'Classique created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Classique not created!',
            })
        })
}*/

getClassiqueByName = async (req, res) => {
    await Classique.findOne({ raceName: req.params.name }, (err, classique) => {
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
                .json({ success: false, error: `Classiques not found` })
        }
        return res.status(200).json({ success: true, data: classiques })
    }).catch(err => console.log(err))
}

module.exports = {
    getClassiqueByName,
    getClassiques,
}
