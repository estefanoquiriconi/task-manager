<?php

test('the application redirects root to the api docs', function () {
    $response = $this->get('/');

    $response->assertRedirect('/docs/api');
});
