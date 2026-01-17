function runAsyncQuery(query, parameters) {
  return new Promise((resolve, reject) => {
    db.all(query, parameters, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}
