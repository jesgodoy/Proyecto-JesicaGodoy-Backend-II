export const buildQueryOptions = (query) => {
    const { limit = 20, page = 1, sort } = query;
    const skip = (page - 1) * limit;
    
    let sortOptions = {};
    if (sort) {
        sortOptions.price = sort === 'asc' ? 1 : -1;
    }

    return { limit: parseInt(limit), skip, sortOptions };
};