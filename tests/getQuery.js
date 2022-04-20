const getQuery = (queryStr, variables = null) => {
  if (!variables) {
    return {
      query: queryStr,
    };
  }
  return {
    query: queryStr,
    variables: variables,
  };
};

module.exports = getQuery;