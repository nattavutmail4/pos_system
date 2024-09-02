const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 5000;
const app = express();

app.disable('x-powered-by');
app.use(cors());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(express.urlencoded({extended:false, limit:"5000MB"})) 
app.use(express.json({ limit: '5000MB' }))
app.use('/',express.static(`./uploads/`))

app.use('/api', require('./routes/index'));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
