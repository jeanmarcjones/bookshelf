function proxy(app) {
  // add the redirect handler here
  app.get(/\/$/, function (req, res) {
    res.redirect('discover')
  })
}

module.exports = proxy
