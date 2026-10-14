# 📱 StockFacile - Guide d'Utilisation & Documentation

Bienvenue sur **StockFacile**, votre application web moderne, légère et intuitive pour la gestion de stock et des ventes d'une boutique de téléphones et d'accessoires.

L'application a été conçue pour être **100% fonctionnelle sans aucune installation complexe**, adaptée aussi bien aux ordinateurs portables qu'aux smartphones, avec tous les montants libellés en **Francs CFA (FCFA)**.

---

## 🚀 1. Comment lancer l'application (en 2 secondes)

Comme vous débutez en programmation, vous n'avez pas besoin d'installer de serveur, de base de données ou de logiciels complexes (comme Node.js ou PHP). L'application fonctionne directement dans votre navigateur web (Google Chrome, Microsoft Edge, Mozilla Firefox ou Safari).

### Sur votre ordinateur :
1. Ouvrez le dossier du projet : `c:\Users\TEMP.PROSUMA.004\Desktop\newprojectforphone`.
2. Faites un double-clic sur le fichier **`index.html`** (ou clic droit > *Ouvrir avec* > *Google Chrome* ou *Microsoft Edge*).
3. L'application s'ouvre instantanément !

### Sur votre téléphone mobile :
1. Vous pouvez transférer les 3 fichiers (`index.html`, `style.css`, `app.js`) sur votre téléphone (par exemple via câble USB, WhatsApp Web ou Google Drive).
2. Ouvrez le fichier `index.html` avec le navigateur de votre smartphone (Chrome sur Android ou Safari sur iPhone).
3. L'interface s'adaptera automatiquement à l'écran de votre téléphone avec une barre de menu tactile pratique en bas de l'écran.

---

## 🎯 2. Guide de Test Pas à Pas (Scénario Complet)

Pour tester toutes les fonctionnalités de votre application dès la première utilisation, suivez ce guide étape par étape :

### Étape 1 : Le point de départ (Tableau de bord propre)
- Au démarrage, toutes les statistiques sont à **0** (aucune donnée fictive).
- Le tableau de bord affiche : 0 FCFA de ventes, 0 FCFA de bénéfice, 0 produit en catalogue.

### Étape 2 : Ajouter vos premiers produits au catalogue
1. Cliquez sur l'onglet **Stock & Produits** (ou le bouton bleu *"Nouveau Produit"* sur le tableau de bord).
2. Cliquez sur le bouton bleu **+ Ajouter un Produit**.
3. Remplissez le formulaire avec un premier article :
   - **Nom :** `iPhone 11 128Go Noir`
   - **Catégorie :** `Téléphones`
   - **Prix d'achat (fournisseur) :** `110000` (110 000 FCFA)
   - **Prix de vente (client) :** `145000` (145 000 FCFA)
   - *Notez que l'application calcule immédiatement votre bénéfice prévisionnel : +35 000 FCFA par article !*
   - **Quantité en stock :** `3`
   - **Seuil d'alerte stock :** `2`
4. Cliquez sur **Enregistrer le produit**.
5. Ajoutez un deuxième article (un accessoire) :
   - **Nom :** `Chargeur Rapide 25W Type-C`
   - **Catégorie :** `Chargeurs & Câbles`
   - **Prix d'achat :** `2500` (2 500 FCFA)
   - **Prix de vente :** `6000` (6 000 FCFA)
   - **Quantité en stock :** `10`
   - **Seuil d'alerte :** `3`
   - Cliquez sur **Enregistrer**.

### Étape 3 : Vérifier le tableau de bord
- Rendez-vous sur l'onglet **Tableau de bord**.
- Vous constatez que :
  - Le nombre total de produits est passé à **2**.
  - Le nombre total d'articles physiques est de **13** (3 iPhones + 10 Chargeurs).
  - La valeur marchande totale de votre stock est calculée à partir de vos prix d'achat fournisseur.

### Étape 4 : Enregistrer une première vente
1. Cliquez sur l'onglet **Nouvelle Vente** (ou le bouton **Vendre** en haut à droite).
2. Dans le menu déroulant, sélectionnez l'article : `iPhone 11 128Go Noir [Stock: 3] - 145 000 FCFA`.
3. Les informations de l'article s'affichent instantanément (Stock disponible, Prix unitaire, Marge unitaire).
4. Indiquez la quantité : `1`.
5. Vous voyez en bas :
   - Total à payer par le client : **145 000 FCFA**
   - Bénéfice net estimé : **+35 000 FCFA**
6. Cliquez sur le gros bouton bleu **Valider et Encaisser la vente**.
7. 🎉 **Magie :**
   - Un **reçu de caisse professionnel** s'affiche à l'écran avec la date, l'heure et le récapitulatif ! (Vous pouvez l'imprimer ou le fermer).
   - Le stock de l'iPhone passe immédiatement de **3 à 2**.

### Étape 5 : Observer le déclenchement de l'alerte de stock
1. Retournez sur le **Tableau de bord**.
2. Vos chiffres sont mis à jour en temps réel :
   - Ventes du jour : **145 000 FCFA**
   - Bénéfice du jour : **+35 000 FCFA**
   - Nombre de ventes : **1 vente aujourd'hui**
3. Comme il ne reste que **2 iPhones** et que le seuil d'alerte fixé était de 2, une **bannière d'alerte orange** apparaît en haut :
   > ⚠️ *Alerte de Stock Faible ou Épuisé ! iPhone 11 128Go Noir : Reste 2 (Seuil : 2)*

### Étape 6 : Tester la protection contre la survente
1. Retournez dans **Nouvelle Vente**.
2. Sélectionnez à nouveau l'iPhone (il en reste 2).
3. Essayez de saisir une quantité de `5`.
4. Si vous cliquez sur **Valider**, l'application bloque la vente et affiche :
   > ❌ *Stock insuffisant ! Il ne reste que 2 unité(s) en stock.*
   Cela évite toute erreur de comptabilité !

### Étape 7 : Consulter l'historique et faire un export
1. Cliquez sur l'onglet **Historique**.
2. Vous retrouvez la vente effectuée avec la date, l'heure exacte, le prix et le bénéfice généré.
3. Cliquez sur le bouton **Exporter Excel / CSV** en haut à droite : un fichier compatible avec Microsoft Excel est téléchargé automatiquement !
4. *(Bonus)* Si vous cliquez sur l'icône de retour arrière (flèche violette/rouge), la vente est annulée et l'article est automatiquement réinjecté dans votre stock.

---

## 💾 3. Comment les données sont-elles conservées ? (localStorage)

L'application utilise une technologie web appelée **`localStorage`**.
- Toutes vos données (produits, quantités, prix et historique des ventes) sont enregistrées **directement dans la mémoire locale de votre navigateur**.
- Si vous fermez le navigateur ou redémarrez votre ordinateur, **vos données ne sont pas perdues**. Lorsque vous rouvrez la page, tout réapparaît comme vous l'avez laissé.

> 💡 **Conseil pour débutant :**
> - Ne videz pas l'historique et les cookies de votre navigateur sans précaution, car cela effacerait le `localStorage`.
> - N'utilisez pas le mode "Navigation privée" pour travailler, car la navigation privée supprime les données à la fermeture de la fenêtre.

---

## 📂 4. Structure des fichiers

Le projet est composé de 3 fichiers essentiels, écrits avec un code propre, moderne et commenté :

1. **`index.html`** :
   - La structure de l'application (en-tête, cartes de statistiques, formulaires de saisie, fenêtres modales, reçu de caisse).
   - Utilise des balises sémantiques HTML5 claires.

2. **`style.css`** :
   - Tout le design visuel : couleurs modernes, ombres soignées, polices lisibles, badges colorés.
   - Entièrement responsive : s'adapte automatiquement aux écrans de PC, tablettes et téléphones avec un menu adapté.
   - Contient même les règles CSS pour l'impression propre des tickets de caisse !

3. **`app.js`** :
   - Le moteur JavaScript qui gère la logique métier.
   - Les calculs financiers automatiques (Chiffre d'affaires, Marge unitaire, Bénéfice brut).
   - Les alertes de stock et la mise à jour dynamique des quantités.
   - L'exportation Excel/CSV en encodage UTF-8 francophone.

---

## 🌟 5. Tableau récapitulatif des formules financières

| Indicateur | Formule de calcul |
| :--- | :--- |
| **Marge unitaire** | `Prix de Vente unitaire - Prix d'Achat unitaire` |
| **Total Vente (CA)** | `Quantité vendue × Prix de Vente unitaire` |
| **Bénéfice brut de la vente** | `Quantité vendue × (Prix de Vente - Prix d'Achat)` |
| **Valeur totale du stock** | Somme de `(Quantité en stock × Prix d'Achat)` pour tous les produits |

---

Félicitations pour le lancement de votre commerce ! **StockFacile** est prêt à vous accompagner au quotidien.
