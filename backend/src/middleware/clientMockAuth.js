// Temporary mock auth middleware for Client user
// Same technique as Support Dashboard's mockAuth
// Will be replaced when JWT auth lands from auth teammate

const clientMockAuth = (req, res, next) => {
  req.user = {
    id: '00000000-0000-0000-0000-000000000002',
    full_name: 'Alex Thompson',
    email: 'alex.thompson@client.com',
    role: 'Client'
  };
  next();
};

module.exports = clientMockAuth;
