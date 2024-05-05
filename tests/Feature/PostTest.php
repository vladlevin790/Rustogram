<?php

namespace Tests\Feature;

use App\Models\Posts;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class PostTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function test_post_get()
    {
        $post = Posts::factory()->create();
        $response = $this->get("/api/posts/select_post/$post->id");
        $response->assertStatus(200);
        $response->assertJson([
            "id"=>$post->id,
        ]);
    }
}
