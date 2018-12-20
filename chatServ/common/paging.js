const findWithPaging = async (params, Model, query, populate) => {
    const limit = Number(params.limit);
    const offset = Number(params.offset);
    const data = await Model.find(
            query,
            [],
            {skip: offset, limit})
        .sort({date: -1})
        .populate(populate);

    return {
        data,
        count: await Model.count(query),
        offset,
        limit
    };
};

module.exports = findWithPaging;