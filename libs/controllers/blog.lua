function exports.index(req, res, go)
  res.code = 302
  res.headers.Location = "/blog/luvit-reborn.html"
  res.body = nil
end

function exports.tags(req, res, go)
end
