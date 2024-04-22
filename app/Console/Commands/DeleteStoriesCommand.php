<?php

namespace App\Console\Commands;

use App\Models\Looked_stories;
use Illuminate\Console\Command;
use App\Models\Stories;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class DeleteStoriesCommand extends Command
{
    protected $signature = 'stories:delete';

    protected $description = 'Delete stories older than 24 hours';

    public function handle()
    {
        $stories = Stories::where('created_at', '<', Carbon::now()->subHours(24))->get();
        foreach ($stories as $story) {
            Looked_stories::where('story_id', $story->id)->delete();
            if($story->image_path != null) {
                $imagePath = str_replace('http://localhost:8000/storage/', 'public/', $story->image_path);
                Storage::delete($imagePath);
            }
            if($story->video_path != null) {
                $videoPath = str_replace('http://localhost:8000/storage/', 'public/', $story->video_path);
                Storage::delete($videoPath);
            }
            $story->delete();
        }

        $this->info('Deleted '.count($stories).' stories.');
    }
}

