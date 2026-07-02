// Temporary mock auth middleware — injects a hardcoded SupportOfficer user
// Replace with real JWT verification once auth module is built
const mockAuth = (req, res, next) => {
  req.user = {
    id: '00000000-0000-0000-0000-000000000001',
    full_name: 'Sarah Miller',
    email: 'sarah.miller@support.com',
    role: 'SupportOfficer'
  };
  next();
};

module.exports = mockAuth;
