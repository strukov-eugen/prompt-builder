<?php

$router->post('/register', 'PromptBuilder\controllers\AuthController@register');

$router->post('/login', 'PromptBuilder\controllers\AuthController@login');

$router->post('/refresh-token', 'PromptBuilder\controllers\AuthController@refreshToken');