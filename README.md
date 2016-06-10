Bogie Application
=====================

Ce projet contient une application universelle conçue en JavaScript et capable
de tourner sur le web (serveur et navigateur), ainsi que sur Android et iOS.

# Lancement
Ce projet nécéssite, en plus de node.js et des dépendances locales, d'installer
globalement les outils `gulp` et `react-native` (via `npm install --global`).

Pour démarrer l'application web en local, la commande `gulp web` permet de
compiler le code, de lancer un serveur web, ainsi qu'un serveur BrowserSync
remplaçant le CDN en mode développement.

L'application Android se lance avec la commande `react-native run-android`. Il
peut être nécéssaire de lancer un serveur de débogage si celui-ci ne s'ouvre pas
automatiquement avec la commande `react-native start`. Il faudra de plus
configurer le téléphone pour se connecter au serveur en utilisant le menu de
développement de l'application (accessible avec la touche Menu du téléphone ou
en secouant celui-ci).

L'application iOS elle peut être démarrée via le projet xCode présent dans le
dossier `ios`.

Pour des raisons de cout, le serveur web du PoC n'est pas déployé sur Amazon
mais sur Heroku, qui éxécute automatiquement la commande `npm install`. Le
fichier `package.json` contient une configuration qui lance une compilation
après l'installation des dépendances, et le serveur utilise ensuite le fichier
`Procfile` pour démarrer l'application (ici un seul processus est lancé, un
serveur web utilsant le fichier `dist/web.js`).

# Connections par les réseaux sociaux
Pour que la connection par Facebook ou Google fonctionne, des ID client
correspondant a une application sont nécéssaires. Les applications Bogie n'étant
pas publiques, il peut être nécéssaire de créer de nouvelles applications pour
pouvoir tester le projet.
