<?php

$router->get('/', 'PromptBuilder\controllers\PromptController@getAll');

$router->get('/{id}', 'PromptBuilder\controllers\PromptController@get');

$router->post('/', 'PromptBuilder\controllers\PromptController@create');

$router->put('/{id}', 'PromptBuilder\controllers\PromptController@update');

$router->delete('/{id}', 'PromptBuilder\controllers\PromptController@delete');