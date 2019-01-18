const express = require('express');
const router = express.Router();
const Rate = require('../models/rate');
const Blog = require('../models/blog');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const objId = mongoose.Types.ObjectId;
const _ = require("lodash");
// const findWithPaging = require('../common/paging');

const actions = require('../common/constants').actions;
const ModelType = require('../common/constants').ModelType;

//TODO aggregation to common module

const getRateInfo = async (Model, condition, user) => {
    return await Model.aggregate([
        {
            $match: condition
        },
        {
            $lookup: {
                from: "rates",
                localField: 'rate',
                foreignField: '_id',
                as: "rate"
            }
        },
        {
            "$project": {
                "likeCounter": {
                    "$size": {
                        "$filter": {
                            "input": "$rate",
                            "cond": { "$eq": [ "$$this.isPositive", true ] }
                        }
                    }
                },
                "dislikeCounter": {
                    "$size": {
                        "$filter": {
                            "input": "$rate",
                            "cond": { "$eq": [ "$$this.isPositive", false ] }
                        }
                    }
                },
                "myAction": {
                    "$filter": {
                        "input": "$rate",
                        "cond": { "$eq": [ "$$this.user", user ] }
                    }
                }
            }
        }
    ]);
};

const postRate = async (Model, request) => {
    const { body } = request;

    const prevRate = await Model.aggregate([
        {
            $match: {
                _id: objId(body.itemId)
            }
        },
        {
            $lookup: {
                from: "rates",
                localField: 'rate',
                foreignField: '_id',
                as: "rate"
            }
        },
        {
            "$project": {
                "rate": {
                    "$filter": {
                        "input": "$rate",
                        "cond": {"$eq": ["$$this.user", objId(body.rate.userId)]}
                    }
                }
            }
        },
    ]).then(([res]) => {
        if (res && !_.isEmpty(res.rate)) {
            return res.rate[0];
        } else {
            return null;
        }
    });
    // res[0] - $match found only one value by blog id
    // rate[0] - $pipeline + $match found only one value by userId

    request.body.rate.user = objId(body.rate.userId);
    if (prevRate) {
        if (prevRate.isPositive !== body.rate.isPositive) {
            body.rate.lastState = prevRate.isPositive;
            return (await Rate.findOneAndUpdate({_id: prevRate._id}, body.rate,
                { upsert: true, new: true, setDefaultsOnInsert: true }));
        } else {
            await Model.updateOne(
                {_id: objId(body.itemId)},
                {
                    $pull: {rate: prevRate._id}
                });
            return await Rate.findOneAndDelete({_id: prevRate._id});
        }
    } else {
        const rate = await Rate.create(body.rate);
        await Model.updateOne(
            {_id: objId(body.itemId)},
            {
                $push: {rate: rate._id}
            });
        return rate;
    }
};

router.get('/getRatedUsers/:itemId&:targetModel&:isPositive&:limit&:offset', bodyParser.json(), async (request, response) => {
    const modelTarget = request.params.targetModel;
    if (!ModelType.hasOwnProperty(modelTarget)) {
        return response.sendStatus(400);
    }
    const targetModel = mongoose.model(modelTarget);
    /*const itemId = request.params.itemId;
    const isPositive = request.params.isPositive;
    const populate = {
        path: 'user',
        populate: {path: 'avatar'}
    };
    const res = await findWithPaging(request.params, Rate, {itemId, isPositive}, populate);
    res.data = res.data.map( item => item.user );
    res.data.length > 0 ? response.send(res) : response.sendStatus(404);*/

    const itemId = objId(request.params.itemId);
    const isPositive = request.params.isPositive === 'true';
    const limit = Number(request.params.limit);
    const offset = Number(request.params.offset);
    const ratedUsers = await targetModel.aggregate([
        {
            $match: {
                _id: itemId
            }
        },
        {
            $lookup: {
                from: "rates",
                localField: 'rate',
                foreignField: '_id',
                as: "rate"
            }
        },
        {
            "$project": {
                "rate": {
                    "$filter": {
                        "input": "$rate",
                        "cond": {"$eq": ["$$this.isPositive", isPositive]}
                    }
                },
                "count": {
                    "$size": "$rate"
                }
            }
        },
        {$unwind: "$rate"},
        {$sort: {"rate.date": -1}},
        {$skip: offset},
        {$limit: limit},
        {
            $replaceRoot: {
                newRoot: "$rate"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: 'user',
                foreignField: '_id',
                as: "user"
            }
        },
        {$unwind: "$user"},
        {
            $replaceRoot: {
                newRoot: "$user"
            }
        },
        {
            $lookup: {
                from: "images",
                localField: 'avatar',
                foreignField: '_id',
                as: "avatar"
            }
        },
        {$unwind: "$avatar"},
    ]);

    // TODO count to prev aggregation
    const count = await Blog.aggregate([
        {
            $match: {
                _id: objId(request.params.itemId)
            }
        },
        {
            $lookup: {
                from: "rates",
                localField: 'rate',
                foreignField: '_id',
                as: "rate"
            }
        },
        {
            "$project": {
                "count": {
                    "$size": {
                        "$filter": {
                            "input": "$rate",
                            "cond": { "$eq": [ "$$this.isPositive", isPositive ] }
                        }
                    }
                }
            }
        }
    ]).then(res => res[0].count);

    const res = {
        data: ratedUsers,
        count,
        offset,
        limit
    };
    res.data.length > 0 ? response.send(res) : response.sendStatus(404);
});

router.get('/getRateCounter/:itemId&:targetModel&:userId', async (request, response) => {
    const modelTarget = request.params.targetModel;
    if (!ModelType.hasOwnProperty(modelTarget)) {
        return response.sendStatus(400);
    }
    const targetModel = mongoose.model(modelTarget);

    //TODO userId? mb from token?
    const rate = await getRateInfo(
        targetModel,
        {_id: objId(request.params.itemId)},
        objId(request.params.userId)
    );
    const [rateInfo] = rate;
    rateInfo.myAction = _.isEmpty(rateInfo.myAction) ? null
        : rateInfo.myAction[0].isPositive ? actions.like : actions.dislike;
    response.send(rateInfo);
});

router.post('/postRate', async (request, response) => {
    const modelTarget = request.body.targetModel;
    if (!ModelType.hasOwnProperty(modelTarget)) {
        return response.sendStatus(400);
    }
    const targetModel = mongoose.model(modelTarget);

    const res = await postRate(targetModel, request);
    return response.send(res);
});

module.exports = router;
module.exports.getRateInfo = getRateInfo;