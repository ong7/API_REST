// Déclarer un tableau listeTodos qui ne contient aucun todo
var listeTodos = [];

// Déclarer une fonction qui injecte un élement todo dans le document HTML
function creerTodoHTML(todo) {
  var todoHTML = document.createElement('li');

  var todoTitreHTML = document.createElement('h3');
  var todoTitreText = document.createTextNode(todo.titre);
  todoTitreHTML.appendChild(todoTitreText);
  todoHTML.appendChild(todoTitreHTML);

  var todoDescriptionHTML = document.createElement('p');
  var todoDescriptionText = document.createTextNode(todo.description);
  todoDescriptionHTML.appendChild(todoDescriptionText);
  todoHTML.appendChild(todoDescriptionHTML);

  // <button></button>
  var todoRemoveHTML = document.createElement('button');

  // <button>Supprimer</button>
  var todoRemoveText = document.createTextNode('Supprimer');
  todoRemoveHTML.appendChild(todoRemoveText);

  todoRemoveHTML.onclick = function() {
    supprimerTodo(todo.uuid);
    afficherMesTodos();
  };
  todoHTML.appendChild(todoRemoveHTML);

  return todoHTML;
}

// Déclarer une fonction qui vide un élément HTML de ses enfants
function viderElementHTML(elementHTML) {
  while (elementHTML.firstChild) {
    elementHTML.removeChild(elementHTML.firstChild);
  }
}

// Déclarer une fonction qui affiche une liste de todos dans le document HTML
function afficherMesTodos() {
  var mesTodosHTML = document.querySelector('#mesTodos');
  viderElementHTML(mesTodosHTML);

  listeTodos.forEach(function(todo) {
    var todoHTML = creerTodoHTML(todo);
    mesTodosHTML.appendChild(todoHTML);
  });
}

// Déclarer une fonction qui affiche une liste de todos dans le document HTML
function creerUnTodo(titre, description) {
  requeteHTTPAsync("http://localhost:9090/todos/" + listeTodoCourante + "/" +
    titre + "/" +
    description, "POST",
    function(todo,
      error) {
      if (error) {
        console.log("ERREUR : " + error);
      } else {
        if (todo) {
          listeTodos.push(JSON.parse(todo));
          afficherMesTodos();
        }
      }
    });
}

// Récupérer dans deux variables une référence vers les deux éléments de formulaire
var newTodoTitre = document.querySelector("#newTodoTitre");
var newTodoDescription = document.querySelector("#newTodoDescription");

// Déclarer une fonction de callback qui ajoute un nouveau todo contenant les informations saisies par l'utilisateur, et le stocke en local
function actionCreerUnTodo() {
  creerUnTodo(newTodoTitre.value, newTodoDescription.value);
}

// Déclarer une fonction qui supprime un todo de la liste des todos
function supprimerTodo(uuid) {
  requeteHTTPAsync("http://localhost:9090/todos/" + listeTodoCourante + "/" +
    uuid, "DELETE",
    function(todo, error) {
      if (error) {
        console.log("ERREUR : " + error);
      } else {
        chargerTodos();
      }
    });
}

// Déclarer une fonction permettant d'exécuter une requête HTTP aynchrone
function requeteHTTPAsync(url, methode, callback) {
  // Construction de la requête
  var xmlHttp = new XMLHttpRequest();

  // Rappel de la fonction de callback lorsque la réponse à été réceptionnée
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      callback(xmlHttp.responseText);
    } else {
      if (xmlHttp.readyState == 4 && xmlHttp.status != 200) {
        callback(undefined, xmlHttp.status);
      }
    }
  };
  xmlHttp.open(methode, url, true);
  xmlHttp.send(null);
}

// Déclarer une fonction qui charge une todo liste depuis le serveur
function chargerTodos() {
  requeteHTTPAsync("http://localhost:9090/todos/" + listeTodoCourante, "GET",
    function(todos,
      error) {
      if (error) {
        console.log("ERREUR : " + error);
      } else {
        if (todos) {
          listeTodos = JSON.parse(todos);
          afficherMesTodos();
          afficherTodos();
        }
      }
    });
}

// Déclarer une variable qui stocke le nom de la todo liste courante
var listeTodoCourante;

// Déclarer une fonction qui affiche la liste des todos
function afficherTodos() {
  var formulaire = document.querySelector('#todoListe');
  formulaire.style.visibility = "visible";
}

// Déclarer une fonction qui cache la liste des todos
function cacherTodos() {
  var formulaire = document.querySelector('#todoListe');
  formulaire.style.visibility = "hidden";
}

// Déclarer une variable qui référence le champs de formulaire qui stocke le nom de la todo liste
var newTodoListeTitre = document.querySelector("#newListe");

// Déclarer une fonction de callback appelé lors du clic sur le bouton Récupérer
function actionChargerTodo() {
  listeTodoCourante = newTodoListeTitre.value;
  chargerTodos();
  stockerTodos();
}

// Déclarer une fonction qui enregistre le nom de la todo liste courante dans un cookie
function stockerTodos() {
  if (listeTodoCourante) {
      //un cookie est une chaine de caractère qui a une valeur séparé par un point virgule  et une date d'expiration
    document.cookie = "listeTodoCourante=" + listeTodoCourante +
      "; expires=Mon, 5 Dec 2016 12:00:00 UTC";
  }
}

// Déclarer une fonction qui charge le nom de la todo liste courante depuis un cookie
//cette fonction permet de récupérer la valeur d'un cookie
function chargerTodosDepuisCookies() {
    //On récupère un cookie et on le stocke dans un tableau dont les cases sont séparé par ;
  var cookie = document.cookie.split(';');
    //Si cookie existe et que sa valeur vaut 1
  if (cookie && cookie.length === 1) {
      //Puis on parcours le cookie et on sépare pour stocké dans un tableau, le caractère égale est le séparateur 
    var subCookie = cookie[0].split("=");
      //On vérifit que le cookie existe et que sa taille vaut 2
    if (subCookie && subCookie.length === 2) {
        //c'est la deuxième case du tableau qui nous interesse
      listeTodoCourante = subCookie[1];
      chargerTodos();
    }
  }
}

// Cacher la todo liste au chargement
cacherTodos();
chargerTodosDepuisCookies();
