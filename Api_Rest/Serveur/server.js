// Importation des librairies

//importation de la librairie restify
var restify = require('restify');
//importation de la librairie node-uuid, libère des identifiants unique pour les todos
var uuid = require('node-uuid');

// Initialisation du serveur, e.i création du serveur 
var server = restify.createServer({
  name: 'ENI-JS-Server',
  version: '1.0.0'
});

// Paramétrage du serveur, paramétrage du serveur 
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.CORS());

// Déclaration de la liste des todos
/*
variable global qui stocke la liste des todos */
var listeTodos = [];

// Récupération d'une todo liste
//Récupération de la liste todo via le protocole get 
server.get('/todos/:name', function(req, res, next) {
  // Si aucune todoliste n'est précisée, alors on utilise la todoliste par defaut
  var name = "default";
  if (req.params.name) {
    name = req.params.name;
  }

  // Si la todo liste n'existe pas, alors on la créée
  if (!listeTodos[name]) {
    listeTodos[name] = [];
  }

  // Retour de la todo liste
  res.json(listeTodos[name]);

  return next();
});

// Ajout d'un todo à une todo liste
//:name, :titre, :description sont des paramètres qui seront ajouté via la méthode post 
server.post('todos/:name/:titre/:description', function(req, res, next) {
  // Si aucune todoliste n'est précisée, alors on utilise la todoliste par defaut
  var name = "default";
  if (req.params.name) {
    name = req.params.name;
  }

  // Si il n'existe pas de todo liste à ce nom, alors on renvoie une erreur 500
  if (!listeTodos[name]) {
    res.send(500);
  } else {
    // Si le titre ou la description ne sont pas valorisés, alors on renvoie une erreur 500
    if (!req.params.titre || !req.params.description) {
      res.send(500);
    } else {
      // Si tout est correct on construit un nouvel objet todo
      var todo = {
        // Génération d'un UUID(identifiant unique)
        uuid: uuid.v4(),
        titre: req.params.titre,
        description: req.params.description
      };

      // Ajout du todo dans sa todo liste
      listeTodos[name].push(todo);

      // Retour du todo créé
      res.json(todo);
    }
  }

  return next();
});

// methode de Suppression d'un todo dans une liste de todo
server.del('todos/:name/:uuid', function(req, res, next) {
  // Si aucune todoliste n'est précisée, alors on utilise la todoliste par defaut
  var name = "default";
  if (req.params.name) {
    name = req.params.name;
  }

  // Récupération de l'identifiant unique du todo
  var uuid = req.params.uuid;

  // Si l'identifiant unique du todo n'et pas valorisé, alors retour d'une erreur 500
  if (!uuid) {
    res.send(500);
  } else {
    // Recherche de l'index du todo dans la todo liste
    var index = -1;
    for (var i = 0; i < listeTodos[name].length; i++) {
      if (listeTodos[name][i] && listeTodos[name][i].uuid === uuid) {
        index = i;
        break;
      }
    }

    // Si l'index a été trouvé, suppression de la case correspondant à cet index
    if (index > -1) {
      listeTodos[name].splice(index, 1);
      res.send(200);
    } else {
      // Si l'index n'a pas été trouvé, retour d'une erreur 404
      res.send(404);
    }
  }

  return next();
});

// Lancer l'écoute du serveur sur le port 9090
server.listen(9090, function() {
  console.log('%s ecoute sur %s', server.name, server.url);
});
//http://[::]:9090