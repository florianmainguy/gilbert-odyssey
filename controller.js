const {classiquesModel} = require('./model');
const {cyclistsModel} = require('./model');

getClassiquesAndCyclists = async (req, res) => {
    let classiques = await classiquesModel.find({}, (err, classiques) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!classiques.length) {
            return res
                .status(404)
                .json({ success: false, error: `Classiques not found` })
        }
    }).catch(err => console.log(err))

    let cyclists = await cyclistsModel.find({}, (err, cyclists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!cyclists.length) {
            return res
                .status(404)
                .json({ success: false, error: `Cyclists not found` })
        }
    }).catch(err => console.log(err))

    return res
        .status(200)
        .json({ success: true, classiques: classiques, cyclists: cyclists })
}

module.exports = {
    getClassiquesAndCyclists
};
