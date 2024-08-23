const express = require('express');
const bodyParser = require('body-parser');
const connectToDatabase = require('./config/db');
const indexRouter = require('./routes/consultants.js');
const h1bRouter = require('./routes/h1bCandidates.js');
const americanClientRouter = require('./routes/americanClientCalling.js'); 
const canadianCandidateRouter = require('./routes/canadianCandidate.js');
const clientVendorRouter = require('./routes/clientVendorMapping'); // Add this line
const infosysPMContactsRouter = require('./routes/infosysPMContacts'); // Add this line
const rpoRouter = require('./routes/rpo'); // Add this line
const vendorsRouter = require('./routes/vendors'); // Add this line
const jobsRoutes = require('./routes/jobs');
const applicantsRoutes = require('./routes/applicants');

const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

const port = 8080;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connect to MongoDB
connectToDatabase();

// Routes
app.use('/consultants', indexRouter);
app.use('/h1b_candidates', h1bRouter);
app.use('/american_clients', americanClientRouter);
app.use('/canadian_candidates', canadianCandidateRouter)
app.use('/client_vendor_mapping', clientVendorRouter); // Add this line
app.use('/infosys_pm_contacts', infosysPMContactsRouter); // Add this line
app.use('/rpo', rpoRouter); // Add this line
app.use('/vendors', vendorsRouter); // Add this line
app.use('/jobs', jobsRoutes);
app.use('/applicants', applicantsRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
