const Classique = require('./models/classique-model')
const Cyclist = require('./models/cyclist-model')

getClassiquesAndCyclists = async (req, res) => {
    let classiques = await Classique.find({}, (err, classiques) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!classiques.length) {
            return res
                .status(404)
                .json({ success: false, error: `Classiques not found` })
        }
        //return res.status(200).json({ success: true, data: classiques })
    }).catch(err => console.log(err))

    let cyclists = await Cyclist.find({}, (err, cyclists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!cyclists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Cyclists not found` })
        }
        //return res.status(200).json({ success: true, data: cyclists })
    }).catch(err => console.log(err))

    return res
        .status(200)
        .json({ success: true, classiques: classiques, cyclists: cyclists })
}

module.exports = {
    getClassiquesAndCyclists
}
