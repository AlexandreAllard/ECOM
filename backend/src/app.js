const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Route de base
app.get('/', (req, res) => {
    res.send('Bonjour de l\'API Mecascrap !');
});

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
