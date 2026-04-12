<?php

namespace CorbiDev\Core;

/**
 * Classe principale du thème
 *
 * Rôle :
 * - Initialiser les composants du thème
 */
class Theme
{
    /**
     * Initialise le thème
     *
     * @return void
     */
    public function init(): void
    {
        Hooks::init();
        Assets::init();
        Admin::init();
    }
}