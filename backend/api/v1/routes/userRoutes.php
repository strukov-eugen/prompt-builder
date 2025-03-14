<?php

$router->get('/me', 'PromptBuilder\controllers\UserController@getCurrentUser');

$router->get('/', 'PromptBuilder\controllers\UserController@getUsers');

$router->post('/', 'PromptBuilder\controllers\UserController@create');

$router->put('/{id}', 'PromptBuilder\controllers\UserController@update');

$router->delete('/{id}', 'PromptBuilder\controllers\UserController@delete');