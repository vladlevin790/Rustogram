<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class CreationPostTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_post_create()
    {
        $post = [
            'user_id' => 1,
            'image_path' => 'http:://example.com',
            'video_path' => null,
            'description' => 'hello world',
        ];

        $response = $this->post('/api/posts',$post);
        $response->assertStatus(201);
    }
}
