<?php

test('guests are redirected to the login page from home', function () {
    $response = $this->get(route('home'));

    $response->assertRedirect(route('login'));
});

test('login page returns a successful response', function () {
    $response = $this->get(route('login'));

    $response->assertOk();
});
