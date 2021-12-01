## defi3-v2 
<h3 align="center">
  Défi 3! Here we go!
  <img src="https://media.giphy.com/media/hvRJCLFzcasrR4ia7z/giphy.gif" width="28">
</h3>
<br /> 

L'application a des bouttons qui s'auto-bloquent si le status du contract n'est pas le bon. </br>
Le passage entre different status est aussi soumis à un blocage, ça permet à l'admin de ne pas faire d'erreur. </br>

La fonctionnalité de changement de status ainsi que les getters sont tous dans des bouttons type dropdown pour ne pas encombrer l'app. </br>
Il n'y a qu'un seul boutton pour récupérer le ou les gagnants; il utilise la function countVotes (anciennement TallyVotesDraw) et juste reconstruit l'object du getter pour récupérer le ou les gagnants. </br>

Le contrat est commenté en suivant NatSpec, dans solc-docs/ . </br>
La documentation est générée avec solc, pour les dev et utilisateurs.
L'app récupère les events dont les valeurs sont utilisées pour les messages d'alerte.
Les tests fonctionnent comme dans le défi 2, mis a jour pour nouvelle fonction countVotes. 

#### Set up ###
```
npm install
truffle compile
truffle migrate (Ganache)
```
or
```truffle migrate --network ropsten```

Test with:
```truffle test```
All tests good? then:
```
npm start
```

