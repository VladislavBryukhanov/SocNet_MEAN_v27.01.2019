const express = require('express');
const router = express.Router();
const Rate = require('../models/rate');
const Blog = require('../models/blog');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const findWithPaging = require('../common/paging');

const actions = require('../common/constants').actions;
const targetType = require('../common/constants').targetType;

const postRate = async (Model, request) => {
    const { body, user } = request;

/*    const prevRate = await Model.findOne({
        _id: body.itemId
    }).populate({
        path: 'rate',
        match: {user: body.user}
    }).then(res => res.rate);*/

    // const prevRate = await Model.aggregate([
    //     {
    //         $match: {
    //             _id: mongoose.Types.ObjectId(body.itemId)
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: "images",
    //             localField: "attachedFiles",
    //             foreignField: "_id",
    //             as: "attachedFiles"
    //         }
    //     },
    // ]).then(res => res[0].attachedFiles);
 /*   const prevRate = await Model.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId(body.itemId)
            }
        },
        {
            $lookup: {
                from: "rates",
                localField: "rate",
                foreignField: "_id",
                as: "rate",
            },
            $match: {
                "project.rates.user": body.user
            }
        },
    ]).then(res => res[0].rate);*/
    const prevRate = await Model.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId(body.itemId)
            }
        },
        {
            $lookup: {
                from: "rates",
                localField: "rate",
                foreignField: "_id",
                as: "rate"
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$user", body.user]},
                                { $eq: ["$user", user]}
                            ]
                        }
                    }
                }
            ]
        },
    ]).then(res => res[0].rate);
    console.log(prevRate);

    // const prevRate = await Rate.findOne({
    //     user: mongoose.Types.ObjectId(request.body.userId),
    //     itemId: request.body.itemId
    // });
    if (prevRate) {
        if (prevRate.isPositive !== body.isPositive) {
            body.lastState = prevRate.isPositive;
            return (await Rate.findOneAndUpdate({_id: prevRate._id}, body,
                { upsert: true, new: true, setDefaultsOnInsert: true }));
        } else {
            const rate = await Rate.findOneAndDelete({_id: prevRate._id});

        }
    } else {
        return (await Rate.create(body));
    }
};

router.get('/getRatedUsers/:itemId&:isPositive&:limit&:offset', bodyParser.json(), async (request, response) => {
    const itemId = request.params.itemId;
    const isPositive = request.params.isPositive;
    const populate = {
        path: 'user',
        populate: {path: 'avatar'}
    };
    const res = await findWithPaging(request.params, Rate, {itemId, isPositive}, populate);
    res.data = res.data.map( item => item.user );
    res.data.length > 0 ? response.send(res) : response.sendStatus(404);
});

router.get('/getRateCounter/:itemId&:userId', async (request, response) => {
    const itemId = request.params.itemId;
    const user = mongoose.Types.ObjectId(request.params.userId);

    const likeCounter = await Rate.count({itemId, isPositive: true});
    const dislikeCounter = await Rate.count({itemId, isPositive: false});
    const myAction = await Rate.findOne({itemId, user, isPositive: true}) ? actions.LIKE
        : await Rate.findOne({itemId, user, isPositive: false}) ? actions.DISLIKE : null;

    response.send({likeCounter, dislikeCounter, myAction});
});

router.post('/postRate', async (request, response) => {
    request.body.user = mongoose.Types.ObjectId(request.body.rate.userId);
    // const itemId = request.body.itemId;
    const typeTarget = request.body.targetType;

    switch(typeTarget) {
        case targetType.blog: {
            const res = await postRate(Blog, request);
            console.log(res);
            return response.sendStatus(res);
        }
        case targetType.comment: {
            return response.sendStatus(500);
        }
        case targetType.image: {
            return response.sendStatus(500);
        }
        default: {
            return response.sendStatus(400);
        }
    }
});

module.exports = router;