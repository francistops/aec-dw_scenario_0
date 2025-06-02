# aec-dw_scenario_0
aec dw Scénario 0  Identification et authorisation

# 420-715-SH - Programmation d'une application Web transactionnelle

## Introduction

Préparation du cours d'AEC de Développement Web (LEA.6C) du Cégep de Sherbrooke pour le groupe 07019.

### note pour collaboration:
- Assure-toi que Git fonctionne (email et username pour pouvoir commits) et que tu as un compte GitHub.
```bash
git config --add --global user.name "GITHUB_USERNAME"
git config --add --global user.email "EMAIL ou OFFUSCATED_EMAIL eg: 69420+francistops@users.noreply.github.com"
git config --global init.defaultBranch main
git config --global pull.rebase true
git config --global --add --bool push.autoSetupRemote true
```
- Avec ton compte GitHub, on va forker la branche `main` de mon repo [scenario_0](https://github.com/francistops/aec-dw_scenario_0).
- Ensuite, tu vas cloner ton fork sur ta machine, par exemple : `git clone "urlDuRepoForké"`
- Une fois dans le dossier cloné, on va créer une nouvelle branche pour ton travail : `cd repoforker && git checkout -b new-cool-feature`
- En codant, tu vas vouloir sauvegarder ton avancement (comme dans un jeu) avec : `git add . && git commit -m "1hpMustNotDied"`
- Jusqu’à maintenant, toutes les modifications sont seulement sur ta machine. Pour les envoyer sur ton fork GitHub : `git push` mais je recommande de faire `git pull` avant de push
- Quand tu auras fini ton travail dans cette branche, tu vas créer une *pull request* (PR) vers mon repo : Va sur GitHub, il y aura un bouton "Create pull request".
- Je recevrai ta PR, je la vérifierai et je la fusionnerai *merge* dans la branche `main` de mon repo.
- Ensuite, tu synchroniseras ta branche `main` locale avec celle de mon repo, qui contient maintenant les dernières modifications :
  - Clique sur le bouton "Sync" sur GitHub de ton fork.
  - Puis ramène les changements en local : `git pull`
- Et tu recommences le cycle :  
  créer une branche → coder → commit → push → PR → sync → pull → recommencer (et passer GO, récolter 200 $ 💰).
  
  

*apprendre git en jouant*
[ohmygit](https://ohmygit.org/)
[learngitbranching](https://learngitbranching.js.org/?locale=en_US)
