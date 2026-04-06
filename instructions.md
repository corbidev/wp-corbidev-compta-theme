# 📦 Projet CorbiDev – Collection de plugins WordPress

Ce projet regroupe **l'ensemble des plugins WordPress développés par CorbiDev**.  
Il a pour objectif d'assurer une **cohérence technique, fonctionnelle et métier** entre tous les plugins.

---

## 🎯 Objectifs du projet

- Centraliser tous les plugins CorbiDev
- Garantir une convention de nommage stricte
- Faciliter la maintenance, l'évolution et la réutilisation du code

## OBLIGATOIRE 
- Séparer clairement :
  - la **logique métier**
  - la **gestion de la langue / internationalisation**
  - langage séparé (css, js, html, php ...) -voir "🌍 Séparation Langue / Métier"
- Utilisation des classes
- Utilisation de Tailwind CSS, VITE, POSTCSS, shadcn et React
- TOUJOURS compatible multisite et non multisite 

---

## 🧩 Convention de nommage des plugins

### 📌 Nom du dossier et du plugin

Tous les plugins **doivent obligatoirement commencer par** :

```
wp-corbidev-****
```

Exemples :
- `wp-corbidev-env`
- `wp-corbidev-roles`
- `wp-corbidev-security`
- `wp-corbidev-extensions`

### 🏷 Convention de nommage CSS

- Le préfixe des classes CSS est automatiquement dérivé du slug du plugin sans le "wp-" .
- Toutes les classes CSS personnalisées doivent commencer par ce préfixe.
- Pour l'admin, le suffixe -admin- est ajouté au préfixe.
- Aucune classe générique n'est autorisée (sauf cas particulier comme remplacer une classe existante).
- Les classes Tailwind natives sont autorisées uniquement dans :
    - les composants Vue
    - les fichiers CSS utilisant @apply

#### 📌 Exemples concrets
*Plugin*

```
wp-corbidev-modal-auth
```

*Préfixe public :*

```
corbidev-modal-auth-
```

*Admin :*

```
corbidev-modal-auth-admin-
```

---

## 📝 En-tête standard obligatoire

```php
<?php
/**
 * Plugin Name:       Corbidev Extension
 * Plugin URI:        https://github.com/CorbiDev/wp-corbidev-extension
 * Depot Github:      wp-corbidev-extensions
 * Description:       Description du plugin.
 * Version:           1.4.2
 * Author:            CorbiDev
 * Author URI:        https://github.com/CorbiDev
 *
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 *
 * Text Domain:       corbidevextension
 * Domain Path:       /languages
 *
 * Requires at least: 6.0
 * Tested up to:      6.5
 * Requires PHP:      8.4
 *
 * Icone:             assets/icons/favicon.png
 *
 */

if (!defined('ABSPATH')) {
    exit;
}
```
- Version :
On récupère la version dynamiquement : 
exemple pour plugin :
```php
$plugin_data = get_file_data(
    __FILE__,
    array( 'Version' => 'Version' )
);
define('CDE_VERSION', $plugin_data['Version']);
```

---

## 🌍 Séparation Langue / Métier

### 📂 Structure recommandée

``` plaintext
wp-corbidev-nom-du-plugin/
├── admin/
│   ├── assets/
│   │   ├── js/
│   │   └──images/
│   ├── includes/
│   │   ├── Core/
│   │   ├── .../
│   │   └── Helpers.php/
│   └── pages/ (template php)
│ 
├── public/ (si utile)
│ 
├── assets/
│   ├── dist/
│   ├── src/
│   │   ├── admin/
│   │   │   ├── styles/
│   │   │   │   ├── admin.css
│   │   │   │   └── components/
│   │   │   └── main.js
│   │   ├── components/ (.vue)
│   │   ├── styles/
│   │   │   ├── components/
│   │   │   │   ├── base.css (obligatoire)
│   │   │   │   ├── ....
│   │   │   │   └── modal.css (exemple)
│   │   │   └── tailwind.css
│   │   ├── App.vue
│   │   └── main.js
│   ├── images/
│   └── icons/
│ 
├── includes/
│   ├── Core/
│   ├── .../
│   ├── Helpers.php/
│   └── autoload.php
│
├── languages/
├── loader/
│   └── bootstrap.php
├── wp-corbidev-nom-du-plugin.php
├── package.json
├── postcss.config.js
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## 🧠 Logique métier

- Aucune chaîne affichable.
- Aucun message lisible par un humain.
- Aucun HTML.
- Aucun affichage.
- Code métier uniquement.
- Pas de Tailwind dans les templates (uniquement dans des components bien organisés par catégorie).
- Si Tailwind et Vite :
  - les `@import` sont toujours avant les `@tailwind`.

---

## 🧠 Gestion des erreurs métier

- Interdiction totale d'utiliser `WP_Error` dans `includes/Core`.
- Le Core ne doit dépendre d'aucune classe ou fonction WordPress.
- Aucune fonction de traduction (`__()`, `_e()`, `esc_html__()`, etc.) n'est autorisée dans le Core.
- Aucune fonction d'affichage WordPress (`wp_die()`, `wp_send_json_*`, `add_settings_error()`, etc.) n'est autorisée dans le Core.
- Les erreurs doivent être retournées uniquement sous forme de :
  - booléens,
  - tableaux structurés,
  - objets métiers,
  - exceptions métier avec code neutre.

---

## 📌 Standardisation des codes d'erreur

Les codes d'erreur doivent obligatoirement :

- Être en **anglais**.
- Être en **snake_case**.
- Ne contenir **aucun espace**.
- Représenter un **état métier**, jamais un message.
- Être **stables dans le temps** (rétrocompatibilité obligatoire).
- Ne jamais être modifiés sans gestion de rétrocompatibilité.

### ✅ Exemples valides

``` plaintext
invalid_role
role_not_found
permission_denied
invalid_nonce
settings_not_saved
delete_failed create_failed
```

### ❌ Exemples interdits

``` plaintext
Role not found
invalid role
Erreur role role-error
Erreur suppression
```

---

## 📌 Transformation des erreurs

La transformation des codes d'erreur en :

- `WP_Error`
- messages traduits
- réponses JSON
- notices admin
- messages REST

doit être effectuée exclusivement dans :

- les Controllers Admin,
- les Controllers REST,
- les Handlers Ajax.

Le Core ne doit jamais produire de message destiné à l'affichage.

---

## 📌 Rétrocompatibilité

Si un code d'erreur doit évoluer :

- L'ancien code doit être conservé.
- Une gestion de compatibilité doit être mise en place.
- Toute suppression de code doit être documentée.

---

## 🌐 Internationalisation

- Toutes les chaînes visibles doivent être traduisibles
- Utilisation obligatoire de `__()`, `_e()`, `esc_html__()` dans les couches d'affichage uniquement (admin, public, controllers).
- Aucune fonction de traduction n'est autorisée dans `includes/Core`.
- Fichiers `.po` / `.mo` dans `/languages` (ils seront créer par le plugin WP loco translate)

---

## 🧪 Bonnes pratiques

- Version php 8.4 assumé :
   - Le code doit être strictement compatible avec la version PHP déclarée dans l'en-tête du plugin.
   - Toute fonctionnalité spécifique à une version PHP doit être volontaire et assumée.
   - Aucune syntaxe expérimentale ou non stable n'est autorisée.
- Compatible WordPress classique & Bedrock
- Compatible multisite 
- Accès restreint (admin / webmaster)
- Versionnement sémantique
- Code propre et commenté (jsdoc phpdoc)
   - Ne jamais supprimer les commentaires existants sauf demande explicite.
   - Si un commentaire devient incohérent suite à une modification demandée, il doit être adapté uniquement dans le périmètre concerné.
   - Aucun commentaire ne doit être modifié hors périmètre d'intervention.

- Faire des fonctions et méthodes le plus simple possible. 

- Affichage public :
   - template vue
- Affichage admin :
  - template php
- Aucune régression toléré
- Gestion rétro-compatibilté :
   - si on modifie une méthode, fonction, classe qui étudie de cassé la rétro-compatibilté, on crée un nouvel élément et on note l'ancien comme obsolète et par quoi et comment le remplacer.
- Ne jamais fournir du code incomplet, d'exemple
- Toujours se référer, lire et analyser le dernier zip explicitement fourni dans la conversation.
   - Si aucun zip n'est fourni dans la conversation mais qu'un zip est disponible dans les fichiers du projet accessibles, celui-ci doit être utilisé comme référence.
   - Si aucun zip n'est disponible ni dans la conversation ni dans les fichiers du projet, aucune analyse structurelle ne doit être supposée.
   - Aucune hypothèse sur une structure non fournie n'est autorisée.
   - Il est interdit de demander un zip si celui-ci est déjà accessible dans la conversation ou dans les fichiers du projet.
   - Le dernier zip disponible constitue la source de vérité structurelle.
   - Les corrections issues de la conversation doivent être appliquées uniquement si elles sont explicitement demandées et compatibles avec le dernier zip disponible.
      - Un nouveau zip ne peut être demandé que si :
          - une modification structurelle est explicitement mentionnée,
          - ou si le zip disponible ne correspond plus aux éléments explicitement décrits dans la conversation.
      - Les corrections ne peuvent concerner que les éléments explicitement identifiés comme modifiables dans la conversation.
- Interdiction de supposer
- Pas d'initiative, si c'est ainsi et que ça fonctionne, il y a sûrement une bonne raison.
   - en cas de doute, toujours demander. 
- Ne jamais redemander confirmation de faire le code si je t'ai déjà demandé de le faire.

---

## 📌 Périmètre strict d'intervention

Lors de la modification d'un fichier :

- Le fichier doit être réécrit en entier.
- Seuls les éléments explicitement identifiés dans la conversation peuvent être modifiés.
- Aucun autre élément ne doit être altéré, même si une amélioration semble évidente.
- Aucune refactorisation implicite n'est autorisée.
- Aucune correction non demandée n'est autorisée.
- Aucun changement de structure, d'ordre, d'import, d'indentation ou de commentaire n'est autorisé sauf si explicitement demandé.
- Donner le maximum d'information sur les modifications (pourquoi, emplacement précis dans le fichier).

Toute modification hors périmètre constitue une violation des règles du projet.

---

## ‼️ CONSIGNES 

- Ne jamais se référer aux conversations en dehors du projet.
- Ne jamais tenir compte de messages contenant des erreurs identifier 
- Toujours identifier si tu commence à "Halluciné"
  - Toujours demander ce que je dois faire si tu dectectes toute forme d'hallucinations.
- Interdiction de derogé instructions sauf demande expresse de la part. 
   - toujours demander validation et expliquer les risques.

---

✍️ Auteur : CorbiDev  
🔗 https://github.com/CorbiDev

---

TOUTES LES REPONSES PROVIENNENT UNIQUEMENT DE CE PROJET
NE PA SE REFERER AUX AUTRES PROJETS OU CONVERSATIONS HORS DE CE PROJET